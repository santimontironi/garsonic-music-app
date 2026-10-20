import { z } from 'zod';
import { userRefSchema } from './auth.schema.js';
import { songSchema } from './song.schema.js';

export const createPlaylistSchema = z.object({
    name: z.string().trim().min(1, 'El nombre es obligatorio').max(100, 'El nombre no puede superar los 100 caracteres'),
    isPublic: z.union([z.boolean(), z.stringbool()]),
})

export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>

export const updatePlaylistSchema = z.object({
    isPublic: z.boolean({ message: 'El estado es inválido' }),
})

export type UpdatePlaylistInput = z.infer<typeof updatePlaylistSchema>

export const playlistSchema = z.object({
    id: z.uuid(),
    ownerId: z.uuid(),
    name: z.string(),
    image: z.string().nullish(),
    isPublic: z.boolean(),
    createdAt: z.coerce.date(),
    _count: z.object({ songs: z.number().int() }).optional(),
})

export const myPlaylistSchema = playlistSchema.extend({
    songs: z.array(z.object({ songId: z.uuid() })),
})

export const playlistDetailSchema = playlistSchema.extend({
    owner: userRefSchema,
    songs: z.array(z.object({
        position: z.number().int(),
        addedAt: z.coerce.date(),
        song: songSchema.extend({
            artist: userRefSchema,
            album: z.object({ id: z.uuid(), title: z.string() }).nullish(),
        }),
    })),
})

export const addSongToPlaylistSchema = z.object({
    songId: z.uuid({ message: 'La canción es inválida' }),
})

export type AddSongToPlaylistInput = z.infer<typeof addSongToPlaylistSchema>
