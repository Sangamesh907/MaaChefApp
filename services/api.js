// services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://3.110.207.229/api', // centralized
  timeout: 10000,
});

// Auto-attach token
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('chef_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
