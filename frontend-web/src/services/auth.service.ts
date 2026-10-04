import api from "./api";
import { userSchema, type LoginInput } from "../../../shared/schemas/auth.schema.js";
import type { RegisterPayload } from "../types/auth.types";

export const loginService = async (body: LoginInput) => {
    const res = await api.post('/auth/login', body);
    return userSchema.parse(res.data);
}

export const meService = async () => {
    const res = await api.get('/auth/me');
    return userSchema.parse(res.data);
}

export const logoutService = async () => {
    await api.post('/auth/logout');
}

export const confirmService = async (token: string) => {
    await api.get(`/auth/confirm/${token}`);
}

export const registerService = async ({ data, photo }: RegisterPayload) => {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('surname', data.surname)
    formData.append('username', data.username)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('role', data.role)

    if (data.bio) formData.append('bio', data.bio)
    if (photo) formData.append('photo', photo) // mismo nombre que FileInterceptor('photo')

    await api.post('/auth/register', formData) // axios arma el multipart solo al recibir un FormData
}

export const confirmAccountService = async (token: string) => {
    await api.post(`/auth/confirm/${token}`)
}
