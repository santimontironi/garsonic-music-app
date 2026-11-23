import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

export const TOKEN_KEY = 'auth_token';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
});

// en React Native no hay cookies confiables: el JWT viaja en el header
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string | string[] }>) => {
    // 401 con token enviado = el guard lo rechazó (vencido o inválido): se cierra la sesión.
    // Sin token, el 401 es del login (credenciales inválidas) y lo maneja el formulario.
    if (error.response?.status === 401 && error.config?.headers.Authorization) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      router.replace('/');
    }

    const data = error.response?.data?.message;
    const message = Array.isArray(data) ? data[0] : data;
    error.message = message ?? error.message;
    return Promise.reject(error);
  },
);

export default api;
