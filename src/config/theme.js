import {DefaultTheme} from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2563eb', // Blue
    secondary: '#10b981', // Green
    accent: '#f59e0b', // Amber
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    disabled: '#9ca3af',
    placeholder: '#9ca3af',
  },
  roundness: 8,
};

export const colors = theme.colors;
