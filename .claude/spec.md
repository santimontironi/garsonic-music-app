# Garsonic — Spec técnica

## Estructura del repo

| Carpeta | Contenido |
|---|---|
| `backend/` | API en NestJS (TypeScript, ESM) con Prisma y PostgreSQL. Tests con Vitest. |
| `frontend-web/` | Web en React 19 + Vite + Tailwind 4, con `react-router-dom`, `axios`, TanStack Query y `react-hook-form` + Zod. |
| `shared/` | Paquete compartido entre front y back: schemas de Zod en `shared/schemas` (validan los bodies en el backend y las respuestas y formularios en el front; los tipos salen con `z.infer`). |

Cuando el frontend web esté terminado, se empieza el frontend Android/iOS en React Native, que consume la misma API del backend.

### Reutilización en mobile

Lo único compartido son los schemas de `shared/schemas`, que son el contrato de datos (los tipos salen de ahí con `z.infer`). Los `services`, `types` y `hooks` de `frontend-web/src` **se copian** a `frontend-mobile/src` y no se mueven a un paquete compartido:

- Son pocos y finos (cada service es una llamada de axios más un `parse` contra el schema). Compartirlos obligaría a inyectar la instancia de axios de cada app (un `setApi()` en el paquete), y esa complejidad no se justifica al arrancar.
- Si el backend cambia la forma de una respuesta, el `parse()` falla en las dos apps, así que esa divergencia se detecta sola. Lo que **no** se detecta es un cambio de ruta o de parámetros: al tocar un endpoint hay que actualizar los services de las dos apps.
- Si mantener las dos copias sincronizadas se vuelve frecuente, se pasan los services a `shared` con el patrón `setApi()`.
- Cada app tiene su propio `api.ts` y sus services adaptados, porque cambian tres cosas:
  1. **URL del backend:** la web usa `import.meta.env.VITE_BACKEND_URL` (propio de Vite); mobile usa las variables de su entorno (por ejemplo Expo).
  2. **Autenticación:** en React Native las cookies no son confiables. Mobile guarda el JWT en `SecureStore` y lo manda en `Authorization: Bearer ...`, así que el backend tiene que aceptar el token también por header, no solo por cookie.
  3. **Archivos:** la web manda un `File` en el `FormData`; en React Native no existe `File` y se manda `{ uri, name, type }`.

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
- **Envío de mails:** Nodemailer, para tres casos:
  - Confirmar la cuenta del usuario: al confirmarla, `User.emailVerified` pasa a `true`.
  - Recuperar la clave (ver Olvidé mi contraseña).
  - Avisar que se cambió la clave (ver Cambiar clave).

## Olvidé mi contraseña

Usa el mismo patrón que la confirmación de cuenta: un JWT con secret propio, sin guardar nada en la base y sin migración.

- `POST /auth/forgot-password` con `{ email }`: si existe un usuario con ese email, le manda un mail con el link `${FRONTEND_URL}/recuperar-clave/:token`. Responde siempre el mismo mensaje, exista o no el email, para no revelar qué cuentas están registradas.
- `POST /auth/forgot-password/:token` con `{ password }`: valida el token, hashea la clave nueva y la guarda. Token inválido o vencido → 400.
- **Token:** JWT de 20 minutos con `{ sub: user.id }`, firmado con `JWT_FORGOT_SECRET` concatenado con el hash de la clave actual del usuario. Al cambiar la clave cambia el hash y el link deja de servir, así que es de uso único. Para verificarlo, primero se lee el `sub` con `decode` (sin verificar), se busca el usuario y después se verifica con su secret.
- Los dos endpoints llevan `@Throttle` de 5 por minuto, como login y register.
- **Front:** el `ForgotPasswordModal` del login llama al primer endpoint y muestra el mensaje. La página `/recuperar-clave/:token` tiene el formulario de la clave nueva (con confirmación) y, si sale bien, redirige al login.
- Es distinto de "cambiar clave", que se hace con la sesión iniciada desde el perfil (ver Cambiar clave).

