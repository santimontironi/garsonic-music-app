# Garsonic — Spec técnica

## Estructura del repo

| Carpeta | Contenido |
|---|---|
| `backend/` | API en NestJS (TypeScript, ESM) con Prisma y PostgreSQL. Tests con Vitest. |
| `frontend-web/` | Web en React 19 + Vite + Tailwind 4, con `react-router-dom` y `axios`. |
| `shared/` | Paquete compartido entre front y back (todavía vacío). |

Cuando el frontend web esté terminado, se empieza el frontend Android/iOS en React Native, que consume la misma API del backend.

## Modelo de datos

El schema está en `backend/prisma/schema.prisma`.

| Tabla | Para qué sirve |
|---|---|
| `User` | Cuenta de usuarios y artistas: `name`, `surname`, `username` (único), `email` (único), `emailVerified` (arranca en `false`), `password`, `role` (`USER` / `ARTIST`), `photo` + `photoPublicId`, `bio` (opcional, pensada para artistas). |
| `Album` | Pertenece a un artista (`artistId` → `User`) y agrupa canciones. `cover` + `coverPublicId` (opcionales). |
| `Song` | Pertenece a un artista (`artistId` → `User`) y, opcionalmente, a un álbum. Tiene un género obligatorio (`genreId` → `Genre`). `cover` + `coverPublicId` (opcionales). |
| `Genre` | Catálogo de géneros. `name` es el enum `GenreName` (único), así solo existen los géneros definidos en el schema. |
| `Playlist` | Pertenece a un usuario (`ownerId`). Puede ser pública o privada. `image` + `imagePublicId` (obligatorios). |
| `SongPlaylist` | Tabla intermedia playlist ↔ canción, con `position` para ordenarlas. |
| `FavArtist` | Artistas favoritos de un usuario (`userId` y `artistId` apuntan a `User`). |
| `FavSong` | Canciones favoritas de un usuario. |

Decisiones:

- No hay tabla `Artist`: usuarios y artistas son la misma tabla `User`, distinguidos por `role`. `username` es el nombre de usuario para los usuarios y el nombre artístico para los artistas.
- La base no garantiza que `Song.artistId`, `Album.artistId` y `FavArtist.artistId` apunten a un `User` con `role = ARTIST`: esa validación va en el service.
- `FavArtist` tiene dos relaciones a `User`, por eso están nombradas: `UserFavArtists` (el que marca el favorito) y `ArtistFans` (el artista marcado).
- Las tablas intermedias (`SongPlaylist`, `FavArtist`, `FavSong`) usan clave primaria compuesta, así no hay duplicados.
- No hay `@@index` en el schema: solo existen los índices implícitos de `@id` y `@unique`. Si alguna consulta se vuelve lenta, se agregan con una migración.
- Al borrar un `User` o una `Playlist` se borran en cascada sus dependencias (un artista borrado se lleva sus álbumes y canciones). Al borrar un `Album`, sus canciones quedan sin álbum (`albumId = null`) y su portada se borra de Cloudinary. Al borrar una `Playlist` se borran sus `SongPlaylist` (las canciones no) y después su imagen de Cloudinary. Al borrar un `Song` se borran sus `SongPlaylist` y `FavSong`, y después su audio y portada de Cloudinary (si Cloudinary falla, los archivos quedan huérfanos pero la canción ya no existe).
- Los géneros son una tabla (`Genre`) cuyo `name` es el enum `GenreName`: la tabla permite sumarle datos propios a futuro y el enum limita los valores posibles. Agregar un género requiere una migración (nuevo valor del enum) y su fila en `Genre`. La lista se repite en `shared/schemas/genre.schema.ts` (Zod + etiquetas en español para la interfaz); al cambiar el enum hay que actualizar ambos. Un `Song` tiene un solo género y no se puede borrar un `Genre` que tenga canciones (`onDelete: Restrict`).
- Un `Song` tiene un solo artista. Si hicieran falta colaboraciones (feats), habría que reemplazar `Song.artistId` por una tabla `SongArtist`.
- Todos los `id` (y las FK que apuntan a ellos) son `String @default(uuid()) @db.Uuid`, no autoincrement: evita exponer IDs secuenciales/adivinables en la API.

## Autenticación y mails

- **Autenticación:** JWT guardado en cookies.
- **Envío de mails:** Nodemailer, para dos casos:
  - Confirmar la cuenta del usuario: al confirmarla, `User.emailVerified` pasa a `true`.
  - Resetear la clave.

## Imágenes

Las fotos (perfil de usuario/artista, portada de álbum, portada de canción, portada de playlist) se suben a **Cloudinary**. Configuración en `backend/src/config/cloudinary.config.ts`, credenciales en `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`.

Cada campo de imagen (`photo`, `cover`, `image`) tiene su par `*PublicId` (`photoPublicId`, `coverPublicId`, `imagePublicId`) que guarda el `public_id` de Cloudinary. Es necesario porque `cloudinary.uploader.destroy()` pide el `public_id`, no la URL, y parsearlo desde la URL es frágil. Al borrar un registro que tiene imagen, se usa ese `public_id` para borrarla también de Cloudinary, no solo el registro en la base.

## Estadísticas del artista

La sección "Estadísticas" del panel de artista muestra, por ahora, solo lo que se puede calcular con el schema actual:

| Estadística | De dónde sale |
|---|---|
| Seguidores (fans) | Cantidad de `FavArtist` que apuntan al artista. |
| Favoritos por canción y canciones más guardadas | Cantidad de `FavSong` por canción. |
| En cuántas playlists aparece cada canción | Cantidad de `SongPlaylist` por canción. |
| Total de canciones, álbumes y singles | `Song` y `Album` del artista; los singles son las canciones con `albumId = null`. |

