import axios from 'axios';

export const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_ROOT,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobzing_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const unwrap = (response) => response?.data?.data ?? response?.data ?? response;

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  return error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || error?.message || fallback;
};

export default api;
