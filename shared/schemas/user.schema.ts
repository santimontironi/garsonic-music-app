import { z } from 'zod';
import { albumSchema } from './album.schema.js';
import { registerSchema, userSchema } from './auth.schema.js';
import { playlistSchema } from './playlist.schema.js';
import { songSchema } from './song.schema.js';

export const userProfileSchema = userSchema.omit({ email: true }).extend({
    albums: z.array(albumSchema),
    songs: z.array(songSchema),
    playlists: z.array(playlistSchema),
    isFav: z.boolean(),
})

export const artistStatsSchema = z.object({
    fans: z.number().int(),
    songs: z.number().int(),
    albums: z.number().int(),
    singles: z.number().int(),
    minutes: z.number().int(),
    // solo las guardadas en favoritos o playlists, de más a menos guardadas
    songStats: z.array(z.object({
        id: z.uuid(),
        title: z.string(),
        cover: z.string().nullish(),
        favs: z.number().int(),
        playlists: z.number().int(),
    })),
})

// la foto llega como archivo aparte (multipart): acá solo los campos de texto
export const updateUserSchema = registerSchema.pick({ username: true }).partial()

export type ArtistStats = z.infer<typeof artistStatsSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
