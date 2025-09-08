import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SERVICE_TYPES = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

export default function FilterScreen() {
  const navigation = useNavigation();
  const [serviceType, setServiceType] = useState('Breakfast');

  useEffect(() => {
    loadFilter();
  }, []);

  const loadFilter = async () => {
    const stored = await AsyncStorage.getItem('selected_service_type');
    if (stored) setServiceType(stored);
  };

  const handleApply = async () => {
    await AsyncStorage.setItem('selected_service_type', serviceType);
    navigation.goBack();
  };

  const handleReset = async () => {
    setServiceType('Breakfast');
    await AsyncStorage.setItem('selected_service_type', 'Breakfast');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Reset All</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Pills */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Service Type</Text>
        <View style={styles.pillContainer}>
          {SERVICE_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setServiceType(type)}
              style={[
                styles.pill,
                serviceType === type && styles.pillSelected,
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  serviceType === type && styles.pillTextSelected,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Apply Button */}
      <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
        <Text style={styles.applyBtnText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const PRIMARY = '#750656';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  resetText: { color: PRIMARY, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 12 },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    marginBottom: 10,
  },
  pillSelected: {
    backgroundColor: '#f0e6f2',
    borderColor: PRIMARY,
  },
  pillText: { fontSize: 14, color: '#555' },
  pillTextSelected: {
    color: PRIMARY,
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: PRIMARY,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  applyBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
