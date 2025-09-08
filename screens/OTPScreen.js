import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

const OtpScreen = ({ route, navigation }) => {
  const { phone } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    const newText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = newText;
    setOtp(newOtp);

    if (newText && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit OTP');
      return;
    }

    // No backend call, accept any OTP
    navigation.replace('EditProfile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Mobile</Text>
      <Text style={styles.subtitle}>
        Enter the 4-digit code sent to <Text style={styles.phone}>{phone}</Text>
      </Text>

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
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#910f6a' },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { color: '#eee', fontSize: 14, textAlign: 'center', marginBottom: 30 },
  phone: { color: '#fff', fontWeight: 'bold' },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
  otpBox: {
    width: 55,
    height: 55,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    elevation: 3,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: { color: '#910f6a', fontSize: 16, fontWeight: 'bold' },
});








