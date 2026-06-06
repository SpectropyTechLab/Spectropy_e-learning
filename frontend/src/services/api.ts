// frontend/src/services/api.ts
import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const normalizedBaseUrl = rawBaseUrl
  ? rawBaseUrl.replace(/\/+$/, '')
  : 'http://localhost:5000';

const api = axios.create({
  baseURL: `${normalizedBaseUrl}/api`,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
