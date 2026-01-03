import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../config/theme';

// Patient Screens
import PatientDashboardScreen from '../screens/patient/PatientDashboardScreen';
import VisitHistoryScreen from '../screens/patient/VisitHistoryScreen';
import PrescriptionViewScreen from '../screens/patient/PrescriptionViewScreen';
import PatientProfileScreen from '../screens/patient/PatientProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="PatientDashboard"
      component={PatientDashboardScreen}
      options={{title: 'Dashboard'}}
    />
    <Stack.Screen
      name="PrescriptionView"
      component={PrescriptionViewScreen}
      options={{title: 'Prescription'}}
    />
  </Stack.Navigator>
);

const VisitsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="VisitHistory"
      component={VisitHistoryScreen}
      options={{title: 'Visit History'}}
    />
    <Stack.Screen
      name="PrescriptionView"
      component={PrescriptionViewScreen}
      options={{title: 'Prescription'}}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="PatientProfile"
      component={PatientProfileScreen}
      options={{title: 'Profile'}}
    />
  </Stack.Navigator>
);

const PatientNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'view-dashboard';
          } else if (route.name === 'Visits') {
            iconName = 'clipboard-text';
          } else if (route.name === 'Profile') {
            iconName = 'account-circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
      })}>
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Visits" component={VisitsStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default PatientNavigator;
