import api from './api';

// Login chef with phone number
export const loginChef = async (phone_number) => {
  try {
    const res = await api.post('/chef/login', { phone_number });
    return res.data; // { access_token, chef }
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Verify OTP
export const verifyOtp = async (phone_number, otp) => {
  try {
    const res = await api.post('/chef/verify-otp', { phone_number, otp });
    return res.data; // { access_token, chef }
  } catch (error) {
    throw error.response?.data || { message: 'OTP verification failed' };
  }
};

// Fetch full chef profile
export const fetchChefProfile = async (token) => {
  try {
    const res = await api.get('/chef/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // full chef object
  } catch (error) {
    throw error.response?.data || { message: 'Fetching profile failed' };
  }
};
