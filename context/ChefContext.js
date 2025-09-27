// ChefContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocationContext } from "./LocationContext";
import ChefService, { BASE_URL } from "../services/api";

export const ChefContext = createContext();

export const ChefProvider = ({ children }) => {
  const { location: splashLocation } = useContext(LocationContext);

  const [chefData, setChefData] = useState({
    id: null,
    name: "",
    phone_number: "",
    email: "",
    native_place: "",
    aadhar_number: "",
    food_styles: [],
    profile_image: null,
    menuItems: [],
    location: { type: "Point", coordinates: [], address: null },
    role: "chef",
    photo_url: null,
  });

  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNewChef, setIsNewChef] = useState(false);

  // -----------------------
  // Normalize chef data
  // -----------------------
  const normalizeChefData = (chef) => {
    const normalized = {
      id: chef.id || chef._id || null,
      name: chef.name || "",
      phone_number: chef.phone_number || "",
      email: chef.email || "",
      native_place: chef.native_place || "",
      aadhar_number: chef.aadhar_number || "",
      food_styles: chef.food_styles || [],
      profile_image: chef.photo_url
        ? `${BASE_URL}${chef.photo_url}`
        : chef.profile_image || null,
      menuItems: chef.menuItems || [],
      location: chef.location || { type: "Point", coordinates: [], address: null },
      role: chef.role || "chef",
      photo_url: chef.photo_url || null,
    };

    // Inject splash location if location is empty
    if (
      (!normalized.location.coordinates || normalized.location.coordinates.length !== 2) &&
      splashLocation?.latitude &&
      splashLocation?.longitude
    ) {
      normalized.location = {
        type: "Point",
        coordinates: [splashLocation.longitude, splashLocation.latitude],
        address: splashLocation.address || null,
      };
    }

    return normalized;
  };

  // -----------------------
  // Load chef from storage
  // -----------------------
  useEffect(() => {
    const loadChef = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("chef_token");
        const savedChef = await AsyncStorage.getItem("chef_data");
        const savedIsNew = await AsyncStorage.getItem("chef_is_new");

        if (savedToken && savedChef) {
          setToken(savedToken);
          setChefData(normalizeChefData(JSON.parse(savedChef)));
          setIsLoggedIn(true);
          setIsNewChef(savedIsNew === "true");
        }
      } catch (err) {
        console.error("Error loading chef from storage:", err);
      } finally {
        setLoading(false);
      }
    };

    loadChef();
  }, [splashLocation]);

  // -----------------------
  // Login chef
  // -----------------------
  const loginChef = async (chef, accessToken, newChefFlag = false) => {
    const fullChefData = normalizeChefData(chef);

    setChefData(fullChefData);
    setToken(accessToken);
    setIsLoggedIn(true);
    setIsNewChef(newChefFlag);

    await AsyncStorage.setItem("chef_token", accessToken);
    await AsyncStorage.setItem("chef_data", JSON.stringify(fullChefData));
    await AsyncStorage.setItem("chef_is_new", newChefFlag ? "true" : "false");
  };

  // -----------------------
  // Unified dynamic update for all chef fields
  // -----------------------
  const updateChefData = async (updatedFields) => {
    try {
      let newChefData = { ...chefData, ...updatedFields };

      // Inject splash location if missing
      if (
        (!newChefData.location?.coordinates ||
          newChefData.location.coordinates.length !== 2) &&
        splashLocation?.latitude &&
        splashLocation?.longitude
      ) {
        newChefData.location = {
          type: "Point",
          coordinates: [splashLocation.longitude, splashLocation.latitude],
          address: splashLocation.address || null,
        };
      }

      // Update food styles via backend if present
      if (updatedFields.food_styles) {
        const response = await ChefService.updateChefFoodStyle(updatedFields.food_styles);
        if (response?.updated) {
          newChefData.food_styles = response.updated.food_styles;
        }
      }

      // Update profile image if changed
      if (updatedFields.profile_image && updatedFields.profile_image !== chefData.profile_image) {
        const formData = new FormData();
        formData.append("profile_image", {
          uri: updatedFields.profile_image,
          type: "image/jpeg",
          name: "profile.jpg",
        });
        const res = await ChefService.updateProfile(formData);
        if (res?.updated) {
          newChefData.profile_image = res.updated.photo_url
            ? `${BASE_URL}${res.updated.photo_url}`
            : newChefData.profile_image;
        }
      }

      // Save updated data to context and AsyncStorage
      setChefData(newChefData);
      await AsyncStorage.setItem("chef_data", JSON.stringify(newChefData));

      return newChefData;
    } catch (err) {
      console.error("Error updating chef data:", err);
      throw err;
    }
  };

  // -----------------------
  // Add menu item
  // -----------------------
  const addMenuItemToContext = async (newItem) => {
    try {
      const updatedMenu = [...chefData.menuItems, newItem];
      const newChefData = { ...chefData, menuItems: updatedMenu };
      setChefData(newChefData);
      await AsyncStorage.setItem("chef_data", JSON.stringify(newChefData));
    } catch (err) {
      console.error("Error adding menu item to context:", err);
    }
  };

  // -----------------------
  // Logout chef
  // -----------------------
  const logoutChef = async () => {
    setChefData({
      id: null,
      name: "",
      phone_number: "",
      email: "",
      native_place: "",
      aadhar_number: "",
      food_styles: [],
      profile_image: null,
      menuItems: [],
      location: { type: "Point", coordinates: [], address: null },
      role: "chef",
      photo_url: null,
    });
    setToken(null);
    setIsLoggedIn(false);
    setIsNewChef(false);
    await AsyncStorage.removeItem("chef_token");
    await AsyncStorage.removeItem("chef_data");
    await AsyncStorage.removeItem("chef_is_new");
  };

  return (
    <ChefContext.Provider
      value={{
        chefData,
        token,
        isLoggedIn,
        isNewChef,
        loading,
        loginChef,
        logoutChef,
        setChefData,
        addMenuItemToContext,
            updateChef: updateChefData, // ✅ add this line

      }}
    >
      {children}
    </ChefContext.Provider>
  );
};
