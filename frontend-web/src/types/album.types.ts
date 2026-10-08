import type { CreateAlbumInput } from "shared/schemas/album.schema";
import { albumSchema } from "shared/schemas/album.schema";
import { z } from "zod";

export type CreateAlbumCredentials = {
    data: CreateAlbumInput,
    cover?: File | null
}

export type Album = z.infer<typeof albumSchema>