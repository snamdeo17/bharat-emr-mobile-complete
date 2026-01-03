import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from '../context/AuthContext';
import {ActivityIndicator, View} from 'react-native';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import DoctorRegistrationScreen from '../screens/auth/DoctorRegistrationScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';

// Doctor Screens
import DoctorNavigator from './DoctorNavigator';

// Patient Screens
import PatientNavigator from './PatientNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const {isAuthenticated, loading, userType} = useAuth();

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="DoctorRegistration" component={DoctorRegistrationScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        </>
      ) : userType === 'DOCTOR' ? (
        // Doctor Stack
        <Stack.Screen name="DoctorApp" component={DoctorNavigator} />
      ) : (
        // Patient Stack
        <Stack.Screen name="PatientApp" component={PatientNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