## Cambiar clave

Para ambos roles (USER y ARTIST), con la sesión iniciada.

- `PATCH /auth/password` con `{ currentPassword, newPassword }`, requiere login y no tiene restricción de rol.
- **Validaciones:**
  - `newPassword` sigue las mismas reglas que la clave del registro y tiene que ser distinta de `currentPassword`.
  - Si `currentPassword` no coincide con la clave guardada → 400 con un mensaje claro.
- **Si sale bien:** hashea y guarda la clave nueva y le manda al usuario un mail de aviso ("tu contraseña se cambió. Si no fuiste vos, recuperá tu cuenta desde 'Olvidé mi contraseña'"). La sesión **no** se cierra: el usuario sigue logueado.
- Lleva `@Throttle` de 5 por minuto, como login y register.
- Efecto secundario buscado: los links de "Olvidé mi contraseña" pedidos antes del cambio dejan de servir, porque su firma depende del hash de la clave.
- Las otras sesiones abiertas (otros navegadores) siguen válidas hasta que vence su JWT: el backend no guarda sesiones.
- **Front:** el botón "Cambiar clave" y el modal con el formulario están dentro de la sección del perfil, en el panel de los dos roles. El formulario tiene clave actual, clave nueva y confirmación de la clave nueva; la confirmación se valida solo en el front. Si sale bien, muestra un mensaje de éxito y cierra el modal.

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
| Minutos de música | Suma de `durationSec` de las canciones del artista, redondeada a minutos. |

Todo sale de un único endpoint `GET /users/me/stats` (solo ARTIST). Las tarjetas de totales viven solo en esta sección, no en el home del artista. La tabla de canciones muestra solo las que tienen al menos un favorito o una playlist.

Las reproducciones quedan afuera hasta que exista el reproductor: no hay tabla ni campo que las cuente. A futuro se evaluará agregar una tabla `Play` (canción, usuario y fecha) para tener reproducciones por período y oyentes únicos.

## Rate limiting

Todos los endpoints tienen rate limit, contado por IP con `@nestjs/throttler`.

- Endpoints de auth (login, register, forgot password, cambiar clave) y contacto: **5 requests por minuto**, con contador propio por endpoint.
- Resto de los endpoints: **70 requests por minuto** (guard global en `AppModule`).
- Al pasarse del límite responde **429** con el mensaje `Demasiadas solicitudes, probá de nuevo en un minuto`.
- El backend usa `trust proxy = 1` para tomar la IP real del cliente detrás del proxy de Vercel.
- El contador vive en memoria: en Vercel cada instancia lleva el suyo, así que el límite es por instancia. Si hace falta un límite exacto, se conecta Redis como storage.

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
- Incluye `isFav` (si quien mira lo tiene de favorito).

## Artistas favoritos

- Solo USER marca favoritos, y solo a usuarios con `role = ARTIST`.
- `POST /users/:id/fav`: alterna. Si ya es favorito lo saca, si no lo marca. Si no existe o no es ARTIST → 404. No es idempotente: el botón queda deshabilitado mientras se guarda para que un doble click no lo dé vuelta.
- `GET /users/me/fav-artists`: lista `id, username, name, surname, photo` de mis artistas favoritos, del más reciente al más viejo.
- Se listan en la sección "Artistas favoritos" del panel de USER; al tocar uno se abre su perfil público.

## Canciones favoritas

