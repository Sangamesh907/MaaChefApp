import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'http://3.110.207.229';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000, // 30 seconds timeout
});

// Attach token automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('chef_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ChefService = {
  // ---------- Authentication ----------
  login: async (phone_number) => {
    const res = await api.post('/chef/login', { phone_number });
    return res.data;
  },

  fetchProfile: async () => {
    const res = await api.get('/chefme');
    return res.data;
  },

  // ---------- Profile Update ----------
 updateProfile: async (fields, isFormData = false) => {
  try {
    let headers = {};

    if (isFormData) {
      // FIX: Explicitly set Content-Type to match server expectation for file uploads,
      // similar to the logic in addMenuItem. This is often required in RN.
      headers["Content-Type"] = "multipart/form-data"; 
    } else {
      headers["Content-Type"] = "application/json";
    }

    const res = await api.post( 
      "/chef/profile/update",
      fields,
      {
        headers,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    return res.data;
  } catch (error) {
    console.error("❌ updateProfile error:");
    if (error.response) console.error("Server response:", error.response.data);
    else if (error.request) console.error("No response from server (Possible HTTP Method mismatch or connection block)"); 
    else console.error("Axios config error:", error.message);
    throw error;
  }
},

  updateChefFoodStyle: async (food_styles) => {
    return await ChefService.updateProfile({ food_styles });
  },

  // ---------- Menu ----------
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
    const endpoint =
      type === 'incoming'
        ? 'incoming'
        : type === 'ongoing'
        ? 'ongoing' // <-- FIX: Added the question mark here
        : type === 'completed'
        ? 'completed'
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

  // ---------- Location ----------
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
