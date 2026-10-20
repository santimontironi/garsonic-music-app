import { z } from 'zod';
import { albumSchema } from './album.schema.js';
import { userRefSchema, userSummarySchema } from './auth.schema.js';
import { playlistSchema } from './playlist.schema.js';
import { songSchema } from './song.schema.js';

export const searchQuerySchema = z.object({
    q: z.string().trim().min(1, 'Escribí algo para buscar').max(50, 'La búsqueda no puede superar los 50 caracteres'),
})

export type SearchQueryInput = z.infer<typeof searchQuerySchema>

export const searchResultSchema = z.object({
    artists: z.array(userSummarySchema),
    users: z.array(userSummarySchema),
    songs: z.array(songSchema.extend({ artist: userRefSchema })),
    albums: z.array(albumSchema.extend({ artist: userRefSchema })),
    playlists: z.array(playlistSchema.extend({ owner: userRefSchema })),
})
