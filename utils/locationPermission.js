import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Request fine location permission (Android).
 * Returns true if granted, false otherwise.
 */
export async function requestLocationPermission() {
  if (Platform.OS !== 'android') {
    // iOS: permissions are prompted by the geolocation library or use react-native-permissions
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'MaaChef Location Permission',
        message: 'MaaChef needs access to your location to show live tracking',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('requestLocationPermission error', err);
    return false;
  }
}

/**
 * Optional: request background location (if you plan to track in background).
 * Note: you must also add ACCESS_BACKGROUND_LOCATION to AndroidManifest and handle Android 11+ special cases.
 */
export async function requestBackgroundLocationPermission() {
  if (Platform.OS !== 'android') return true;

  try {
    // Android requires a separate permission for background location
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      {
        title: 'MaaChef Background Location',
        message:
          'MaaChef needs background location to continue tracking while the app is closed',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('requestBackgroundLocationPermission error', err);
    return false;
  }
}
