import type { CreateSongInput } from 'shared/schemas/song.schema'
import { songSchema } from 'shared/schemas/song.schema'
import { z } from 'zod'

export type Song = z.infer<typeof songSchema>

export type CreateSongCredentials = {
    data: CreateSongInput,
    audio: File,
    cover?: File | null
}