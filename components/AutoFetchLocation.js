// components/AutoFetchLocation.js
import { useEffect } from "react";
import Geolocation from "@react-native-community/geolocation";
import { requestLocationPermission } from "../utils/locationPermission"; // your utils function
import { ChefContext } from "../context/ChefContext";
import { useContext } from "react";
import ChefService from "../services/api"; // ✅ use ChefService directly

const BENGALURU_BOUND = { minLat: 12.834, maxLat: 13.139, minLng: 77.44, maxLng: 77.77 };

const AutoFetchLocation = () => {
  const { updateChef } = useContext(ChefContext);

  useEffect(() => {
    let watchId;

    const fetchLocation = async () => {
      const granted = await requestLocationPermission();
      if (!granted) {
        console.warn("Location permission denied");
        return;
      }

      watchId = Geolocation.watchPosition(
        async (position) => {
          try {
            let { latitude, longitude } = position.coords;

            // Clamp to Bengaluru bounds
            latitude = Math.max(BENGALURU_BOUND.minLat, Math.min(latitude, BENGALURU_BOUND.maxLat));
            longitude = Math.max(BENGALURU_BOUND.minLng, Math.min(longitude, BENGALURU_BOUND.maxLng));

            console.log("Fetched coordinates:", latitude, longitude);

            // Update backend
            const res = await ChefService.updateLocation(latitude, longitude);
            console.log("Location update response:", res);

            // Update local context
            updateChef((prev) => ({
              ...prev,
              location: { latitude, longitude },
            }));
          } catch (err) {
            console.error("Error updating location:", err);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
        },
        { enableHighAccuracy: true, distanceFilter: 10, interval: 10000, fastestInterval: 5000 }
      );
    };

    fetchLocation();

    return () => {
      if (watchId !== undefined) Geolocation.clearWatch(watchId);
    };
  }, []);

  return null; // This component does not render anything
};

export default AutoFetchLocation;
