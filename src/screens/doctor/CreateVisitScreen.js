import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import api from '../../config/api';
import {format} from 'date-fns';

const CreateVisitScreen = ({navigation, route}) => {
  const {patientId} = route.params;
  const [loading, setLoading] = useState(false);
  
  // Visit Data
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [presentIllness, setPresentIllness] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  
  // Medicines
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({
    medicineName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });
  
  // Tests
  const [tests, setTests] = useState([]);
  const [newTest, setNewTest] = useState({
    testName: '',
    instructions: '',
  });
  
  // Follow-up
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');

  const addMedicine = () => {
    if (!newMedicine.medicineName || !newMedicine.dosage) {
      Alert.alert('Error', 'Please enter medicine name and dosage');
      return;
    }
    setMedicines([...medicines, {...newMedicine}]);
    setNewMedicine({
      medicineName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    });
  };

  const removeMedicine = index => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const addTest = () => {
    if (!newTest.testName) {
      Alert.alert('Error', 'Please enter test name');
      return;
    }
    setTests([...tests, {...newTest}]);
    setNewTest({testName: '', instructions: ''});
  };

  const removeTest = index => {
    setTests(tests.filter((_, i) => i !== index));
  };

  const handleCreateVisit = async () => {
    if (!chiefComplaint) {
      Alert.alert('Error', 'Chief complaint is required');
      return;
    }

    setLoading(true);
    try {
      const visitData = {
        patientId,
        chiefComplaint,
        presentIllness,
        clinicalNotes,
        medicines,
        tests,
      };

      // Add follow-up if date is provided
      if (followUpDate) {
        visitData.followUp = {
          scheduledDate: followUpDate,
          notes: followUpNotes,
        };
      }

      const response = await api.post('/visits', visitData);

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Visit created successfully',
          [
            {
              text: 'View Visit',
              onPress: () => {
                navigation.replace('VisitDetail', {
                  visitId: response.data.data.id,
                });
              },
            },
            {
              text: 'Back to Patient',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create visit',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Visit Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visit Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Chief Complaint *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What is the main problem?"
              multiline
              numberOfLines={3}
              value={chiefComplaint}
              onChangeText={setChiefComplaint}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Present Illness</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Details about current illness"
              multiline
              numberOfLines={3}
              value={presentIllness}
              onChangeText={setPresentIllness}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Clinical Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Examination findings, vitals, etc."
              multiline
              numberOfLines={4}
              value={clinicalNotes}
              onChangeText={setClinicalNotes}
            />
          </View>
        </View>

        {/* Medicines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prescription</Text>
          
          {medicines.map((medicine, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{medicine.medicineName}</Text>
                <TouchableOpacity onPress={() => removeMedicine(index)}>
                  <Icon name="close-circle" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
              <Text style={styles.itemDetail}>
                {medicine.dosage} • {medicine.frequency} • {medicine.duration}
              </Text>
              {medicine.instructions && (
                <Text style={styles.itemInstructions}>{medicine.instructions}</Text>
              )}
            </View>
          ))}

          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.input}
              placeholder="Medicine name *"
              value={newMedicine.medicineName}
              onChangeText={text =>
                setNewMedicine({...newMedicine, medicineName: text})
              }
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Dosage *"
                value={newMedicine.dosage}
                onChangeText={text =>
                  setNewMedicine({...newMedicine, dosage: text})
                }
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Frequency"
                value={newMedicine.frequency}
                onChangeText={text =>
                  setNewMedicine({...newMedicine, frequency: text})
                }
              />
            </View>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Duration"
                value={newMedicine.duration}
                onChangeText={text =>
                  setNewMedicine({...newMedicine, duration: text})
                }
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Instructions"
                value={newMedicine.instructions}
                onChangeText={text =>
                  setNewMedicine({...newMedicine, instructions: text})
                }
              />
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addMedicine}>
              <Icon name="plus" size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Add Medicine</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tests/Investigations</Text>
          
          {tests.map((test, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{test.testName}</Text>
                <TouchableOpacity onPress={() => removeTest(index)}>
                  <Icon name="close-circle" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
              {test.instructions && (
                <Text style={styles.itemInstructions}>{test.instructions}</Text>
              )}
            </View>
          ))}

          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.input}
              placeholder="Test name *"
              value={newTest.testName}
              onChangeText={text => setNewTest({...newTest, testName: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Instructions (optional)"
              value={newTest.instructions}
              onChangeText={text =>
                setNewTest({...newTest, instructions: text})
              }
            />
            <TouchableOpacity style={styles.addButton} onPress={addTest}>
              <Icon name="plus" size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Add Test</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Follow-up */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow-up (Optional)</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Follow-up Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD (e.g., 2026-01-15)"
              value={followUpDate}
              onChangeText={setFollowUpDate}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Follow-up Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notes for follow-up"
              multiline
              numberOfLines={2}
              value={followUpNotes}
              onChangeText={setFollowUpNotes}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleCreateVisit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="check" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Create Visit</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  itemDetail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  itemInstructions: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  addItemContainer: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default CreateVisitScreen;
