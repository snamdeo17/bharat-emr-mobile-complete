import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import Card from '../common/Card';

const MedicineCard = ({medicine}) => {
  return (
    <Card style={styles.card} padding={12}>
      <View style={styles.header}>
        <Icon name="pill" size={20} color={colors.primary} />
        <Text style={styles.name}>{medicine.medicineName}</Text>
      </View>
      <View style={styles.details}>
        <DetailItem label="Dosage" value={medicine.dosage} />
        <DetailItem label="Frequency" value={medicine.frequency} />
        <DetailItem label="Duration" value={medicine.duration} />
      </View>
      {medicine.instructions && (
        <View style={styles.instructions}>
          <Text style={styles.instructionsLabel}>Instructions:</Text>
          <Text style={styles.instructionsText}>{medicine.instructions}</Text>
        </View>
      )}
    </Card>
  );
};

const DetailItem = ({label, value}) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  details: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
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

export default MedicineCard;
