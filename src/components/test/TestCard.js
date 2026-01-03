import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import Card from '../common/Card';

const TestCard = ({test}) => {
  return (
    <Card style={styles.card} padding={12}>
      <View style={styles.header}>
        <Icon name="test-tube" size={20} color={colors.secondary} />
        <Text style={styles.name}>{test.testName}</Text>
      </View>
      {test.instructions && (
        <View style={styles.instructions}>
          <Text style={styles.instructionsLabel}>Instructions:</Text>
          <Text style={styles.instructionsText}>{test.instructions}</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  instructions: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  instructionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  instructionsText: {
    fontSize: 12,
    color: colors.text,
    fontStyle: 'italic',
  },
});

export default TestCard;
