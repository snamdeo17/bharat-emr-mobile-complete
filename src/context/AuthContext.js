import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const storedUserType = await AsyncStorage.getItem('userType');
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('userName');

      if (token && storedUserType && userId) {
        setUser({userId, userName});
        setUserType(storedUserType);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (mobileNumber, otp, type) => {
    try {
      const endpoint = type === 'DOCTOR' ? '/doctors/login' : '/patients/login';
      const response = await api.post(endpoint, {mobileNumber, otp});

      const {token, userId, userName, userType: responseUserType} = response.data.data;

      await AsyncStorage.setItem('jwtToken', token);
      await AsyncStorage.setItem('userType', responseUserType);
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('userName', userName);

      setUser({userId, userName});
      setUserType(responseUserType);

      return {success: true};
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');
      await AsyncStorage.removeItem('userType');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userName');
      setUser(null);
      setUserType(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const register = async (registrationData) => {
    try {
      const response = await api.post('/doctors/register', registrationData);

      const {token, userId, userName, userType: responseUserType} = response.data.data;

      await AsyncStorage.setItem('jwtToken', token);
      await AsyncStorage.setItem('userType', responseUserType);
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('userName', userName);

      setUser({userId, userName});
      setUserType(responseUserType);

      return {success: true};
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
