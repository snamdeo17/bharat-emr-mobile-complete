import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';
import {colors} from '../../config/theme';

const LoadingSpinner = ({message = 'Loading...', size = 'large', fullScreen = true}) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <ActivityIndicator size={size} color={colors.primary} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.inlineContainer}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  inlineContainer: {
    padding: 20,
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default LoadingSpinner;
