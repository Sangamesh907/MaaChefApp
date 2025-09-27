// ProfileScreen.js
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChefContext } from '../context/ChefContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { chefData, logoutChef } = useContext(ChefContext);

  // Force re-render on focus to show latest profile
  const [, setRefresh] = React.useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setRefresh(prev => !prev);
    }, [])
  );

  const handleMenuPress = (label) => {
    switch (label) {
      case 'Orders':
        navigation.navigate('Orders');
        break;
      case 'Chef Home Address':
        navigation.navigate('ChefHomeAddress');
        break;
      case 'User Rating':
        navigation.navigate('UserRating');
        break;
      case 'Customer Support':
        navigation.navigate('CustomerSupport');
        break;
      case "FAQ's":
        navigation.navigate('FAQ');
        break;
      case 'Terms and Conditions':
        navigation.navigate('TermsConditions');
        break;
      case 'Privacy Policy':
        navigation.navigate('PrivacyPolicy');
        break;
      default:
        break;
    }
  };

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
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={
              chefData.profile_image
                ? { uri: chefData.profile_image } // full URL
                : require('../assets/default_avatar.png')
            }
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{chefData.name || 'Your Name'}</Text>
            <Text style={styles.email}>{chefData.email || 'you@example.com'}</Text>
            <Text style={styles.phone}>{chefData.phone_number || '0123456789'}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editIcon}
          >
            <Icon name="create-outline" size={20} color="#008080" />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Menu List */}
        <ScrollView style={styles.menu} contentContainerStyle={{ paddingBottom: 10 }}>
          {[
            { icon: 'reorder-three', text: 'Orders' },
            { icon: 'location-outline', text: 'Chef Home Address' },
            { icon: 'star-outline', text: 'User Rating' },
            { icon: 'headset-outline', text: 'Customer Support' },
            { icon: 'help-circle-outline', text: "FAQ's" },
            { icon: 'document-text-outline', text: 'Terms and Conditions' },
            { icon: 'shield-checkmark-outline', text: 'Privacy Policy' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => handleMenuPress(item.text)}
            >
              <View style={styles.itemLeft}>
                <Icon name={item.icon} size={40} color="#008080" />
                <Text style={styles.itemText}>{item.text}</Text>
              </View>
              <Icon name="chevron-forward-outline" size={27} color="#bbb" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', padding: 20, alignItems: 'center', backgroundColor: '#fff' },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: '#ccc' },
  userInfo: { marginLeft: 15, flex: 1 },
  name: { fontWeight: 'bold', fontSize: 17, color: '#000' },
  email: { fontSize: 14, color: '#555' },
  phone: { fontSize: 14, color: '#555' },
  editIcon: { alignItems: 'center' },
  editText: { color: '#008080', fontSize: 13, marginTop: 2 },
  menu: { marginTop: 10 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#fdfdfd',
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemText: { marginLeft: 10, fontSize: 15, color: '#333' },
  logoutBtn: {
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#e6f3f1',
    borderRadius: 20,
    alignItems: 'center',
  },
  logoutText: { color: '#008080', fontWeight: 'bold', fontSize: 16 },
});
