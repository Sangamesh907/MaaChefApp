import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'http://3.110.207.229';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
});

// Attach token to all requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('chef_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ChefService = {
  login: async (phone_number) => {
    const res = await api.post('/chef/login', { phone_number });
    return res.data;
  },

  verifyOtp: async (phone_number, otp) => {
    const res = await api.post('/chef/verify-otp', { phone_number, otp });
    return res.data;
  },

  fetchProfile: async () => {
    const res = await api.get('/chef/profile');
    return res.data;
  },

  updateProfile: async (fields) => {
    try {
      let isMultipart = false;
      let dataToSend;

      // Use multipart/form-data if local image
      if (fields.profile_image?.startsWith('file://') || fields.profile_image?.startsWith('content://')) {
        isMultipart = true;
        dataToSend = new FormData();
        for (const key in fields) {
          if (key === 'profile_image') {
            dataToSend.append('profile_image', {
              uri: fields.profile_image,
              type: 'image/jpeg',
              name: 'profile.jpg',
            });
          } else if (key === 'food_styles') {
            dataToSend.append(key, JSON.stringify(fields[key]));
          } else {
            dataToSend.append(key, fields[key]);
          }
        }
      } else {
        // JSON payload
        dataToSend = { ...fields };
        if (fields.food_styles) dataToSend.food_styles = JSON.stringify(fields.food_styles);
        if (fields.profile_image?.startsWith('http')) delete dataToSend.profile_image;
      }

      const res = await api.post(
        '/chef/profile/update',
        dataToSend,
        isMultipart
          ? { headers: { 'Content-Type': 'multipart/form-data' } }
          : {}
      );

      return res.data;
    } catch (error) {
      console.error('Error in updateProfile:', error.response?.data || error.message);
      throw error;
    }
  },

  updateChefFoodStyle: async (food_styles) => {
    return await ChefService.updateProfile({ food_styles });
  },

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

  // ---------- Orders ----------
  getOrders: async (type) => {
    // type: "incoming" | "ongoing" | "completed" | "all"
    const endpoint = type === 'incoming' ? 'incoming'
                   : type === 'ongoing' ? 'ongoing'
                   : type === 'completed' ? 'completed'
                   : 'all';
    const res = await api.get(`/chef/orders/${endpoint}`);
    return res.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await api.put(`/orders/${orderId}/status`, { status });
    return res.data;
  },

  getOrderDetails: async (orderId) => {
    const res = await api.get(`/orders/chef/${orderId}`);
    return res.data;
  },

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

export { api };
export default ChefService;