Las reproducciones quedan afuera hasta que exista el reproductor: no hay tabla ni campo que las cuente. A futuro se evaluará agregar una tabla `Play` (canción, usuario y fecha) para tener reproducciones por período y oyentes únicos.

## Rate limiting

Todos los endpoints tienen rate limit, contado por IP con `@nestjs/throttler`.

- Endpoints de auth (login, register, cambiar clave): **5 requests por minuto**, con contador propio por endpoint.
- Resto de los endpoints: **70 requests por minuto** (guard global en `AppModule`).
- Al pasarse del límite responde **429** con el mensaje `Demasiadas solicitudes, probá de nuevo en un minuto`.
- El backend usa `trust proxy = 1` para tomar la IP real del cliente detrás del proxy de Vercel.
- El contador vive en memoria: en Vercel cada instancia lleva el suyo, así que el límite es por instancia. Si hace falta un límite exacto, se conecta Redis como storage.
- Pendiente: cuando exista el endpoint de cambiar clave, lleva `@Throttle` con 5/min como login y register.

## Búsqueda

- Un único endpoint `GET /search?q=` para ambos roles (requiere login, sin restricción de rol).
- `q` obligatorio, entre 1 y 50 caracteres (trim).
- Busca con `contains` case-insensitive en:
  - **Artistas:** usuarios con rol ARTIST por `username`, `name` o `surname`.
  - **Usuarios:** usuarios con rol USER por `username`, `name` o `surname`.
  - **Canciones:** por `title`.
  - **Álbumes:** por `title`.
  - **Playlists:** por `name`, solo las públicas.
- Sin `type`: devuelve un objeto con las 5 entidades, cada una limitada a 5 resultados: `{ artists, users, songs, albums, playlists }`.
- **Ver más por categoría:** con `type` (`artists | users | songs | albums | playlists`) y `page` (entero ≥ 1, por defecto 1) devuelve solo esa entidad, paginada de a 20: `{ [type]: [...] }`.
- En el front, cada categoría con 5 resultados muestra un botón "Ver más" que abre la vista de esa categoría (con "Volver" y "Cargar más" mientras lleguen páginas completas de 20).
- Nunca se exponen `email`, `password` ni los `*PublicId`.
- En el front se busca mientras se escribe, con debounce de ~300 ms. Un solo componente de búsqueda para ambos roles.

## Perfil público

- `GET /users/:id` (requiere login, ambos roles).
- Devuelve `id, username, name, surname, photo, bio, role, createdAt`.
- Si es ARTIST, incluye sus álbumes y canciones.
- Si es USER, incluye sus playlists públicas.

## Visibilidad de playlist

- `PATCH /playlists/:id` (solo USER, dueño de la playlist) con `{ isPublic: boolean }`: recibe el estado final, no alterna. Así es idempotente (doble click o reintento no la dan vuelta).
- Playlist inexistente o de otro usuario → 404. Devuelve `{ isPublic }`.

## Editar perfil

- `PATCH /users/me` (requiere login, ambos roles), multipart con `username` y/o `photo` (imagen, máx. 5 MB). Sin ninguno de los dos → 400.
- `username` repetido → 409. La foto nueva se sube a Cloudinary (`users`) y, guardado el cambio, se borra la anterior.
- Devuelve el mismo usuario que `/auth/me`; el front lo usa para actualizar la sesión.
- En "Perfil", el botón de cámara abre el selector de archivos y sube la foto al elegirla; el lápiz edita el nombre de usuario en línea.

## Deploy

- **Plataforma:** Vercel, con dos proyectos separados sobre el mismo repo (Root Directory `backend` y `frontend-web`). Base de datos en Neon.

### Base de datos (Neon)

1. Crear las tablas con las migraciones, nunca a mano: `npx prisma migrate deploy`. Prisma registra lo aplicado en `_prisma_migrations`; si una tabla o enum se crea a mano, la próxima migración falla porque ya existe.
2. Cargar los géneros desde el editor SQL de Neon. Toma todos los valores del enum `GenreName` y se puede correr varias veces sin duplicar (al agregar un género al enum, se vuelve a correr):

```sql
INSERT INTO "Genre" (id, name)
SELECT gen_random_uuid(), unnest(enum_range(NULL::"GenreName"))
ON CONFLICT (name) DO NOTHING;
```

### Build del backend

El backend consume `shared` compilado (`shared/dist`, en `.gitignore`) y el cliente de Prisma generado (`src/generated/prisma`, en `.gitignore`). Los scripts `pre*` de `backend/package.json` los generan automáticamente:

- `prebuild` (antes de `npm run build`, el que corre Vercel): compila `shared` y corre `prisma generate`.
- `prestart:dev` (antes de `npm run start:dev`): compila `shared`. Si se cambia un schema de `shared` con el backend corriendo, hay que reiniciarlo.

### Pendientes antes del deploy

- **Renombrar el paquete `shared` a `@garsonic/shared`:** existe un paquete público `shared` en npm; si la instalación se hiciera desde la subcarpeta sin workspaces, se bajaría ese (dependency confusion).
- **Vercel:** verificar que esté activo "Include files outside the root directory in the Build Step", para que el build acceda a `shared/`.

## Estado actual

- Backend: NestJS recién inicializado (solo `main.ts` y `app.module.ts`). Prisma todavía no está instalado, y falta el `prisma.config.ts` con la URL de la base.
- Frontend: Vite + React inicializado, sin pantallas todavía.
