import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    const data = error.response?.data?.message;
    const message = Array.isArray(data) ? data[0] : data;
    error.message = message ?? error.message;
    return Promise.reject(error);
  },
);

export default api;