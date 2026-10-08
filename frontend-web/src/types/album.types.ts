import type { CreateAlbumInput } from "shared/schemas/album.schema";
import { albumSchema } from "shared/schemas/album.schema";
import { albumWithSongsSchema } from "shared/schemas/song.schema";
import { z } from "zod";

export type CreateAlbumCredentials = {
    data: CreateAlbumInput,
    cover?: File | null
}

export type Album = z.infer<typeof albumSchema>
export type AlbumWithSongs = z.infer<typeof albumWithSongsSchema>
