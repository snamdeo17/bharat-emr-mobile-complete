import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL - Update this with your deployed backend URL
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8080/api' // Android emulator
  : 'https://api.bharatemr.com/api'; // Production

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('jwtToken');
      await AsyncStorage.removeItem('userType');
      await AsyncStorage.removeItem('userId');
      // Redirect to login
    }
    return Promise.reject(error);
  },
);

export default api;
export {API_BASE_URL};
