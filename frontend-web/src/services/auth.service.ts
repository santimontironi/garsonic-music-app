import api from "./api";
import { userSchema, type LoginInput } from "../../../shared/schemas/auth.schema.js";

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