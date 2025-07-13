import axios from 'axios';
import { config } from './config';

// Log the API base URL for debugging
console.log('🔗 API Base URL:', config.API_BASE_URL);

// Create axios instance with base URL
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token and log requests
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to:`, config.baseURL + config.url);
    console.log('🔧 Request config:', {
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      params: config.params
    });
    
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { access_token } = JSON.parse(authData);
      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
        console.log('🔐 Added authorization header');
      }
    } else {
      console.log('⚠️ No auth token found');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors and log responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText,
      dataLength: Array.isArray(response.data) ? response.data.length : 'not array'
    });
    return response;
  },
  (error) => {
    console.error(`❌ Response error from ${error.config?.url}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code,
      config: {
        baseURL: error.config?.baseURL,
        url: error.config?.url,
        method: error.config?.method
      }
    });
    
    // Handle 401 errors
    if (error.response?.status === 401) {
      console.log('🔓 Unauthorized - redirecting to login');
      localStorage.removeItem('auth');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api; 