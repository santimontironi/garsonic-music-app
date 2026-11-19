import { z } from "zod";
import api from "./api";
import { favSongSchema, songSchema, uploadSignatureSchema } from "shared/schemas/song.schema";
import type { CreateSongCredentials } from "../types/song.types";
import type { UpdateSongAlbumInput, UploadSignature } from "shared/schemas/song.schema";

export const getMySongsService = async () => {
    const res = await api.get('/songs/me')
    return songSchema.array().parse(res.data)
}

// Sube directo a Cloudinary (sin pasar por el backend, que en Vercel corta los requests de más de 4.5 MB) y devuelve el public_id
const uploadToCloudinary = async (file: File, resourceType: 'video' | 'image', { cloudName, apiKey, timestamp }: UploadSignature, { folder, signature }: UploadSignature['audio']) => {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('api_key', apiKey)
    formData.append('timestamp', String(timestamp))
    formData.append('folder', folder)
    formData.append('signature', signature)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, { method: 'POST', body: formData })
    if (!res.ok) throw new Error('No se pudo subir el archivo, probá de nuevo')

    return z.object({ public_id: z.string() }).parse(await res.json()).public_id
}

export const createSongService = async ({ data, audio, cover }: CreateSongCredentials) => {
    const signatureRes = await api.get('/songs/upload-signature')
    const uploadSignature = uploadSignatureSchema.parse(signatureRes.data)

    // Cloudinary guarda los audios como 'video'
    const [audioPublicId, coverPublicId] = await Promise.all([
        uploadToCloudinary(audio, 'video', uploadSignature, uploadSignature.audio),
        cover ? uploadToCloudinary(cover, 'image', uploadSignature, uploadSignature.cover) : undefined
    ])

    const res = await api.post('/songs', { ...data, audioPublicId, coverPublicId })
    return songSchema.parse(res.data)
}

export const updateSongAlbumService = async (songId: string, { albumId }: UpdateSongAlbumInput) => {
    const res = await api.patch(`/songs/${songId}/album`, { albumId })
    return songSchema.parse(res.data)
}

export const deleteSongService = async (songId: string) => {
    await api.delete(`/songs/${songId}`)
}

export const getFavSongsService = async () => {
    const res = await api.get('/songs/fav')
    return favSongSchema.array().parse(res.data)
}

export const toggleFavSongService = async (songId: string) => {
    await api.post(`/songs/${songId}/fav`)
}
