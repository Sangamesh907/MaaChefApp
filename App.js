// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';

import EditProfileScreen from './screens/EditProfileScreen';
import AddFoodStyleScreen from './screens/AddFoodStyleScreen';
import AddNewItemScreen from './screens/AddNewItemScreen';
import HomeTabs from './screens/HomeTabs';
import OrderDetailsScreen from './screens/OrderDetailsScreen';

import ChefHomeAddressScreen from './screens/ChefHomeAddressScreen';
import UserRatingScreen from './screens/UserRatingScreen';
import CustomerSupportScreen from './screens/CustomerSupportScreen';
import FAQScreen from './screens/FAQScreen';
import TermsConditionsScreen from './screens/TermsConditionsScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import FilterScreen from './screens/FilterScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* Auth Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Otp" component={OTPScreen} options={{ headerShown: false }} />

        {/* Main App */}
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />

        {/* Sub Screens */}
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
        <Stack.Screen name="AddFoodStyle" component={AddFoodStyleScreen} options={{ title: 'Select Food Style' }} />
        <Stack.Screen name="AddNewItem" component={AddNewItemScreen} options={{ title: 'Add New Item' }} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ title: 'Order Details' }} />

        {/* Profile Sub Screens */}
        <Stack.Screen
  name="ChefHomeAddress"
  component={ChefHomeAddressScreen}
  options={{ title: 'Chef Home Address' }}
/>

        <Stack.Screen name="UserRating" component={UserRatingScreen} options={{ title: 'User Rating' }} />
        <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} options={{ title: 'Customer Support' }} />
        <Stack.Screen name="FAQ" component={FAQScreen} options={{ title: 'FAQs' }} />
        <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} options={{ title: 'Terms & Conditions' }} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />

        {/* ✅ New: Filter Screen */}
        <Stack.Screen
  name="FilterScreen"
  component={FilterScreen}
  options={{ headerShown: false }}
/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
