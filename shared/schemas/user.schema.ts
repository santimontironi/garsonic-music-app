import { z } from 'zod';
import { albumSchema } from './album.schema.js';
import { registerSchema, userSchema } from './auth.schema.js';
import { playlistSchema } from './playlist.schema.js';
import { songSchema } from './song.schema.js';

export const userProfileSchema = userSchema.omit({ email: true }).extend({
    albums: z.array(albumSchema),
    songs: z.array(songSchema),
    playlists: z.array(playlistSchema),
})

// la foto llega como archivo aparte (multipart): acá solo los campos de texto
export const updateUserSchema = registerSchema.pick({ username: true }).partial()

export type UpdateUserInput = z.infer<typeof updateUserSchema>
