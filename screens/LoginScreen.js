// LoginScreen.js
import React, { useState, useContext } from 'react';
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
import { ChefContext } from '../context/ChefContext';
import ChefService from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginChef } = useContext(ChefContext);

  const handleLogin = async () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      const loginData = await ChefService.login(phone);
      console.log('Login response:', loginData);

      if (loginData?.access_token) {
        // Save chef + token in context
        await loginChef(loginData.chef, loginData.access_token);

        // ✅ Manual navigation
        if (loginData.new) {
          // New chef → go to OTP
          navigation.navigate('OTPScreen', { phone, loginResponse: loginData });
        } else {
          // Existing chef → go directly to HomeTabs
          navigation.reset({
            index: 0,
            routes: [{ name: 'HomeTabs' }],
          });
        }
      } else {
        Alert.alert('Login failed', loginData?.message || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Login error', err?.message || 'Unexpected error occurred. Please try again.');
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
          onChangeText={(text) => /^\d{0,10}$/.test(text) && setPhone(text)}
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
