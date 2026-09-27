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
| `User` | Cuenta de usuarios y artistas: `name`, `surname`, `username` (único), `email` (único), `emailVerified` (arranca en `false`), `password`, `role` (`USER` / `ARTIST`), `photo`, `bio` (opcional, pensada para artistas). |
| `Album` | Pertenece a un artista (`artistId` → `User`) y agrupa canciones. |
| `Song` | Pertenece a un artista (`artistId` → `User`) y, opcionalmente, a un álbum. |
| `Playlist` | Pertenece a un usuario (`ownerId`). Puede ser pública o privada. |
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

## Autenticación y mails

- **Autenticación:** JWT guardado en cookies.
- **Envío de mails:** Nodemailer, para dos casos:
  - Confirmar la cuenta del usuario: al confirmarla, `User.emailVerified` pasa a `true`.
  - Resetear la clave.

## Rate limiting

Todos los endpoints tienen rate limit.

- Endpoints de auth (login, register, cambiar clave): **5 requests por minuto**.
- Resto de los endpoints: **70 requests por minuto**.

## Estado actual

- Backend: NestJS recién inicializado (solo `main.ts` y `app.module.ts`). Prisma todavía no está instalado, y falta el `prisma.config.ts` con la URL de la base.
- Frontend: Vite + React inicializado, sin pantallas todavía.
