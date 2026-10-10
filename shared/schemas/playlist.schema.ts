import { z } from 'zod';

export const createPlaylistSchema = z.object({
    name: z.string().trim().min(1, 'El nombre es obligatorio').max(100, 'El nombre no puede superar los 100 caracteres'),
    isPublic: z.union([z.boolean(), z.stringbool()]).optional(),
})

export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>

export const playlistSchema = z.object({
    id: z.uuid(),
    ownerId: z.uuid(),
    name: z.string(),
    image: z.string().nullish(),
    isPublic: z.boolean(),
    createdAt: z.coerce.date(),
    _count: z.object({ songs: z.number().int() }).optional(),
})
