import { z } from "zod";
import { albumSchema } from "./album.schema.js";
import { userRefSchema, userSchema } from "./auth.schema.js";
import { genreSchema } from "./genre.schema.js";

export const createSongSchema = z.object({
    title: z.string().trim().min(1, { message: 'El título es obligatorio' }).max(100, { message: 'El título no puede superar los 100 caracteres' }),
    albumId: z.uuid({ message: 'El álbum es inválido' }).optional(),
    genreId: z.uuid({ message: 'Elegí un género' }),
})

// body de POST /songs: el front ya subió los archivos a Cloudinary y manda sus publicId
export const createSongBodySchema = createSongSchema.extend({
    audioPublicId: z.string().startsWith('songs/audio/', { message: 'El audio es inválido' }),
    coverPublicId: z.string().startsWith('songs/covers/', { message: 'La portada es inválida' }).optional(),
})

// lo que devuelve GET /songs/upload-signature: una firma por carpeta para subir directo a Cloudinary
const signedUploadSchema = z.object({
    folder: z.string(),
    signature: z.string(),
})

export const uploadSignatureSchema = z.object({
    cloudName: z.string(),
    apiKey: z.string(),
    timestamp: z.number(),
    audio: signedUploadSchema,
    cover: signedUploadSchema,
})

const songBaseSchema = createSongSchema.extend({
    id: z.uuid(),
    artistId: z.uuid(),
    albumId: z.uuid().nullish(),
    durationSec: z.number().int(),
    audioUrl: z.string(),
    cover: z.string().nullish(),
    createdAt: z.coerce.date(),
    genre: genreSchema,
})

export const songSchema = songBaseSchema.extend({
    album: albumSchema.nullish()
})

// el álbum trae su portada para usarla cuando la canción no tiene una propia
export const favSongSchema = songBaseSchema.extend({
    artist: userRefSchema,
    album: albumSchema.pick({ id: true, title: true, cover: true }).nullish(),
})

export const albumWithSongsSchema = albumSchema.extend({
    songs: z.array(songBaseSchema),
    artist: userSchema.omit({ email: true })
})

export type CreateSongInput = z.infer<typeof createSongSchema>
export type CreateSongBody = z.infer<typeof createSongBodySchema>
export type UploadSignature = z.infer<typeof uploadSignatureSchema>

export const updateSongAlbumSchema = z.object({
    albumId: z.uuid({ message: 'El álbum es inválido' }).nullable(),
})

export type UpdateSongAlbumInput = z.infer<typeof updateSongAlbumSchema>
