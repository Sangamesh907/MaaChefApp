// LocationContext.js
import React, { createContext, useState, useEffect } from "react";
import Geolocation from "@react-native-community/geolocation";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null); // { latitude, longitude, address }

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Optionally: fetch address from backend or reverse geocode
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.warn("Location fetch failed:", error.message);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
