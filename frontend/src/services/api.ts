// frontend/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://your-production-api.com/api'  // ← Replace with real prod URL later
    : '/api'  // ← Uses Vite proxy in development
});

export default api;