import axios from 'axios';
import { config } from './config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { access_token } = JSON.parse(authData);
      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only log important errors
    if (error.response?.status !== 422) {
      console.error(`API Error (${error.response?.status}):`, {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message
      });
    }
    
    // Handle 401 errors
    if (error.response?.status === 401) {
      localStorage.removeItem('auth');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api; 