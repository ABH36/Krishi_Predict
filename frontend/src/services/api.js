import axios from 'axios';

// Backend URL (Localhost for now)
const API_BASE_URL = 'https://krishi-predict-exlq.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Har request ke saath Token bhejne ke liye (Security)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kisan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Agar token expire ho jaye to logout kar do
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token Invalid/Expired
      localStorage.removeItem('kisan_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;