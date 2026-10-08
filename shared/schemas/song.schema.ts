import { z } from "zod";
import { albumSchema } from "./album.schema.js";
import { userSchema } from "./auth.schema.js";

export const createSongSchema = z.object({
    title: z.string().trim().min(1, { message: 'El título es obligatorio' }).max(100, { message: 'El título no puede superar los 100 caracteres' }),
    albumId: z.uuid({ message: 'El álbum es inválido' }).optional(),
})

const songBaseSchema = createSongSchema.extend({
    id: z.uuid(),
    artistId: z.uuid(),
    albumId: z.uuid().nullish(),
    durationSec: z.number().int(),
    audioUrl: z.string(),
    cover: z.string().nullish(),
    createdAt: z.coerce.date(),
})

export const songSchema = songBaseSchema.extend({
    album: albumSchema.nullish()
})

export const albumWithSongsSchema = albumSchema.extend({
    songs: z.array(songBaseSchema),
    artist: userSchema.omit({ email: true })
})

export type CreateSongInput = z.infer<typeof createSongSchema>

export const updateSongAlbumSchema = z.object({
    albumId: z.uuid({ message: 'El álbum es inválido' }).nullable(),
})

export type UpdateSongAlbumInput = z.infer<typeof updateSongAlbumSchema>
