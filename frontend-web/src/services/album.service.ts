import api from "./api";
import { albumSchema } from "shared/schemas/album.schema";
import { albumWithSongsSchema } from "shared/schemas/song.schema";
import type { CreateAlbumCredentials } from "../types/album.types";

export const getMyAlbumsService = async () => {
    const res = await api.get('/albumes/me')
    return albumSchema.array().parse(res.data)
}

export const createAlbumService = async ({ data, cover }: CreateAlbumCredentials) => {
    const formData = new FormData()

    formData.append('title', data.title)

    if (cover) formData.append('cover', cover)

    const res = await api.post('/albumes', formData)
    return albumSchema.parse(res.data)
}

export const getAlbumByIdService = async (id: string) => {
    const res = await api.get(`/albumes/${id}`)
    return albumWithSongsSchema.parse(res.data)
}
