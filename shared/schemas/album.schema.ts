import { z } from 'zod';

export const createAlbumSchema = z.object({
    title: z.string().min(1, 'Titulo es requerido').max(100, 'El título no puede tener más de 100 caracteres'),
})

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>

export const albumSchema = z.object({
    id: z.uuid(),
    artistId: z.uuid(),
    title: z.string(),
    cover: z.string().nullish(),
    createdAt: z.coerce.date(),
    _count: z.object({ songs: z.number().int() }).optional(),
})
