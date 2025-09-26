// App.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChefProvider, ChefContext } from './context/ChefContext';

import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import HomeTabs from './screens/HomeTabs';
import EditProfileScreen from './screens/EditProfileScreen';
import AddFoodStyleScreen from './screens/AddFoodStyleScreen';
import AddNewItemScreen from './screens/AddNewItemScreen';
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
    <ChefProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ChefProvider>
  );
}

const RootNavigator = () => {
  const { isLoggedIn, loading } = useContext(ChefContext);

  if (loading) return <SplashScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Otp" component={OTPScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true, title: 'Edit Profile' }} />
          <Stack.Screen name="AddFoodStyle" component={AddFoodStyleScreen} options={{ headerShown: true, title: 'Select Food Style' }} />
          <Stack.Screen name="AddNewItem" component={AddNewItemScreen} options={{ headerShown: true, title: 'Add New Item' }} />
          <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ headerShown: true, title: 'Order Details' }} />
          <Stack.Screen name="ChefHomeAddress" component={ChefHomeAddressScreen} options={{ headerShown: true, title: 'Chef Home Address' }} />
          <Stack.Screen name="UserRating" component={UserRatingScreen} options={{ headerShown: true, title: 'User Rating' }} />
          <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} options={{ headerShown: true, title: 'Customer Support' }} />
          <Stack.Screen name="FAQ" component={FAQScreen} options={{ headerShown: true, title: 'FAQs' }} />
          <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} options={{ headerShown: true, title: 'Terms & Conditions' }} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: true, title: 'Privacy Policy' }} />
          <Stack.Screen name="FilterScreen" component={FilterScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};