- Solo USER marca canciones como favoritas, igual que los artistas favoritos.
- `POST /songs/:id/fav`: alterna. Si ya es favorita la saca, si no la marca. Canción inexistente → 404. Como no es idempotente, el botón queda deshabilitado mientras se guarda.
- `GET /songs/fav`: lista mis canciones favoritas, de la más reciente a la más vieja. Cada una trae `artist` (`id`, `username`) y `album` (`id`, `title`, `cover`; `null` en los singles), sin `*PublicId`. El contrato es `favSongSchema` de `shared`.
- Los dos endpoints están en el módulo `songs` con `@Roles('USER')` a nivel de método, que pisa el `ARTIST` del controller.
- **Corazón en `SongCard`:** con `showFav` (solo si el que mira es USER) aparece arriba a la izquierda de la portada, en álbum, playlist, perfil público, búsqueda y la sección de favoritas. Lo dibuja `FavSongButton`, que es un componente aparte para que sus hooks corran solo para USER (al ARTIST, `GET /songs/fav` le daría 403).
- **Cómo se sabe si es favorita:** las respuestas de álbum, playlist, perfil y búsqueda no traen `isFav`. Cada corazón busca la canción en la lista de `useFavSongs`, que está cacheada con la key `fav-songs`, así que hay un solo pedido por pantalla. Al alternar se invalida esa key y la mutación sigue pendiente hasta que llega la lista nueva, para que un doble click no la dé vuelta.
- **Sección "Canciones favoritas"** del panel de USER: grilla de `SongCard`. Al tocar una se reproduce con todas las favoritas como cola, y la portada cae a la del álbum si la canción no tiene una propia.

## Contacto

- `POST /contact`: público, sin login. El body se valida con `contactSchema` de `shared` (`name`, `email`, `message`).
- Rate limit de 5 por minuto con `@Throttle`, igual que login y register, porque es público y se puede usar para spam.
- Nodemailer manda el mensaje a la misma cuenta que envía los mails (`EMAIL_USER`), así que no hace falta otra variable. El `email` de quien escribe va como `replyTo`, para poder responderle directo. Lo que escribe el usuario se escapa antes de meterlo en el HTML del mail.
- Si el mail no sale, responde 503 y el front muestra el error.
- El formulario de la landing (`Contact`) llama al endpoint, muestra un mensaje de éxito o de error y se limpia solo si el envío salió bien.

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

`main.ts` termina con `void bootstrap()`, sin `await`. En Vercel `app.listen()` queda interceptado y su promesa nunca resuelve: con top-level await el módulo no termina de cargar y cada request muere por timeout (500 `FUNCTION_INVOCATION_FAILED` a los 60 s, sin logs de runtime).

### Rutas del frontend (SPA)

El frontend es una SPA con React Router: en Vercel, recargar o entrar directo a una ruta interna (`/login`, `/user/...`) da 404 porque no existe un archivo con ese nombre. Se resuelve con `frontend-web/vercel.json`, que además hace el proxy al backend (ver Cookies entre front y back):

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://garsonic-backend.vercel.app/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- El orden importa: Vercel aplica la primera regla que coincide, así que `/api` va antes que el catch-all. Los archivos reales del build (`/assets/*`) se sirven antes de los rewrites.
- El destino es el dominio estable del proyecto `garsonic-backend` (no la URL de cada deploy). `vercel.json` no lee variables de entorno: si Vercel asigna otro nombre, hay que cambiar esa línea.

### Cookies entre front y back

El front y el back quedan en subdominios distintos de `vercel.app`, que está en la Public Suffix List: para el navegador son sitios distintos y la cookie del JWT es de terceros. Con `sameSite: 'none'` y `secure` funciona en Chrome, pero Safari y los navegadores que bloquean cookies de terceros la rechazan y el login no anda. Opciones:

- **Proxy por rewrite:** el `vercel.json` del front reescribe `/api/(.*)` al backend y `VITE_BACKEND_URL` pasa a ser `/api`. Todo queda en el mismo origen: la cookie es propia y no hace falta CORS en producción.
- **Dominio propio:** front y back en subdominios del mismo dominio (por ejemplo `app.` y `api.`), y la cookie pasa a ser del mismo sitio.

