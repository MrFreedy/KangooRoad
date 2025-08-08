import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import API_BASE_URL from '../config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
    }
    return Promise.reject(err);
  }
);

const api = {
  get: async <T>(endpoint: string) => (await apiClient.get<T>(endpoint)).data,
  post: async <T>(endpoint: string, body?: any) => (await apiClient.post<T>(endpoint, body)).data,
  login: async (username: string, password: string) =>
    (await apiClient.post('/users/login', { username, password })).data,
  me: async () => (await apiClient.get('/users/me')).data,
};

export default api;