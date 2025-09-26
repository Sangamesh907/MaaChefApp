import { PermissionsAndroid, Platform } from 'react-native';

export async function requestLocationPermission() {
    if (Platform.OS !== 'android') {
        return true;
    }

    try {
        const fineGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'MaaChef Location Permission',
                message: 'MaaChef needs access to your location to show live tracking',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );

        if (fineGranted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('Fine location denied');
            return false;
        }

        // Only request background location if fine location was granted
        if (Platform.Version >= 29) {
            const backgroundGranted = await PermissionsAndroid.request(
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

            if (backgroundGranted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.warn('Background location denied');
                return false;
            }
        }

        return true;
    } catch (err) {
        console.warn('requestLocationPermission error', err);
        return false;
    }
}