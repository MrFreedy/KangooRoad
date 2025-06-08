import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

const baseUrl = '/api';

const api = {
  get: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axios.get(`${baseUrl}${endpoint}`, config);
    return response.data;
  },

  post: async <T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axios.post(`${baseUrl}${endpoint}`, data, config);
    return response.data;
  },

  put: async <T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axios.put(`${baseUrl}${endpoint}`, data, config);
    return response.data;
  },

  delete: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axios.delete(`${baseUrl}${endpoint}`, config);
    return response.data;
  },

  login: async (email: string, password: string): Promise<any> => {
    return api.post<any>('/users/login', { email, password });
  }
};

export default api;
