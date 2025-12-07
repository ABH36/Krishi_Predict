import axios from 'axios';

// Backend URL (Render Live)
const API_BASE_URL = import.meta.env.VITE_API_URL;  
// Example: https://krishi-predict.onrender.com/api/v1

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (Token bhejne ke liye)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kisan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor (Token expire)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('kisan_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
