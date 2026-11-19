> 🌐 **Web en producción:** [garsonic-frontend.vercel.app](https://garsonic-frontend.vercel.app) · 📱 La app mobile está en desarrollo.

# Garsonic

Plataforma web de música en la línea de Spotify. Cualquier persona puede crear una cuenta y usarla con uno de dos roles: **escuchar y organizar música** (usuario) o **publicar la suya** (artista).

## De qué trata

Garsonic conecta a quienes escuchan música con quienes la hacen, en una sola plataforma y con una sola forma de cuenta:

| Rol | Qué hace |
|---|---|
| **Usuario** | Escucha música, arma playlists (públicas o privadas), las ordena y marca canciones y artistas como favoritos. |
| **Artista** | Todo lo anterior, más un perfil público (nombre artístico, bio, foto), la publicación de álbumes y canciones, con o sin álbum (singles), y estadísticas de su música. |

## Alcance

- **Cuentas:** registro con foto de perfil opcional, confirmación por mail, inicio de sesión, recuperación y cambio de contraseña, y edición del perfil.
- **Perfiles públicos:** cada usuario y artista tiene un perfil que pueden ver los demás.
- **Búsqueda:** canciones, álbumes, artistas y playlists.
- **Playlists:** crear, editar y borrar; visibilidad pública o privada; canciones con orden propio dentro de la playlist.
- **Favoritos:** canciones y artistas.
- **Catálogo de artistas:** perfil, álbumes y canciones. Un álbum agrupa canciones; una canción puede existir sin álbum y siempre tiene un género.
- **Estadísticas del artista:** seguidores, álbumes y, por canción, cuántas veces se marcó como favorita o se agregó a playlists.
- **Reproducción:** reproductor integrado; cada canción guarda su audio, duración y portada.
- **Contacto:** formulario en la landing que llega por mail.

Un mismo modelo de cuenta cubre usuarios y artistas: no hay tablas separadas, el rol lo distingue. Una canción tiene un único artista (las colaboraciones quedan fuera del alcance actual).

## Plataformas

| Plataforma | Tecnología | Estado |
|---|---|---|
| **Web** | React + Vite | En producción en [garsonic-frontend.vercel.app](https://garsonic-frontend.vercel.app). |
| **Android / iOS** | React Native | En desarrollo. |

Las dos apps consumen la misma API del backend.

## Tecnologías

### Backend: `backend/`

| Tecnología | Uso |
|---|---|
| [NestJS 12](https://nestjs.com/) | Framework de la API (TypeScript, ESM) sobre Express |
| [Prisma 7](https://www.prisma.io/) + `@prisma/adapter-pg` | ORM, migraciones y cliente tipado |
| [PostgreSQL](https://www.postgresql.org/) | Base de datos ([Neon](https://neon.tech/) en producción) |
| JWT en cookies + bcrypt | Autenticación y hash de contraseñas |
| [Cloudinary](https://cloudinary.com/) | Almacenamiento de imágenes y audio |
| Nodemailer | Mails de confirmación de cuenta, reseteo de clave y contacto |
| Guard propio de rate limiting | Límite de requests por IP y ruta |
| [Vitest](https://vitest.dev/) + Supertest | Configurados para tests unitarios y e2e (todavía sin tests escritos) |
| oxlint + Prettier | Lint y formato |

### Frontend: `frontend-web/`

| Tecnología | Uso |
|---|---|
| [React 19](https://react.dev/) + TypeScript | Interfaz |
| [Vite 8](https://vite.dev/) | Servidor de desarrollo y build |
| [Tailwind CSS 4](https://tailwindcss.com/) | Estilos, mobile-first |
| React Router 7 | Navegación |
| [TanStack Query](https://tanstack.com/query) + Axios | Pedidos a la API y caché |
| React Hook Form + Zod | Formularios y validación |
| Framer Motion | Animaciones |
| Bootstrap Icons | Iconografía |
| ESLint | Lint |

### Compartido: `shared/`

Schemas de [Zod](https://zod.dev/) que usan el front y el back, así las validaciones son las mismas de los dos lados. Se compila a `shared/dist` y los dos proyectos lo consumen como `"shared": "file:../shared"`.

### Infraestructura

| Tecnología | Uso |
|---|---|
| [Vercel](https://vercel.com/) | Hosting del front y del back (dos proyectos) |
| [Neon](https://neon.tech/) | PostgreSQL en producción |
| GitHub Actions | CI (lint y typecheck) y CD (migraciones y deploy) |
| Husky | Hooks de git |

## Estructura del repo

Monorepo con npm workspaces (`shared`, `backend`, `frontend-web`):

```
garsonic/
├── .github/workflows/  ci.yml y cd.yml
├── backend/            API NestJS + Prisma
│   ├── prisma/         schema.prisma y migraciones
│   └── src/            un módulo por recurso: auth, users, albumes, songs,
│                       genres, playlists, search, contact
├── frontend-web/       Web React + Vite + Tailwind
│   ├── vercel.json     rewrites del SPA y proxy /api al backend
│   └── src/
│       ├── components/
│       ├── pages/      Home, Login, Register, ConfirmAccount,
│       │               ResetPassword, UserPanel, ArtistPanel
│       ├── hooks/, services/, context/, types/, utils/
└── shared/             Schemas de Zod compartidos
```

## Modelo de datos

El schema completo está en [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma).

```mermaid
erDiagram
    User ||--o{ Album : "publica (artista)"
    User ||--o{ Song : "publica (artista)"
    User ||--o{ Playlist : "crea"
    User ||--o{ FavSong : "marca"
    User ||--o{ FavArtist : "sigue / es seguido"
    Album |o--o{ Song : "agrupa"
    Genre ||--o{ Song : "clasifica"
    Playlist ||--o{ SongPlaylist : "contiene"
    Song ||--o{ SongPlaylist : "está en"
    Song ||--o{ FavSong : "es favorita"

    User {
        uuid id PK
        string name
        string surname
        string username UK
        string email UK
        boolean emailVerified
        string password
        Role role "USER | ARTIST"
        string photo
        string photoPublicId
        string bio
    }
    Album {
        uuid id PK
        string title
        string cover
        string coverPublicId
    }
    Song {
        uuid id PK
        string title
        int durationSec
        string audioUrl
        string audioPublicId
        string cover
        string coverPublicId
    }
    Genre {
        uuid id PK
        GenreName name UK
    }
    Playlist {
        uuid id PK
        string name
        string image
        string imagePublicId
        boolean isPublic
    }
    SongPlaylist {
        int position
        datetime addedAt
    }
    FavSong {
        datetime createdAt
    }
    FavArtist {
        datetime createdAt
    }
```

Decisiones de diseño:

- **Una sola tabla `User`** para usuarios y artistas, distinguidos por `role`. `username` es el nombre de usuario para los usuarios y el nombre artístico para los artistas.
- **La validación de rol artista va en el service:** la base no garantiza que `Song.artistId`, `Album.artistId` y `FavArtist.artistId` apunten a un `User` con `role = ARTIST`.
- **Géneros fijos:** `Genre.name` es un enum (`GenreName`), así no hay géneros duplicados ni mal escritos. Las filas se cargan una vez con SQL (ver Puesta en marcha) y un género con canciones no se puede borrar (`onDelete: Restrict`).
- **Claves primarias compuestas** en `SongPlaylist`, `FavArtist` y `FavSong`, para evitar duplicados.
- **Borrado en cascada:** al borrar un `User` o una `Playlist` se borran sus dependencias (un artista borrado se lleva sus álbumes y canciones). Al borrar un `Album`, sus canciones quedan como singles (`albumId = null`).
- **Índices:** solo los implícitos de `@id` y `@unique`; si alguna consulta se vuelve lenta, se agregan con una migración.
- **Campos `*PublicId`:** guardan el `public_id` de Cloudinary junto a la URL, porque para borrar el archivo de Cloudinary hace falta el `public_id`, no la URL.
- **IDs como UUID:** todos los `id` (y las FK) son `uuid`, no autoincrement, para no exponer IDs secuenciales/adivinables en la API.

## Autenticación y seguridad

- La sesión se maneja con un **JWT guardado en una cookie** `httpOnly` con `sameSite: 'lax'`.
- Los mails de **confirmación de cuenta** y **reseteo de contraseña** llevan su propio JWT, firmado con un secreto distinto al de la sesión (`JWT_CONFIRM_SECRET` y `JWT_FORGOT_SECRET`). Al confirmar la cuenta, `User.emailVerified` pasa a `true`.
- **Rate limiting:** 70 requests por minuto por IP y ruta, y 5 por minuto en las rutas de auth y en el formulario de contacto. Los contadores viven en memoria de cada instancia.
- **Mismo origen en producción:** el front reescribe `/api/*` al backend (`frontend-web/vercel.json`), así la cookie es propia del sitio. CORS (con origen `FRONTEND_URL`) solo se usa en desarrollo, donde el front y el back corren en puertos distintos.

## Diseño de la interfaz

Estética **brutalista**: bordes negros, sombras duras sin difuminar, colores planos y saturados y tipografía [Krona One](https://fonts.google.com/specimen/Krona+One).

| Token | Valor | Uso |
|---|---|---|
| `background` | `#FFCB7F` | Fondo general |
| `button` | `#FFFEFD` | Botones |
| `green` | `#BAFCA2` | Acento |
| `coral` | `#FC7B5E` | Acento |
| `shadow-hard` / `shadow-hard-lg` | `4px 4px 0 #000` / `8px 8px 0 #000` | Sombras duras |

Los tokens viven en [`frontend-web/src/index.css`](frontend-web/src/index.css). Los estilos son **mobile-first** y usan solo los breakpoints base (mobile), `md:`, `xl:` y `2xl:`.

## Puesta en marcha

### Requisitos

- Node.js 22 y npm 11
- PostgreSQL en ejecución
- Una cuenta de [Cloudinary](https://cloudinary.com/) y una cuenta de Gmail con contraseña de aplicación

### Instalación

Desde la raíz del repo (instala los tres workspaces):

```bash
npm install
```

### Backend

Crear `backend/.env`:

```env
DATABASE_URL="postgresql://usuario:clave@localhost:5432/garsonic"

CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

EMAIL_USER="tu-email@gmail.com"
EMAIL_PASS="tu-contraseña-de-aplicación"

JWT_SECRET="un-secreto-largo-y-random"
JWT_CONFIRM_SECRET="otro-secreto-distinto"
JWT_FORGOT_SECRET="otro-secreto-distinto"

FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
PORT=3000
```

Aplicar las migraciones y generar el cliente de Prisma:

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

Cargar los géneros (se puede correr más de una vez sin duplicar):

```sql
INSERT INTO "Genre" (id, name)
SELECT gen_random_uuid(), unnest(enum_range(NULL::"GenreName"))
ON CONFLICT (name) DO NOTHING;
```

Levantar la API (compila `shared` antes de arrancar). Queda en `http://localhost:3000/api`:

```bash
npm run start:dev
```

### Frontend

Crear `frontend-web/.env`:

```env
VITE_BACKEND_URL="http://localhost:3000/api"
```

```bash
cd frontend-web
npm run dev
```

La web queda en `http://localhost:5173`.

### Scripts

Se corren desde cada carpeta, o desde la raíz con `-w` (por ejemplo `npm run lint -w backend`).

| Carpeta | Comando | Qué hace |
|---|---|---|
| `backend` | `npm run start:dev` | API en modo watch |
| `backend` | `npm run build` / `npm run start:prod` | Compila (con `shared` y Prisma) y corre en producción |
| `backend` | `npm test` / `npm run test:e2e` / `npm run test:cov` | Tests unitarios, e2e y cobertura |
| `backend` | `npm run lint` / `npm run typecheck` / `npm run format` | oxlint, TypeScript y Prettier |
| `frontend-web` | `npm run dev` | Servidor de desarrollo |
| `frontend-web` | `npm run build` / `npm run preview` | Build de producción y vista previa |
| `frontend-web` | `npm run lint` / `npm run typecheck` | ESLint y TypeScript |

## CI/CD

| Workflow | Cuándo corre | Qué hace |
|---|---|---|
| [`ci.yml`](.github/workflows/ci.yml) | Push a `develop` y PR a `master` | Lint y typecheck del back y del front |
| [`cd.yml`](.github/workflows/cd.yml) | Push a `master` | Corre el CI, aplica las migraciones en Neon y deploya en Vercel: primero el back y después el front |

- **Flujo de ramas:** se trabaja en `develop` y se mergea a `master` por PR. `master` tiene branch protection: el CI tiene que pasar y no se puede pushear directo.
- **Deploy con la CLI de Vercel:** los proyectos no están conectados al repo. El CD hace `vercel pull`, `vercel build` y `vercel deploy --prebuilt`, así el build corre en GitHub Actions sobre el mismo commit que pasó el CI.
- **Orden:** si fallan los checks o la migración, no se deploya nada. El front espera al back, así un front nuevo nunca le pega a un back viejo.

## Documentación interna

| Archivo | Contenido |
|---|---|
| [`.claude/context.md`](.claude/context.md) | Qué es Garsonic y qué se puede hacer |
| [`.claude/spec.md`](.claude/spec.md) | Spec técnica: estructura, modelo de datos, autenticación, deploy |
| [`.claude/rules.md`](.claude/rules.md) | Reglas de código y estilos |
