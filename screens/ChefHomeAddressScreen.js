// screens/ChefHomeAddressScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from '../utils/locationPermission';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChefHomeAddressScreen = () => {
  const [address, setAddress] = useState('Fetching address...');
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      const granted = await requestLocationPermission();
      if (!granted) {
        setAddress('Location permission denied');
        setLoading(false);
        return;
      }

      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          setCoords({ latitude, longitude });

          try {
            const apiKey = 'AIzaSyAIlSoLOHxe245WHeQd-onRqxTiRORMTOc'; // ✅ replace with your key
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
            );
            const json = await response.json();

            if (json.results && json.results.length > 0) {
              const formattedAddress = json.results[0].formatted_address;
              setAddress(formattedAddress);

              // ✅ Save for ProfileScreen
              await AsyncStorage.setItem('chefAddress', formattedAddress);
            } else {
              setAddress('Address not found');
            }
          } catch (err) {
            console.error(err);
            setAddress('Error fetching address');
          }
          setLoading(false);
        },
        error => {
          console.error(error);
          setAddress('Error fetching location');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }

    fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#008080" />
      ) : (
        <>
          <Text style={styles.title}>{address}</Text>
          {coords && (
            <Text style={styles.subtitle}>
              Lat: {coords.latitude}, Lng: {coords.longitude}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export default ChefHomeAddressScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 16, color: '#333', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#555' },
});
