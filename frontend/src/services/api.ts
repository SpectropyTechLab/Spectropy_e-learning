// frontend/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://spectropy-e-learning-backend.onrender.com/api'
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