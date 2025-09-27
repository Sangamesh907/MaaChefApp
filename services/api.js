// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep base URL in one place
export const BASE_URL = 'http://3.110.207.229';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
});

// Auto-attach token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('chef_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ==================== CHEF SERVICE ====================
const ChefService = {
  // Auth
  login: async (phone_number) => {
    const res = await api.post('/chef/login', { phone_number });
    return res.data;
  },
  verifyOtp: async (phone_number, otp) => {
    const res = await api.post('/chef/verify-otp', { phone_number, otp });
    return res.data;
  },

  // Profile
  fetchProfile: async () => {
    const res = await api.get('/chef/profile');
    return res.data;
  },
  updateProfile: async (formData) => {
    const res = await api.post('/chef/profile/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  updateChefFoodStyle: async (food_styles) => {
    const res = await api.post('/chef/profile/update', { food_styles });
    return res.data;
  },

  // Menu Items
  addMenuItem: async (formData) => {
    const res = await api.post('/chef/item/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    return res.data;
  },
  updateMenuItem: async (itemId, formData) => {
    const res = await api.post(`/chef/item/update/${itemId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    return res.data;
  },

  // Orders
  getOrders: async (status) => {
    const res = await api.get(`/chef/orders?status=${status}`);
    return res.data;
  },
  updateOrderStatus: async (orderId, status) => {
    const res = await api.put(`/chef/orders/${orderId}`, { status });
    return res.data;
  },
  getOrderDetails: async (orderId) => {
    const res = await api.get(`/chef/orders/${orderId}`);
    return res.data;
  },

  // Location
  updateLocation: async (latitude, longitude) => {
    const res = await api.post('/cheflocation/update', {
      latitude: String(latitude),
      longitude: String(longitude),
    });
    return res.data;
  },
  getAddressFromCoords: async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const res = await axios.get(url, { timeout: 10000 });
    return res.data?.display_name || 'Address not found';
  },
};

// ✅ Export
export { api };
export default ChefService;
