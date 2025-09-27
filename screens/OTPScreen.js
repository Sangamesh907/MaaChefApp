// OTPScreen.js
import React, { useRef, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { ChefContext } from '../context/ChefContext';

const OTPScreen = ({ route, navigation }) => {
  const { loginResponse } = route.params || {};
  const { loginChef } = useContext(ChefContext);

  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    const newText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = newText;
    setOtp(newOtp);
    if (newText && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      Alert.alert('Error', 'Enter complete 4-digit OTP');
      return;
    }

    if (enteredOtp !== '1234') {
      Alert.alert('Invalid OTP', 'Please try again.');
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    setLoading(true);
    try {
      // Save chef + token after OTP
      await loginChef(loginResponse.chef, loginResponse.access_token);

      const isProfileComplete =
        loginResponse.chef.name?.trim() && loginResponse.chef.food_styles?.length > 0;

      navigation.reset({
        index: 0,
        routes: [{ name: isProfileComplete ? 'HomeTabs' : 'EditProfile' }],
      });
    } catch (err) {
      console.error('OTP verify error:', err);
      Alert.alert('Error', err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Mobile</Text>
      <View style={styles.otpContainer}>
        {otp.map((val, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpBox}
            maxLength={1}
            keyboardType="number-pad"
            value={val}
            onChangeText={(text) => handleChange(text, index)}
            editable={!loading}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#910f6a" /> : <Text style={styles.buttonText}>Verify Number</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#910f6a' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
  otpBox: { width: 55, height: 55, backgroundColor: '#fff', marginHorizontal: 8, borderRadius: 10, textAlign: 'center', fontSize: 20 },
  button: { backgroundColor: '#fff', paddingVertical: 15, borderRadius: 30, alignItems: 'center', width: '80%' },
  buttonText: { color: '#910f6a', fontWeight: 'bold', fontSize: 16 },
});
