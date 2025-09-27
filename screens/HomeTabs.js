import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import OrdersScreen from './OrdersScreen';
import MenuScreen from './MenuScreen';
import ProfileScreen from './ProfileScreen';
import AutoFetchLocation from '../components/AutoFetchLocation'; // ✅ import

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <>
      {/* Auto-fetch location in background */}
      <AutoFetchLocation />

      <Tab.Navigator
        initialRouteName="Menu"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#008080',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#eee', height: 60 },
          tabBarIcon: ({ color }) => {
            if (route.name === 'Orders') return <MaterialIcons name="assignment" size={22} color={color} />;
            if (route.name === 'Menu') return <MaterialIcons name="restaurant-menu" size={22} color={color} />;
            if (route.name === 'Profile') return <Icon name="person-outline" size={22} color={color} />;
          },
          tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
        })}
      >
        <Tab.Screen name="Orders" component={OrdersScreen} />
        <Tab.Screen name="Menu" component={MenuScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </>
  );
};

export default HomeTabs;
