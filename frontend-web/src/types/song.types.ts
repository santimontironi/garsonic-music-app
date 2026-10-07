import type { CreateSongInput } from '../../../shared/schemas/song.schema.js'
import { songSchema } from '../../../shared/schemas/song.schema.js'
import { z } from 'zod'

export type Song = z.infer<typeof songSchema>

export type CreateSongCredentials = {
    data: CreateSongInput,
    audio: File,
    cover?: File | null
}