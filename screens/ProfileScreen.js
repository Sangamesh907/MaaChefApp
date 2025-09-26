import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ChefContext } from '../context/ChefContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { chefData, logoutChef } = useContext(ChefContext);

  const profileFields = [
    { label: 'Profile Image', key: 'profile_image', type: 'image' },
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone_number' },
    { label: 'Native Place', key: 'native_place' },
    { label: 'Aadhaar', key: 'aadhar_number' },
    { label: 'Food Styles', key: 'food_styles' },
  ];

  const menuItems = [
    { icon: 'reorder-three', text: 'Orders', route: 'Orders' },
    { icon: 'location-outline', text: 'Chef Home Address', route: 'ChefHomeAddress' },
    { icon: 'star-outline', text: 'User Rating', route: 'UserRating' },
    { icon: 'headset-outline', text: 'Customer Support', route: 'CustomerSupport' },
    { icon: 'help-circle-outline', text: "FAQ's", route: 'FAQ' },
    { icon: 'document-text-outline', text: 'Terms and Conditions', route: 'TermsConditions' },
    { icon: 'shield-checkmark-outline', text: 'Privacy Policy', route: 'PrivacyPolicy' },
  ];

  const handleMenuPress = (route) => navigation.navigate(route);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logoutChef();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {profileFields.map((field) => {
            const value = chefData[field.key];

            // Render profile image at top
            if (field.type === 'image') {
              return (
                <Image
                  key={field.key}
                  source={
                    value
                      ? { uri: value }
                      : require('../assets/default_avatar.png')
                  }
                  style={styles.avatar}
                />
              );
            }

            const displayValue = Array.isArray(value)
              ? value.join(', ')
              : value || 'Not set';

            return (
              <View key={field.key} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{field.label}</Text>
                <Text style={styles.detailValue}>{displayValue}</Text>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="create-outline" size={18} color="#fff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.route)}
            >
              <View style={styles.menuLeft}>
                <Icon name={item.icon} size={28} color="#008080" />
                <Text style={styles.menuText}>{item.text}</Text>
              </View>
              <Icon name="chevron-forward-outline" size={22} color="#bbb" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },

  profileCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  avatar: { width: 110, height: 110, borderRadius: 55, marginBottom: 15 },

  detailRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  detailLabel: { color: '#555', fontWeight: '600', fontSize: 15 },
  detailValue: { color: '#111', fontWeight: '500', fontSize: 15 },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
  },
  editButtonText: { color: '#fff', fontWeight: '600', marginLeft: 6 },

  menuContainer: { marginTop: 20 },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 6,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuText: { marginLeft: 12, fontSize: 15, fontWeight: '500', color: '#333' },

  logoutBtn: {
    marginHorizontal: 15,
    marginTop: 25,
    backgroundColor: '#ffe6e6',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  logoutText: { color: '#ff4d4d', fontWeight: 'bold', fontSize: 16 },
});
