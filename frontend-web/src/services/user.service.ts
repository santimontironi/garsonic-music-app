import api from "./api";
import { userSchema } from "shared/schemas/auth.schema";
import { userProfileSchema } from "shared/schemas/user.schema";
import type { UpdateUserPayload } from "../types/user.types";

export const getUserByIdService = async (id: string) => {
    const res = await api.get(`/users/${id}`)
    return userProfileSchema.parse(res.data)
}

export const updateUserService = async ({ username, photo }: UpdateUserPayload) => {
    const formData = new FormData()

    if (username) formData.append('username', username)
    if (photo) formData.append('photo', photo) // mismo nombre que FileInterceptor('photo')

    const res = await api.patch('/users/me', formData)
    return userSchema.parse(res.data)
}
