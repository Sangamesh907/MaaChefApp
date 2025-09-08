import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Get all chefs
      const chefsRes = await fetch('http://13.204.84.41/api/chefs');
      const chefsData = await chefsRes.json();

      // Ensure chefs is always an array
      const chefs = Array.isArray(chefsData)
        ? chefsData
        : chefsData?.data || chefsData?.chefs || [];

      // Step 2: Check if phone exists
      const existingChef = chefs.find(c => String(c.phone_number) === String(phone));

      if (!existingChef) {
        // Step 3: Create chef if not exists
        const createRes = await fetch('http://13.204.84.41/api/chefs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: phone }),
        });

        if (!createRes.ok) {
          Alert.alert('Error', 'Failed to create new chef.');
          setLoading(false);
          return;
        }
        console.log('New chef created');
      }

      // Step 4: Login
      const loginRes = await fetch('http://13.204.84.41/api/chef/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone }),
      });
      const loginData = await loginRes.json();
      console.log('Login API response:', loginData);

      if (loginRes.ok && loginData.access_token) {
        // Save token and phone
        await AsyncStorage.setItem('chef_token', loginData.access_token);
        await AsyncStorage.setItem('chef_mobile', phone);

        // Navigate to OTP screen
        navigation.replace('Otp', { phone });
      } else {
        Alert.alert('Login failed', loginData.message || 'Unknown error occurred');
      }

    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Error', 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <View style={styles.card}>
        <Text style={styles.loginTitle}>Login with Mobile</Text>

        <TextInput
          placeholder="Enter Your Mobile Number"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          maxLength={10}
          onChangeText={(text) => {
            if (/^\d{0,10}$/.test(text)) {
              setPhone(text);
            }
          }}
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: phone.length === 10 ? '#910f6a' : '#ccc' },
          ]}
          disabled={phone.length !== 10 || loading}
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#910f6a',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 250,
    height: 250,
    marginTop: 60,
    resizeMode: 'contain',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 30,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#000',
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 30,
    color: '#333',
  },
  button: {
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});