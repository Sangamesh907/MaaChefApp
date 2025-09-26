import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { ChefContext } from "../context/ChefContext";
import { updateLocation, getAddressFromCoords } from "../services/LocationService";

const ChefHomeAddressScreen = ({ navigation }) => {
  const { token, updateChef } = useContext(ChefContext);
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState({ fullAddress: "", flat: "", landmark: "", area: "" });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("⏳ Initializing...");
  const [watchId, setWatchId] = useState(null);

  const BENGALURU_BOUND = { minLat: 12.834, maxLat: 13.139, minLng: 77.44, maxLng: 77.77 };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === "ios") {
        const auth = await Geolocation.requestAuthorization("whenInUse");
        return auth === "granted";
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.error("Permission error:", err);
      return false;
    }
  };

  const fetchLocation = async () => {
    const granted = await requestLocationPermission();
    if (!granted) {
      setStatus("❌ Permission denied");
      setLoading(false);
      return;
    }

    const id = Geolocation.watchPosition(
      async (position) => {
        let { latitude, longitude } = position.coords;

        // Clamp within Bengaluru
        latitude = Math.max(BENGALURU_BOUND.minLat, Math.min(latitude, BENGALURU_BOUND.maxLat));
        longitude = Math.max(BENGALURU_BOUND.minLng, Math.min(longitude, BENGALURU_BOUND.maxLng));

        setCoords({ latitude, longitude });
        setLoading(false);

        try {
          if (token) {
            const res = await updateLocation(latitude, longitude, token);
            setStatus(res?.message || "✅ Location updated");
          }

          const fullAddress = await getAddressFromCoords(latitude, longitude);
          setAddress(prev => ({ ...prev, fullAddress }));
        } catch (err) {
          console.error("❌ Backend/location fetch failed:", err);
          setStatus("❌ Update failed");
        }
      },
      (err) => {
        console.error("❌ Location error:", err);
        setStatus(`❌ Error: ${err.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true, distanceFilter: 10, interval: 10000, fastestInterval: 5000 }
    );

    setWatchId(id);
  };

  useEffect(() => {
    fetchLocation();
    return () => { if (watchId !== null) Geolocation.clearWatch(watchId); };
  }, [token]);

  const confirmLocation = async () => {
    if (!coords) return;
    try {
      const res = await updateLocation(coords.latitude, coords.longitude, token);
      console.log("Confirmed location:", res);

      // Update context
      updateChef(prev => ({
        ...prev,
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          flat: address.flat,
          landmark: address.landmark,
          area: address.area,
          fullAddress: address.fullAddress,
        },
      }));

      alert("Location confirmed ✅");
      navigation.goBack();
    } catch (err) {
      console.error("Confirm failed:", err);
      alert("Failed to confirm location ❌");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#750656" />
        <Text style={{ marginTop: 10 }}>{status}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {coords && (
        <>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{ latitude: coords.latitude, longitude: coords.longitude, latitudeDelta: 0.03, longitudeDelta: 0.03 }}
            minZoomLevel={12}
            maxZoomLevel={18}
            showsUserLocation={true}
          >
            <Marker
              coordinate={coords}
              draggable
              onDragEnd={async (e) => {
                let { latitude, longitude } = e.nativeEvent.coordinate;
                latitude = Math.max(BENGALURU_BOUND.minLat, Math.min(latitude, BENGALURU_BOUND.maxLat));
                longitude = Math.max(BENGALURU_BOUND.minLng, Math.min(longitude, BENGALURU_BOUND.maxLng));
                const newCoords = { latitude, longitude };
                setCoords(newCoords);
                setStatus("📍 Location updated on map");

                try {
                  const fullAddress = await getAddressFromCoords(latitude, longitude);
                  setAddress(prev => ({ ...prev, fullAddress }));
                } catch (err) {
                  console.error("❌ getAddressFromCoords error:", err);
                  setStatus("❌ Failed to get address");
                }
              }}
            />
          </MapView>

          <View style={styles.addressCard}>
            <Text style={styles.coordText}>Latitude: {coords.latitude.toFixed(6)}, Longitude: {coords.longitude.toFixed(6)}</Text>
            <Text style={styles.addressTitle}>📌 {address.fullAddress || "Fetching address..."}</Text>

            <TextInput style={styles.input} placeholder="Flat No" value={address.flat} onChangeText={(flat) => setAddress(prev => ({ ...prev, flat }))} />
            <TextInput style={styles.input} placeholder="Landmark" value={address.landmark} onChangeText={(landmark) => setAddress(prev => ({ ...prev, landmark }))} />
            <TextInput style={styles.input} placeholder="Area" value={address.area} onChangeText={(area) => setAddress(prev => ({ ...prev, area }))} />

            <TouchableOpacity style={styles.confirmBtn} onPress={confirmLocation}>
              <Text style={styles.confirmText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.statusText}>{status}</Text>
        </>
      )}
    </View>
  );
};

export default ChefHomeAddressScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  map: { flex: 1 },
  addressCard: { position: "absolute", bottom: 0, width: "100%", backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  coordText: { fontSize: 14, color: "#000", marginBottom: 5, fontWeight: "600" },
  addressTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#000" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 10, color: "#000", fontSize: 14 },
  confirmBtn: { backgroundColor: "#750656", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 5 },
  confirmText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  statusText: { position: "absolute", bottom: 250, alignSelf: "center", fontSize: 14, color: "#666" },
});
