import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ChefContext = createContext();

export const ChefProvider = ({ children }) => {
  const [chefData, setChefData] = useState({
    id: null,
    name: '',
    phone_number: '',
    email: '',
    native_place: '',
    aadhar_number: '',
    food_styles: '',
    profile_image: null,
    menuItems: [],
  });

  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const savedToken = await AsyncStorage.getItem('chef_token');
      if (savedToken) setIsLoggedIn(true);
      setLoading(false);
    };
    checkLogin();
  }, []);

  const normalizeMenuItems = (items = []) =>
    items.map(item => ({ ...item, id: item.id || item._id }));

  const normalizeFoodStyles = (styles) => {
    if (!styles) return '';
    if (Array.isArray(styles)) return styles;
    if (typeof styles === 'string') return styles;
    return '';
  };

  const loginChef = async (chef, accessToken) => {
    setChefData({
      ...chef,
      id: chef.id || chef._id,
      menuItems: normalizeMenuItems(chef.menuItems),
      food_styles: normalizeFoodStyles(chef.food_styles),
      name: chef.name || '',
      phone_number: chef.phone_number || '',
      email: chef.email || '',
      native_place: chef.native_place || '',
      aadhar_number: chef.aadhar_number || '',
      profile_image: chef.profile_image || null,
    });
    setToken(accessToken);
    setIsLoggedIn(true);
    await AsyncStorage.setItem('chef_token', accessToken);
  };

  const logoutChef = async () => {
    setChefData({
      id: null,
      name: '',
      phone_number: '',
      email: '',
      native_place: '',
      aadhar_number: '',
      food_styles: '',
      profile_image: null,
      menuItems: [],
    });
    setToken(null);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('chef_token');
  };

  const updateChefProfile = (updatedData) => {
    setChefData(prev => ({
      ...prev,
      ...updatedData,
      menuItems: normalizeMenuItems(updatedData.menuItems || prev.menuItems),
      food_styles: normalizeFoodStyles(updatedData.food_styles || prev.food_styles),
      phone_number: updatedData.phone_number || prev.phone_number, // ✅ ensure phone updates
    }));
  };

  const updateChef = (updatedData) => {
    if (typeof updatedData === 'function') {
      setChefData(prev => {
        const newData = updatedData(prev);
        return {
          ...prev,
          ...newData,
          menuItems: normalizeMenuItems(newData.menuItems || prev.menuItems),
          food_styles: normalizeFoodStyles(newData.food_styles || prev.food_styles),
          phone_number: newData.phone_number || prev.phone_number, // ✅ ensure phone updates
        };
      });
    } else {
      setChefData(prev => ({
        ...prev,
        ...updatedData,
        menuItems: normalizeMenuItems(updatedData.menuItems || prev.menuItems),
        food_styles: normalizeFoodStyles(updatedData.food_styles || prev.food_styles),
        phone_number: updatedData.phone_number || prev.phone_number, // ✅ ensure phone updates
      }));
    }
  };

  const addMenuItem = (newItem) => {
    setChefData(prev => ({
      ...prev,
      menuItems: [...(prev.menuItems || []), { ...newItem, id: newItem.id || newItem._id }],
    }));
  };

  const updateMenuItem = (updatedItem) => {
    setChefData(prev => ({
      ...prev,
      menuItems: (prev.menuItems || []).map(item =>
        item.id === (updatedItem.id || updatedItem._id)
          ? { ...item, ...updatedItem, id: updatedItem.id || updatedItem._id }
          : item
      ),
    }));
  };

  const getChefId = () => chefData?.id || chefData?._id || null;

  return (
    <ChefContext.Provider
      value={{
        chefData,
        token,
        isLoggedIn,
        loading,
        loginChef,
        logoutChef,
        updateChef,
        updateChefProfile,
        addMenuItem,
        updateMenuItem,
        getChefId,
      }}
    >
      {children}
    </ChefContext.Provider>
  );
};