**Decisión: proxy por rewrite.** `VITE_BACKEND_URL=/api` en el proyecto del front en Vercel y la cookie con `sameSite: 'lax'` en todos los entornos. CORS se mantiene solo para desarrollo (front y back en puertos distintos). Pendiente: una vez deployado, verificar con un log de `req.ip` que el back recibe la IP real del usuario a través del rewrite; si llega la de Vercel, todos comparten el contador del rate limit y hay que ajustar `trust proxy`.

### CD (deploy continuo)

Todo lo que entra a `master` se deploya a producción en Vercel, tanto `backend` como `frontend-web`. No se usa la integración de Git de Vercel: el CD lo hace GitHub Actions con la CLI de Vercel (es a propósito, para practicar el flujo por terminal).

- **Proyectos:** `garsonic-backend` y `garsonic-frontend`, creados con `vercel project add` (crea el proyecto sin linkear carpetas ni conectar el repo), con Root Directory `backend` y `frontend-web`. Ninguno está conectado al repo de GitHub, así que Vercel no se entera de los pushes y no deploya por su cuenta.
- **Configuración de los proyectos** (Settings → Build and Deployment): preset NestJS en el back y Vite en el front, "Include files outside the root directory in the Build Step" activado en los dos (necesitan `../shared`), Node.js 22.x (igual que el CI) y build por defecto. Install por defecto en el front; en el back, `npm install --include=dev`: con `NODE_ENV=production` cargada, npm saltea las `devDependencies` (husky, `@nestjs/cli`, `typescript`, `prisma`) y el build las necesita.
- **Variables de entorno** (Settings → Environment Variables, entorno Production):
  - Back (marcadas como Sensitive): `DATABASE_URL` (la URL `-pooler` de Neon con `sslmode=verify-full`), `JWT_SECRET`, `JWT_CONFIRM_SECRET` y `JWT_FORGOT_SECRET` (nuevos, distintos a los de desarrollo), `CLOUDINARY_*`, `EMAIL_USER`, `EMAIL_PASS`, `FRONTEND_URL=https://garsonic-frontend.vercel.app` y `NODE_ENV=production`. `PORT` no va.
  - Front: `VITE_BACKEND_URL=/api`. Queda incrustada en el JS durante el build, así que tiene que estar cargada antes del deploy.
- **Workflow:** se extiende `.github/workflows/ci.yml` para que también corra en los push a `master`. Los jobs de deploy corren solo en ese caso y dependen de los jobs de lint y typecheck (`needs`), así que no se deploya un commit que no pasa los checks. `master` tiene branch protection: para mergear hay que pasar el CI y no se puede pushear directo.
- **Pasos de cada deploy**, desde la raíz del repo (la CLI toma el Root Directory de los settings que baja `vercel pull`; correrlos desde la subcarpeta duplica la ruta):
  1. `vercel pull --yes --environment=production --token=...`
  2. `vercel build --prod --token=...` (el build se hace en el runner de GitHub)
  3. `vercel deploy --prebuilt --prod --token=...`
