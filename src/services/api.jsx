import axios from 'axios';
import { Platform } from 'react-native';



const API_BASE_URL = __DEV__
  ? (Platform.OS === 'android'
      ? 'http://10.0.2.2:8000'
      : 'http://localhost:8000')
  : 'https://crested-semimystically-collen.ngrok-free.dev';


// Para Android emulador usa 10.0.2.2, para iOS emulador usa localhost
//const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
//const API_BASE_URL = Platform.OS === 'android' ? 'https://e35d25c3d09f.ngrok-free.app' : 'https://e35d25c3d09f.ngrok-free.app';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para logging
api.interceptors.request.use(
  (config) => {
    console.log('🔄 Making API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.log('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status);
    return response;
  },
  (error) => {
    console.log('❌ API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;