import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
  const navigation = useNavigation();

  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [nativePlace, setNativePlace] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [foodStyle, setFoodStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const savedData = await AsyncStorage.getItem('profileData');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setName(parsed.name || '');
          setMobile(parsed.mobile || '');
          setEmail(parsed.email || '');
          setNativePlace(parsed.nativePlace || '');
          setAadhaar(parsed.aadhaar || '');
          setFoodStyle(parsed.foodStyle || '');
          setImageUri(parsed.imageUri || null);
        }
      } catch (error) {
        console.error('❌ Error loading profile from storage:', error);
      }
    })();
  }, []);

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const openImagePicker = () => setPickerVisible(true);
  const closeImagePicker = () => setPickerVisible(false);

  const chooseCamera = () => {
    launchCamera({ mediaType: 'photo' }, (res) => {
      if (res?.assets?.length > 0) setImageUri(res.assets[0].uri);
      closeImagePicker();
    });
  };

  const chooseGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (res) => {
      if (res?.assets?.length > 0) setImageUri(res.assets[0].uri);
      closeImagePicker();
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Please enter your name';
    if (!mobile.trim() || mobile.length !== 10) newErrors.mobile = 'Enter a valid 10-digit number';
    if (!email.trim()) newErrors.email = 'Please enter your email';
    if (!nativePlace.trim()) newErrors.nativePlace = 'Please enter native place';
    if (!aadhaar.trim() || aadhaar.length !== 12) newErrors.aadhaar = 'Enter a valid 12-digit Aadhaar';
    if (!foodStyle.trim()) newErrors.foodStyle = 'Please select food style';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const token = await AsyncStorage.getItem('chef_token');
    if (!token) {
      setErrors({ general: 'You are not logged in. Please login again.' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('mobile', mobile);
      formData.append('email', email);
      formData.append('native_place', nativePlace);
      formData.append('aadhaar', aadhaar);
      formData.append('food_style', foodStyle);

      if (imageUri) {
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append('profile_image', { uri: imageUri, name: filename, type });
      }

      const res = await fetch('http://13.204.84.41/api/chef/profile/update', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        body: formData,
      });

      const data = await res.json();
      console.log('📡 API RESPONSE:', res.status, data);

      if (res.status === 401) {
        setErrors({ general: 'Session expired. Please login again.' });
        setLoading(false);
        return;
      }

      if (res.ok) {
        await AsyncStorage.setItem(
          'profileData',
          JSON.stringify({ name, email, mobile, nativePlace, aadhaar, foodStyle, imageUri })
        );
        navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
      } else setErrors({ general: data.message || 'Failed to update profile' });
    } catch (error) {
      console.error('❌ Profile update error:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, value, onChangeText, placeholder, keyboardType = 'default', maxLength, errorKey) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[errorKey] && styles.inputError]}
        value={value}
        onChangeText={(text) => {
          clearError(errorKey);
          onChangeText(text);
        }}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {errors[errorKey] && <Text style={styles.errorText}>{errors[errorKey]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
          <View style={styles.imageContainer}>
            <Image source={imageUri ? { uri: imageUri } : require('../assets/default_avatar.png')} style={styles.profileImage} />
            <TouchableOpacity style={styles.editIcon} onPress={openImagePicker}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>✎</Text>
            </TouchableOpacity>
          </View>

          {renderField('Full Name', name, setName, 'Enter Full Name', 'default', 50, 'name')}
          {renderField('Mobile Number', mobile, (t) => /^\d{0,10}$/.test(t) && setMobile(t), '10-digit number', 'phone-pad', 10, 'mobile')}
          {renderField('Email', email, setEmail, 'Enter Email', 'email-address', 100, 'email')}
          {renderField('Native Place', nativePlace, setNativePlace, 'Enter Native Place', 'default', 100, 'nativePlace')}
          {renderField('Aadhaar Number', aadhaar, (t) => /^\d{0,12}$/.test(t) && setAadhaar(t), '12-digit Aadhaar', 'numeric', 12, 'aadhaar')}

          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Food Style</Text>
            <TouchableOpacity
              style={[styles.input, errors.foodStyle && styles.inputError, { justifyContent: 'center' }]}
              onPress={() =>
                navigation.navigate('AddFoodStyle', {
                  selectedFoodStyle: foodStyle,
                  onSelectFoodStyle: setFoodStyle, // callback!
                })
              }
            >
              <Text style={{ color: foodStyle ? '#000' : '#999' }}>
                {foodStyle || 'Tap to select Food Style'}
              </Text>
            </TouchableOpacity>
            {errors.foodStyle && <Text style={styles.errorText}>{errors.foodStyle}</Text>}
          </View>

          {errors.general && <Text style={[styles.errorText, { textAlign: 'center', marginTop: 10 }]}>{errors.general}</Text>}
        </ScrollView>

        <TouchableOpacity style={[styles.saveButton, loading && { opacity: 0.6 }]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Update Profile</Text>}
        </TouchableOpacity>

        <Modal transparent visible={pickerVisible} animationType="slide" onRequestClose={closeImagePicker}>
          <View style={styles.bottomSheet}>
            <TouchableOpacity style={styles.sheetButton} onPress={chooseCamera}>
              <Text style={styles.sheetText}>📷 Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetButton} onPress={chooseGallery}>
              <Text style={styles.sheetText}>🖼 Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sheetButton, { backgroundColor: '#ddd' }]} onPress={closeImagePicker}>
              <Text style={[styles.sheetText, { color: '#333' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  imageContainer: { alignItems: 'center', marginBottom: 24 },
  profileImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: '#0A3E73' },
  editIcon: { position: 'absolute', bottom: 0, right: '35%', backgroundColor: '#0A3E73', padding: 6, borderRadius: 20 },
  fieldWrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#0A3E73', marginBottom: 6 },
  input: { backgroundColor: '#f8f8f8', borderRadius: 8, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: '#ccc', color: '#000' },
  inputError: { borderColor: 'red' },
  errorText: { fontSize: 12, color: 'red', marginTop: 4 },
  saveButton: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0A3E73', paddingVertical: 16, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  sheetButton: { paddingVertical: 14, borderBottomWidth: 1, borderColor: '#eee' },
  sheetText: { fontSize: 16, color: '#0A3E73', textAlign: 'center' },
});