- **Migraciones:** el job del backend corre `prisma migrate deploy` contra la base de producción antes de deployar. Si la migración falla, no se deploya nada.
- **Orden:** el deploy del frontend espera al del backend (`needs: [deploy-backend]`), para que un front nuevo nunca le pegue a un backend viejo.
- **Secretos en GitHub:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_BACKEND`, `VERCEL_PROJECT_ID_FRONTEND` y `DATABASE_URL` (producción).
- **Limitaciones aceptadas:** se deployan los dos proyectos en cada merge aunque haya cambiado uno solo (se puede filtrar por paths más adelante), y no hay deploys de preview (serían otro job con `vercel deploy` sin `--prod`).

### Pendientes antes del deploy

- ~~**Dependency confusion con `shared`.**~~ Existe un paquete público `shared` en npm; con `"shared": "*"`, una instalación sin workspaces bajaba ese. Se resolvió con `"shared": "file:../shared"` en `backend` y `frontend-web`: npm nunca lo busca en el registro y, si no encuentra la carpeta, falla.
- ~~**Vercel:** verificar que esté activo "Include files outside the root directory in the Build Step".~~ Hecho en los dos proyectos.
- **CD:** crear los proyectos con `vercel link`, cargar los secretos en GitHub y sumar los jobs de deploy a `ci.yml` (ver CD).
- ~~**Tests en el CI.**~~ Se saca de los pendientes del deploy: el backend todavía no tiene tests. Cuando se escriban, se suma `npm run test -w backend` al `ci.yml`.
- ~~**SPA:** crear `frontend-web/vercel.json`.~~ Hecho, con el rewrite a `index.html` y el proxy a `/api` (ver Rutas del frontend).
- **Límite de 4.5 MB por request de Vercel:** hoy los archivos pasan por el backend antes de ir a Cloudinary, y las canciones aceptan hasta 20 MB. Solución elegida: subida firmada directa a Cloudinary solo para canciones (firma en `GET /songs/upload-signature`, el front sube a Cloudinary y `POST /songs` recibe los `publicId` y los verifica con `cloudinary.api.resource`), y bajar el tope de las imágenes a 4 MB (hecho para registro, perfil, álbumes y playlists: `FileInterceptor` del backend y `maxSizeMB` de `InputImage`; la portada de las canciones se define con la subida directa).
- ~~**Rate limit en serverless.**~~ Limitación aceptada: el throttler guarda los contadores en memoria y cada instancia de Vercel tiene los suyos, así que con varias instancias el límite se reparte (con poco tráfico se reutiliza la misma instancia y funciona casi igual). Si hace falta un límite exacto: pasar el storage del throttler a Redis (Upstash) o usar las reglas de rate limit del firewall de Vercel.
- **Neon con pooler:** el backend en Vercel usa la URL `-pooler` (serverless abre muchas conexiones); el secreto `DATABASE_URL` del CD, que corre las migraciones, usa la directa.
- ~~**Mail:** sacar `tls: { rejectUnauthorized: false }` de `backend/src/config/mail.config.ts`.~~ Hecho: se verifica el certificado de Gmail.
- **Scripts de instalación de npm 11:** `npm install` avisa que no corre los scripts de `bcrypt`, `prisma` y `@prisma/engines` sin aprobarlos (`npm install-scripts approve`). Verificar que en una instalación limpia (CI y Vercel) `bcrypt` quede compilado.
- ~~**Cookies:** elegir entre proxy por rewrite y dominio propio.~~ Proxy por rewrite (ver Cookies entre front y back).
- ~~**`.gitignore`:** agregar `.vercel` al de la raíz.~~ Hecho.

## Estado actual

- **Backend:** módulos `auth`, `users` (perfil público, editar perfil, artistas favoritos, estadísticas del artista), `albumes`, `songs` (incluye canciones favoritas), `genres`, `playlists`, `search` y `contact`, con Prisma, Cloudinary, mails y rate limiting.
- **Frontend web:** landing (con formulario de contacto), login, registro, confirmación de cuenta, olvidé mi contraseña, cambiar clave y los paneles de USER y ARTIST (búsqueda, perfiles, playlists, álbumes, canciones, reproductor, artistas favoritos, canciones favoritas y estadísticas del artista).
- **Pendiente:**
  - ~~Estadísticas del artista (`Stats` era un stub).~~ Hecho. Falta evaluar la tabla `Play` para sumar reproducciones (ver Estadísticas del artista).
  - ~~Cambiar clave (ver Cambiar clave).~~ Hecho.
  - Frontend mobile (ver Reutilización en mobile). Antes, el backend tiene que aceptar el JWT también por `Authorization: Bearer`, porque hoy solo lo lee de la cookie.
  - Pendientes del deploy (ver Pendientes antes del deploy).
