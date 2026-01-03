import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import Input from '../common/Input';
import Button from '../common/Button';

const MedicineInput = ({medicines = [], onMedicinesChange}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState({
    medicineName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });

  const handleAddMedicine = () => {
    if (currentMedicine.medicineName && currentMedicine.dosage) {
      onMedicinesChange([...medicines, currentMedicine]);
      setCurrentMedicine({
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveMedicine = index => {
    const updated = medicines.filter((_, i) => i !== index);
    onMedicinesChange(updated);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Medicines</Text>
        {!showAddForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}>
            <Icon name="plus-circle" size={24} color={colors.primary} />
            <Text style={styles.addButtonText}>Add Medicine</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Medicine List */}
      {medicines.map((med, index) => (
        <View key={index} style={styles.medicineCard}>
          <View style={styles.medicineContent}>
            <Text style={styles.medicineName}>{med.medicineName}</Text>
            <Text style={styles.medicineDetails}>
              {med.dosage} • {med.frequency} • {med.duration}
            </Text>
            {med.instructions && (
              <Text style={styles.instructions}>{med.instructions}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => handleRemoveMedicine(index)}>
            <Icon name="close-circle" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      ))}

      {/* Add Medicine Form */}
      {showAddForm && (
        <View style={styles.form}>
          <Input
            label="Medicine Name *"
            placeholder="e.g., Paracetamol"
            value={currentMedicine.medicineName}
            onChangeText={text =>
              setCurrentMedicine({...currentMedicine, medicineName: text})
            }
          />
          <Input
            label="Dosage *"
            placeholder="e.g., 500mg"
            value={currentMedicine.dosage}
            onChangeText={text =>
              setCurrentMedicine({...currentMedicine, dosage: text})
            }
          />
          <Input
            label="Frequency"
            placeholder="e.g., Twice daily"
            value={currentMedicine.frequency}
            onChangeText={text =>
              setCurrentMedicine({...currentMedicine, frequency: text})
            }
          />
          <Input
            label="Duration"
            placeholder="e.g., 7 days"
            value={currentMedicine.duration}
            onChangeText={text =>
              setCurrentMedicine({...currentMedicine, duration: text})
            }
          />
          <Input
            label="Instructions"
            placeholder="e.g., Take after meals"
            value={currentMedicine.instructions}
            onChangeText={text =>
              setCurrentMedicine({...currentMedicine, instructions: text})
            }
            multiline
            numberOfLines={2}
          />

          <View style={styles.formActions}>
            <Button
              title="Cancel"
              onPress={() => setShowAddForm(false)}
              variant="outline"
              style={styles.formButton}
            />
            <Button
              title="Add"
              onPress={handleAddMedicine}
              style={styles.formButton}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  medicineCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  medicineContent: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  medicineDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  instructions: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  form: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  formButton: {
    flex: 0.48,
  },
});

export default MedicineInput;
