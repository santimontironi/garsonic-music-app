import api from "./api";
import { songSchema } from "shared/schemas/song.schema";
import type { CreateSongCredentials } from "../types/song.types";
import type { UpdateSongAlbumInput } from "shared/schemas/song.schema";

export const getMySongsService = async () => {
    const res = await api.get('/songs/me')
    return songSchema.array().parse(res.data)
}

export const createSongService = async ({ data, audio, cover }: CreateSongCredentials) => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('audio', audio)

    if (data.albumId) formData.append('albumId', data.albumId)
    if (cover) formData.append('cover', cover)

    const res = await api.post('/songs', formData)
    return songSchema.parse(res.data)
}

export const updateSongAlbumService = async (songId: string, { albumId }: UpdateSongAlbumInput) => {
    const res = await api.patch(`/songs/${songId}/album`, { albumId })
    return songSchema.parse(res.data)
}
