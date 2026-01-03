import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import {useAuth} from '../../context/AuthContext';
import api from '../../config/api';

const CreateVisitScreen = ({route, navigation}) => {
  const {patient} = route.params;
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    chiefComplaint: '',
    presentIllness: '',
    clinicalNotes: '',
    diagnosis: '',
  });

  const [medicines, setMedicines] = useState([]);
  const [tests, setTests] = useState([]);
  const [followUp, setFollowUp] = useState({enabled: false, notes: ''});

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        id: Date.now(),
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ]);
  };

  const removeMedicine = id => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const updateMedicine = (id, field, value) => {
    setMedicines(
      medicines.map(m => (m.id === id ? {...m, [field]: value} : m)),
    );
  };

  const addTest = () => {
    setTests([
      ...tests,
      {id: Date.now(), testName: '', instructions: ''},
    ]);
  };

  const removeTest = id => {
    setTests(tests.filter(t => t.id !== id));
  };

  const updateTest = (id, field, value) => {
    setTests(tests.map(t => (t.id === id ? {...t, [field]: value} : t)));
  };

  const handleSubmit = async () => {
    if (!formData.chiefComplaint.trim()) {
      Alert.alert('Error', 'Chief complaint is required');
      return;
    }

    setLoading(true);
    try {
      const visitData = {
        patientId: patient.patientId,
        ...formData,
        medicines: medicines.map(({id, ...rest}) => rest),
        tests: tests.map(({id, ...rest}) => rest),
        ...(followUp.enabled && {
          followUp: {
            scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            notes: followUp.notes,
          },
        }),
      };

      const response = await api.post('/visits', visitData);

      if (response.data.success) {
        Alert.alert('Success', 'Visit created successfully', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('PatientList'),
          },
        ]);
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
        {/* Patient Info */}
        <View style={styles.patientCard}>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.patientInfo}>
            {patient.age} yrs • {patient.gender}
          </Text>
        </View>

        {/* Chief Complaint */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chief Complaint *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Main reason for visit"
            multiline
            numberOfLines={3}
            value={formData.chiefComplaint}
            onChangeText={text =>
              setFormData({...formData, chiefComplaint: text})
            }
          />
        </View>

        {/* Present Illness */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History of Present Illness</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Detailed history"
            multiline
            numberOfLines={4}
            value={formData.presentIllness}
            onChangeText={text =>
              setFormData({...formData, presentIllness: text})
            }
          />
        </View>

        {/* Clinical Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clinical Notes</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Examination findings, vitals, etc."
            multiline
            numberOfLines={4}
            value={formData.clinicalNotes}
            onChangeText={text =>
              setFormData({...formData, clinicalNotes: text})
            }
          />
        </View>

        {/* Diagnosis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          <TextInput
            style={styles.input}
            placeholder="Primary diagnosis"
            value={formData.diagnosis}
            onChangeText={text => setFormData({...formData, diagnosis: text})}
          />
        </View>

        {/* Medicines */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Prescription</Text>
            <TouchableOpacity style={styles.addButton} onPress={addMedicine}>
              <Icon name="plus" size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Add Medicine</Text>
            </TouchableOpacity>
          </View>

          {medicines.map((medicine, index) => (
            <View key={medicine.id} style={styles.medicineCard}>
              <View style={styles.medicineHeader}>
                <Text style={styles.medicineIndex}>Medicine {index + 1}</Text>
                <TouchableOpacity onPress={() => removeMedicine(medicine.id)}>
                  <Icon name="close" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Medicine name"
                value={medicine.medicineName}
                onChangeText={text =>
                  updateMedicine(medicine.id, 'medicineName', text)
                }
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Dosage (e.g., 500mg)"
                  value={medicine.dosage}
                  onChangeText={text =>
                    updateMedicine(medicine.id, 'dosage', text)
                  }
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Frequency"
                  value={medicine.frequency}
                  onChangeText={text =>
                    updateMedicine(medicine.id, 'frequency', text)
                  }
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Duration (e.g., 7 days)"
                value={medicine.duration}
                onChangeText={text =>
                  updateMedicine(medicine.id, 'duration', text)
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Instructions (e.g., After food)"
                value={medicine.instructions}
                onChangeText={text =>
                  updateMedicine(medicine.id, 'instructions', text)
                }
              />
            </View>
          ))}
        </View>

        {/* Tests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tests Recommended</Text>
            <TouchableOpacity style={styles.addButton} onPress={addTest}>
              <Icon name="plus" size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Add Test</Text>
            </TouchableOpacity>
          </View>

          {tests.map((test, index) => (
            <View key={test.id} style={styles.testCard}>
              <View style={styles.testHeader}>
                <Text style={styles.testIndex}>Test {index + 1}</Text>
                <TouchableOpacity onPress={() => removeTest(test.id)}>
                  <Icon name="close" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Test name (e.g., CBC, X-Ray)"
                value={test.testName}
                onChangeText={text => updateTest(test.id, 'testName', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Instructions (optional)"
                value={test.instructions}
                onChangeText={text => updateTest(test.id, 'instructions', text)}
              />
            </View>
          ))}
        </View>

        {/* Follow-up */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() =>
              setFollowUp({...followUp, enabled: !followUp.enabled})
            }>
            <Icon
              name={followUp.enabled ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={24}
              color={colors.primary}
            />
            <Text style={styles.checkboxLabel}>Schedule Follow-up</Text>
          </TouchableOpacity>
          {followUp.enabled && (
            <TextInput
              style={styles.input}
              placeholder="Follow-up notes"
              value={followUp.notes}
              onChangeText={text => setFollowUp({...followUp, notes: text})}
            />
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Visit</Text>
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
  patientCard: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  patientInfo: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  medicineCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  medicineIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  testCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  testIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateVisitScreen;
