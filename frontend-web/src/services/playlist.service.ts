import api from "./api";
import type { PlaylistCredentials } from "../types/playlist.types";
import { myPlaylistSchema, playlistDetailSchema, playlistSchema, type AddSongToPlaylistInput, type UpdatePlaylistInput } from "shared/schemas/playlist.schema";

export const getMyPlaylistsService = async () => {
    const res = await api.get('/playlists')
    return myPlaylistSchema.array().parse(res.data)
}

export const createPlaylistService = async ({ data, image }: PlaylistCredentials) => {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('isPublic', String(data.isPublic))

    if (image) formData.append('image', image)

    const res = await api.post('/playlists', formData)
    return playlistSchema.parse(res.data)
}

export const getPlaylistByIdService = async (id: string) => {
    const res = await api.get(`/playlists/${id}`)
    return playlistDetailSchema.parse(res.data)
}

export const addSongToPlaylistService = async (playlistId: string, data: AddSongToPlaylistInput) => {
    await api.post(`/playlists/${playlistId}/songs`, data)
}

export const updatePlaylistService = async (playlistId: string, data: UpdatePlaylistInput) => {
    await api.patch(`/playlists/${playlistId}`, data)
}

export const deletePlaylistService = async (playlistId: string) => {
    await api.delete(`/playlists/${playlistId}`)
}

export const removeSongFromPlaylistService = async (playlistId: string, songId: string) => {
    await api.delete(`/playlists/${playlistId}/songs/${songId}`)
}
