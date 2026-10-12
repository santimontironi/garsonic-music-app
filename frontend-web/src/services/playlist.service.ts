import api from "./api";
import type { PlaylistCredentials } from "../types/playlist.types";
import { playlistSchema } from "shared/schemas/playlist.schema";

export const getMyPlaylistsService = async () => {
    const res = await api.get('/playlists')
    return playlistSchema.array().parse(res.data)
}

export const createPlaylistService = async ({ data, image }: PlaylistCredentials) => {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('isPublic', String(data.isPublic))

    if (image) formData.append('image', image)

    const res = await api.post('/playlists', formData)
    return playlistSchema.parse(res.data)
}
