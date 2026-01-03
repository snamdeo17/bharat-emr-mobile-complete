import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../config/theme';

// Doctor Screens
import DoctorDashboardScreen from '../screens/doctor/DoctorDashboardScreen';
import PatientListScreen from '../screens/doctor/PatientListScreen';
import PatientDetailScreen from '../screens/doctor/PatientDetailScreen';
import AddPatientScreen from '../screens/doctor/AddPatientScreen';
import CreateVisitScreen from '../screens/doctor/CreateVisitScreen';
import VisitDetailScreen from '../screens/doctor/VisitDetailScreen';
import ProfileScreen from '../screens/doctor/ProfileScreen';
import FollowUpListScreen from '../screens/doctor/FollowUpListScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="DoctorDashboard"
      component={DoctorDashboardScreen}
      options={{title: 'Dashboard'}}
    />
    <Stack.Screen
      name="VisitDetail"
      component={VisitDetailScreen}
      options={{title: 'Visit Details'}}
    />
  </Stack.Navigator>
);

const PatientsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="PatientList"
      component={PatientListScreen}
      options={{title: 'My Patients'}}
    />
    <Stack.Screen
      name="AddPatient"
      component={AddPatientScreen}
      options={{title: 'Add Patient'}}
    />
    <Stack.Screen
      name="PatientDetail"
      component={PatientDetailScreen}
      options={{title: 'Patient Details'}}
    />
    <Stack.Screen
      name="CreateVisit"
      component={CreateVisitScreen}
      options={{title: 'Create Visit'}}
    />
  </Stack.Navigator>
);

const FollowUpStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="FollowUpList"
      component={FollowUpListScreen}
      options={{title: 'Follow-ups'}}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="DoctorProfile"
      component={ProfileScreen}
      options={{title: 'Profile'}}
    />
  </Stack.Navigator>
);

const DoctorNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'view-dashboard';
          } else if (route.name === 'Patients') {
            iconName = 'account-group';
          } else if (route.name === 'FollowUps') {
            iconName = 'calendar-clock';
          } else if (route.name === 'Profile') {
            iconName = 'account-circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
      })}>
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Patients" component={PatientsStack} />
      <Tab.Screen name="FollowUps" component={FollowUpStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default DoctorNavigator;
