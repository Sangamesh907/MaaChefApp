import api from './api'; // your central axios instance

// ✅ Update chef profile (with image upload)
export const updateChefProfile = async (formData, token) => {
  const response = await api.post('/chef/profile/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ✅ Get chef profile including menuItems
export const getChefProfile = async (token) => {
  try {
    const response = await api.get('/chef/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // chef object with menuItems
  } catch (error) {
    console.error('Error fetching chef profile:', error);
    throw error;
  }
};
