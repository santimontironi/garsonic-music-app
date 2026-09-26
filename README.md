> 🚧 **Proyecto en desarrollo.**

# Garsonic

Plataforma web de música en la línea de Spotify. Cualquier persona puede crear una cuenta y usarla con uno de dos roles: **escuchar y organizar música** (usuario) o **publicar la suya** (artista).

## De qué trata

Garsonic conecta a quienes escuchan música con quienes la hacen, en una sola plataforma y con una sola forma de cuenta:

| Rol | Qué hace |
|---|---|
| **Usuario** | Escucha música, arma playlists (públicas o privadas), las ordena y marca canciones y artistas como favoritos. |
| **Artista** | Todo lo anterior, más un perfil público (nombre artístico, bio, foto) y la publicación de álbumes y canciones, con o sin álbum (singles). |

## Alcance

- **Cuentas:** registro e inicio de sesión con foto de perfil opcional, confirmación de la cuenta por mail y recuperación de contraseña.
- **Playlists:** crear, editar y borrar; visibilidad pública o privada; canciones con orden propio dentro de la playlist.
- **Favoritos:** canciones y artistas.
- **Catálogo de artistas:** perfil, álbumes y canciones. Un álbum agrupa canciones; una canción puede existir sin álbum.
- **Reproducción:** cada canción guarda su audio, duración y portada.

Un mismo modelo de cuenta cubre usuarios y artistas: no hay tablas separadas, el rol lo distingue. Una canción tiene un único artista (las colaboraciones quedan fuera del alcance actual).

## Plataformas

| Plataforma | Tecnología | Cuándo |
|---|---|---|
| **Web** | React + Vite | Es el frontend actual. |
| **Android / iOS** | React Native | Se empieza cuando el frontend web esté terminado. |

Las dos apps van a consumir la misma API del backend.

## Tecnologías

### Backend — `backend/`

| Tecnología | Uso |
|---|---|
| [NestJS 12](https://nestjs.com/) | Framework de la API (TypeScript, ESM) sobre Express |
| [Prisma 7](https://www.prisma.io/) + `@prisma/adapter-pg` | ORM, migraciones y cliente tipado |
| [PostgreSQL](https://www.postgresql.org/) | Base de datos |
| JWT en cookies | Autenticación |
| Nodemailer | Mails de confirmación de cuenta y reseteo de clave |
| [Vitest](https://vitest.dev/) + Supertest | Tests unitarios y e2e |
| oxlint + Prettier | Lint y formato |

### Frontend — `frontend-web/`

| Tecnología | Uso |
|---|---|
| [React 19](https://react.dev/) + TypeScript | Interfaz |
| [Vite 8](https://vite.dev/) | Servidor de desarrollo y build |
| [Tailwind CSS 4](https://tailwindcss.com/) | Estilos, mobile-first |
| React Router 7 | Navegación |
| Axios | Comunicación con la API |
| Bootstrap Icons | Iconografía |
| ESLint | Lint |

### Compartido — `shared/`

Paquete común entre front y back. Incluye [Zod](https://zod.dev/) para validaciones.

## Estructura del repo

```
garsonic/
├── backend/        API NestJS + Prisma
│   ├── prisma/     schema.prisma y migraciones
│   └── src/
├── frontend-web/   Web React + Vite + Tailwind
│   └── src/
│       ├── components/
│       └── pages/  Home, Login
└── shared/         Código compartido entre front y back
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
    Playlist ||--o{ SongPlaylist : "contiene"
    Song ||--o{ SongPlaylist : "está en"
    Song ||--o{ FavSong : "es favorita"

    User {
        int id PK
        string name
        string surname
        string username UK
        string email UK
        boolean emailVerified
        string password
        Role role "USER | ARTIST"
        string photo
        string bio
    }
    Album {
        int id PK
        string title
        string cover
    }
    Song {
        int id PK
        string title
        int durationSec
        string audioUrl
        string cover
    }
    Playlist {
        int id PK
        string name
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
- **Claves primarias compuestas** en `SongPlaylist`, `FavArtist` y `FavSong`, para evitar duplicados.
- **Borrado en cascada:** al borrar un `User` o una `Playlist` se borran sus dependencias (un artista borrado se lleva sus álbumes y canciones). Al borrar un `Album`, sus canciones quedan como singles (`albumId = null`).
- **Índices:** solo los implícitos de `@id` y `@unique`; si alguna consulta se vuelve lenta, se agregan con una migración.

## Autenticación y mails

- La sesión se maneja con un **JWT guardado en cookies**.
- **Nodemailer** envía los mails de:
  - **Confirmación de cuenta:** al confirmarla, `User.emailVerified` pasa de `false` a `true`.
  - **Reseteo de contraseña.**

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

- Node.js (LTS reciente) y npm
- PostgreSQL en ejecución

### Backend

```bash
cd backend
npm install
```

Crear `backend/.env` con la conexión a la base:

```env
DATABASE_URL="postgresql://usuario:clave@localhost:5432/garsonic"
```

Aplicar las migraciones, generar el cliente de Prisma y levantar la API (queda en `http://localhost:3000`, o en el `PORT` que se defina):

```bash
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

### Frontend

```bash
cd frontend-web
npm install
npm run dev
```

La web queda en `http://localhost:5173`.

### Scripts

| Carpeta | Comando | Qué hace |
|---|---|---|
| `backend` | `npm run start:dev` | API en modo watch |
| `backend` | `npm run build` / `npm run start:prod` | Compila y corre en producción |
| `backend` | `npm test` / `npm run test:e2e` / `npm run test:cov` | Tests unitarios, e2e y cobertura |
| `backend` | `npm run lint` / `npm run format` | oxlint y Prettier |
| `frontend-web` | `npm run dev` | Servidor de desarrollo |
| `frontend-web` | `npm run build` / `npm run preview` | Build de producción y vista previa |
| `frontend-web` | `npm run lint` | ESLint |

## Convenciones del código

Las reglas completas están en [`.claude/rules.md`](.claude/rules.md). Las principales:

- Código, archivos y carpetas en **inglés**; los textos de la interfaz en **español**.
- Sin código muerto: nada de funciones, imports, variables ni archivos sin usar.
- Componentes solo para secciones con mucho HTML o contenido reutilizable; lo que se usa una sola vez va inline.
- Las constantes compartidas y de peso van en `utils`; los textos, rutas y valores chicos van donde se usan.
- Iconos con Bootstrap Icons: `<i className="bi bi-play-fill"></i>`.

## Documentación interna

| Archivo | Contenido |
|---|---|
| [`.claude/context.md`](.claude/context.md) | Qué es Garsonic y qué se puede hacer |
| [`.claude/spec.md`](.claude/spec.md) | Spec técnica: estructura, modelo de datos, autenticación |
| [`.claude/rules.md`](.claude/rules.md) | Reglas de código y estilos |
