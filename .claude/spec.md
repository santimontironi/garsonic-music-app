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
| `Song` | Pertenece a un artista (`artistId` → `User`) y, opcionalmente, a un álbum. `cover` + `coverPublicId` (opcionales). |
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
- Al borrar un `User` o una `Playlist` se borran en cascada sus dependencias (un artista borrado se lleva sus álbumes y canciones). Al borrar un `Album`, sus canciones quedan sin álbum (`albumId = null`).
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

## Rate limiting

Todos los endpoints tienen rate limit.

- Endpoints de auth (login, register, cambiar clave): **5 requests por minuto**.
- Resto de los endpoints: **70 requests por minuto**.

## Estado actual

- Backend: NestJS recién inicializado (solo `main.ts` y `app.module.ts`). Prisma todavía no está instalado, y falta el `prisma.config.ts` con la URL de la base.
- Frontend: Vite + React inicializado, sin pantallas todavía.
