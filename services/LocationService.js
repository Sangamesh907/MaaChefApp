// services/locationService.js
import API from './api';
import axios from 'axios';

// Update chef location
export const updateLocation = async (latitude, longitude) => {
  try {
    const response = await API.post('/cheflocation/update', {
      latitude: String(latitude),
      longitude: String(longitude),
    });

    console.log('📍 Location API response:', response.data);
    return response.data;
  } catch (err) {
    console.error('❌ Location update failed:', err.response?.data || err.message);
    throw err;
  }
};

// Reverse geocoding using OpenStreetMap for immediate display
export const getAddressFromCoords = async (latitude, longitude) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const response = await axios.get(url, { timeout: 10000 });

    if (response.data?.display_name) {
      console.log('📌 OSM Address:', response.data.display_name);
      return response.data.display_name;
    } else {
      console.warn('⚠️ Address not found from OSM');
      return 'Address not found';
    }
  } catch (err) {
    console.error('❌ getAddressFromCoords error:', err.message);
    return 'Error fetching address';
  }
};
