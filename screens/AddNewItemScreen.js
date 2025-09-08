// AddNewItemScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVICE_TYPES = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

const AddNewItemScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const editingItem = route.params?.editItem;

  const [imageUri, setImageUri] = useState(editingItem?.imageUri || null);
  const [foodName, setFoodName] = useState(editingItem?.foodName || '');
  const [price, setPrice] = useState(editingItem?.price || '');
  const [offPrice, setOffPrice] = useState(editingItem?.offPrice || '');
  const [quantity, setQuantity] = useState(editingItem?.quantity || '');
  const [rating, setRating] = useState(editingItem?.rating || '4.5');
  const [votes, setVotes] = useState(editingItem?.votes || '100');
  const [foodStyle, setFoodStyle] = useState(editingItem?.foodStyle || '');
  const [serviceType, setServiceType] = useState(editingItem?.serviceType || 'Breakfast');

  const [foodTypeOpen, setFoodTypeOpen] = useState(false);
  const [foodType, setFoodType] = useState(editingItem?.foodType || null);

  useEffect(() => {
    if (!editingItem) {
      AsyncStorage.getItem('chef_food_style').then((style) => {
        if (style) setFoodStyle(style);
      });
    }
  }, [editingItem]);

  const handleUploadPhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) return Alert.alert('Image error', response.errorMessage || 'Image picker error');
      if (response.assets && response.assets.length > 0) setImageUri(response.assets[0].uri);
    });
  };

  const handleSave = async () => {
    if (!foodName || !foodStyle || !foodType || !quantity || !price || !serviceType) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('chef_token');
      if (!token) {
        Alert.alert('Session Expired', 'Please login again.');
        navigation.navigate('Login');
        return;
      }

      const formData = new FormData();
      formData.append('food_name', foodName);
      formData.append('food_style', foodStyle);
      formData.append('food_type', foodType);
      formData.append('quantity', Number(quantity));
      formData.append('price', Number(price));
      formData.append('off', offPrice ? Number(offPrice) : 0);
      formData.append('rating', Number(rating));
      formData.append('votes', Number(votes));
      formData.append('service_type', serviceType);
      formData.append('is_available', true);

      if (imageUri) {
        formData.append('photo', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'item.jpg',
        });
      }

      const response = await fetch('http://13.204.84.41/api/chef/item/add', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const responseBody = await response.text();
      if (!response.ok) {
        try {
          const err = JSON.parse(responseBody);
          Alert.alert('Error', err.message || 'Server error');
        } catch (e) {
          Alert.alert('Error', 'Server error. Check logs.');
        }
        return;
      }

      const data = JSON.parse(responseBody);
      if (data.success) {
        let cachedItems = await AsyncStorage.getItem('chef_items');
        cachedItems = cachedItems ? JSON.parse(cachedItems) : [];
        if (editingItem?.id) {
          cachedItems = cachedItems.map((it) => (it.id === editingItem.id ? data.item : it));
        } else cachedItems.push(data.item);
        await AsyncStorage.setItem('chef_items', JSON.stringify(cachedItems));

        Alert.alert('Success', editingItem ? 'Item Updated' : 'Item Added');
        navigation.goBack();
      } else {
        Alert.alert('Failed', data.message || 'Operation failed.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'A network error occurred.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 200 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.headerTitle}>{editingItem ? 'Edit Item' : 'Add New Item'}</Text>

        <TouchableOpacity style={styles.imageWrapper} onPress={handleUploadPhoto}>
          <Image source={imageUri ? { uri: imageUri } : require('../assets/sample_food.png')} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleUploadPhoto} style={styles.uploadBtn}>
          <Text style={styles.uploadText}>Upload Photo</Text>
        </TouchableOpacity>

        <TextInput placeholder="Food Name" placeholderTextColor="#888" style={styles.input} value={foodName} onChangeText={setFoodName} />

        <Text style={styles.label}>Food Style</Text>
        <View style={styles.readonlyField}>
          <Text style={styles.readonlyText}>{foodStyle || '...'}</Text>
        </View>

        <DropDownPicker
          open={foodTypeOpen}
          value={foodType}
          setOpen={setFoodTypeOpen}
          setValue={setFoodType}
          items={[
            { label: 'Veg', value: 'veg' },
            { label: 'Non-Veg', value: 'non_veg' },
          ]}
          placeholder="Food Type"
          listMode="MODAL"
          modalTitle="Select Food Type"
          style={[styles.dropdown, { marginTop: 15 }]}
        />

        <Text style={styles.label}>Service Type</Text>
        <View style={styles.serviceContainer}>
          {SERVICE_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.serviceButton, serviceType === type && styles.serviceSelected]}
              onPress={() => setServiceType(type)}
            >
              <Text style={[styles.serviceText, serviceType === type && styles.serviceTextSelected]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput placeholder="Quantity" placeholderTextColor="#888" keyboardType="numeric" style={styles.input} value={String(quantity)} onChangeText={setQuantity} />
        <TextInput placeholder="Price (₹)" placeholderTextColor="#888" keyboardType="numeric" style={styles.input} value={String(price)} onChangeText={setPrice} />
        <TextInput placeholder="Off (%)" placeholderTextColor="#888" keyboardType="numeric" style={styles.input} value={String(offPrice)} onChangeText={setOffPrice} />

        <TouchableOpacity style={styles.addBtn} onPress={handleSave}>
          <Text style={styles.addText}>{editingItem ? 'Update' : 'Add'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddNewItemScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  imageWrapper: { width: '100%', height: 200, backgroundColor: '#eee', borderRadius: 10, overflow: 'hidden' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  uploadBtn: { backgroundColor: '#e2f4ee', padding: 10, alignSelf: 'center', marginVertical: 10, borderRadius: 20 },
  uploadText: { color: '#2a7d58', fontWeight: 'bold' },
  input: { borderBottomWidth: 1, borderColor: '#ccc', fontSize: 15, paddingVertical: 8, marginTop: 15, color: '#000' },
  dropdown: { borderColor: '#ccc' },
  label: { fontSize: 14, fontWeight: '600', color: '#000', marginTop: 20 },
  readonlyField: { borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 10 },
  readonlyText: { fontSize: 15, color: '#555' },
  addBtn: { backgroundColor: '#910f6a', paddingVertical: 15, alignItems: 'center', borderRadius: 6, marginTop: 30 },
  addText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  serviceContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, flexWrap: 'wrap' },
  serviceButton: { borderWidth: 1, borderColor: '#ccc', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginVertical: 5 },
  serviceSelected: { backgroundColor: '#910f6a', borderColor: '#910f6a' },
  serviceText: { color: '#000', fontWeight: '500' },
  serviceTextSelected: { color: '#fff', fontWeight: '600' },
});
