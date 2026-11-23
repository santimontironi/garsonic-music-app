import * as SecureStore from "expo-secure-store";
import api, { TOKEN_KEY } from "./api";
import { mobileLoginResponseSchema, userSchema, type ChangePasswordInput, type ForgotPasswordInput, type LoginInput, type ResetPasswordInput } from "shared/schemas/auth.schema";
import type { RegisterPayload } from "../types/auth.types";

export const loginService = async (body: LoginInput) => {
    const res = await api.post('/auth/mobile/login', body);
    const { user, token } = mobileLoginResponseSchema.parse(res.data);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    return user;
}

export const meService = async () => {
    const res = await api.get('/auth/me');
    return userSchema.parse(res.data);
}

// sin cookie que borrar en el back: cerrar sesión es olvidar el token
export const logoutService = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
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
    // RN acepta { uri, name, type } en el FormData; el tipo de TS solo conoce Blob
    if (photo) formData.append('photo', photo as unknown as Blob) // mismo nombre que FileInterceptor('photo')

    await api.post('/auth/register', formData)
}

export const confirmAccountService = async (token: string) => {
    await api.post(`/auth/confirm/${token}`)
}

export const forgotPasswordService = async (body: ForgotPasswordInput) => {
    const res = await api.post<{ message: string }>('/auth/forgot-password', body)
    return res.data.message
}

export const resetPasswordService = async ({ token, password }: ResetPasswordInput & { token: string }) => {
    await api.post(`/auth/forgot-password/${token}`, { password })
}

export const changePasswordService = async (body: ChangePasswordInput) => {
    const res = await api.patch<{ message: string }>('/auth/password', body)
    return res.data.message
}
