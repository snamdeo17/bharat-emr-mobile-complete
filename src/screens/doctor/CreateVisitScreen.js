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
import api from '../../config/api';

const CreateVisitScreen = ({navigation, route}) => {
  const {patient} = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    presentIllness: '',
    clinicalNotes: '',
    diagnosis: '',
    medicines: [],
    tests: [],
    followUpNotes: '',
    followUpDate: '',
  });

  const [currentMedicine, setCurrentMedicine] = useState({
    medicineName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });

  const [currentTest, setCurrentTest] = useState({
    testName: '',
    instructions: '',
  });

  const addMedicine = () => {
    if (!currentMedicine.medicineName || !currentMedicine.dosage) {
      Alert.alert('Error', 'Please enter medicine name and dosage');
      return;
    }

    setFormData({
      ...formData,
      medicines: [...formData.medicines, currentMedicine],
    });

    setCurrentMedicine({
      medicineName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    });
  };

  const removeMedicine = index => {
    const updated = formData.medicines.filter((_, i) => i !== index);
    setFormData({...formData, medicines: updated});
  };

  const addTest = () => {
    if (!currentTest.testName) {
      Alert.alert('Error', 'Please enter test name');
      return;
    }

    setFormData({
      ...formData,
      tests: [...formData.tests, currentTest],
    });

    setCurrentTest({
      testName: '',
      instructions: '',
    });
  };

  const removeTest = index => {
    const updated = formData.tests.filter((_, i) => i !== index);
    setFormData({...formData, tests: updated});
  };

  const handleCreateVisit = async () => {
    if (!formData.chiefComplaint) {
      Alert.alert('Error', 'Please enter chief complaint');
      return;
    }

    setLoading(true);
    try {
      const visitData = {
        patientId: patient.id,
        chiefComplaint: formData.chiefComplaint,
        presentIllness: formData.presentIllness,
        clinicalNotes: formData.clinicalNotes,
        diagnosis: formData.diagnosis,
        medicines: formData.medicines,
        tests: formData.tests,
      };

      // Add follow-up if provided
      if (formData.followUpDate) {
        visitData.followUp = {
          scheduledDate: new Date(formData.followUpDate).toISOString(),
          notes: formData.followUpNotes,
        };
      }

      const response = await api.post('/visits', visitData);

      if (response.data.success) {
        Alert.alert('Success', 'Visit created successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
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
      <ScrollView style={styles.scrollView}>
        {/* Patient Info */}
        <View style={styles.patientBanner}>
          <Icon name="account" size={32} color={colors.primary} />
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{patient.fullName}</Text>
            <Text style={styles.patientDetails}>
              {patient.gender} | {patient.age} years | {patient.patientId}
            </Text>
          </View>
        </View>

        {/* Visit Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visit Details</Text>

          <Text style={styles.label}>Chief Complaint *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Main reason for visit"
            multiline
            numberOfLines={2}
            value={formData.chiefComplaint}
            onChangeText={text =>
              setFormData({...formData, chiefComplaint: text})
            }
          />

          <Text style={styles.label}>History of Present Illness</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detailed history"
            multiline
            numberOfLines={3}
            value={formData.presentIllness}
            onChangeText={text =>
              setFormData({...formData, presentIllness: text})
            }
          />

          <Text style={styles.label}>Clinical Examination</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Vitals, physical examination findings"
            multiline
            numberOfLines={3}
            value={formData.clinicalNotes}
            onChangeText={text =>
              setFormData({...formData, clinicalNotes: text})
            }
          />

          <Text style={styles.label}>Diagnosis</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter diagnosis"
            value={formData.diagnosis}
            onChangeText={text => setFormData({...formData, diagnosis: text})}
          />
        </View>

        {/* Prescription - Medicines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prescription</Text>

          {/* Medicine List */}
          {formData.medicines.map((med, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{med.medicineName}</Text>
                <TouchableOpacity onPress={() => removeMedicine(index)}>
                  <Icon name="close" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
              <Text style={styles.itemDetail}>
                {med.dosage} | {med.frequency} | {med.duration}
              </Text>
              {med.instructions && (
                <Text style={styles.itemInstructions}>{med.instructions}</Text>
              )}
            </View>
          ))}

          {/* Add Medicine Form */}
          <View style={styles.addForm}>
            <Text style={styles.addFormTitle}>Add Medicine</Text>

            <TextInput
              style={styles.input}
              placeholder="Medicine Name *"
              value={currentMedicine.medicineName}
              onChangeText={text =>
                setCurrentMedicine({...currentMedicine, medicineName: text})
              }
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Dosage *"
                value={currentMedicine.dosage}
                onChangeText={text =>
                  setCurrentMedicine({...currentMedicine, dosage: text})
                }
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Frequency"
                value={currentMedicine.frequency}
                onChangeText={text =>
                  setCurrentMedicine({...currentMedicine, frequency: text})
                }
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Duration (e.g., 7 days)"
              value={currentMedicine.duration}
              onChangeText={text =>
                setCurrentMedicine({...currentMedicine, duration: text})
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Instructions"
              value={currentMedicine.instructions}
              onChangeText={text =>
                setCurrentMedicine({...currentMedicine, instructions: text})
              }
            />

            <TouchableOpacity style={styles.addButton} onPress={addMedicine}>
              <Icon name="plus" size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Add Medicine</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investigations</Text>

          {/* Test List */}
          {formData.tests.map((test, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{test.testName}</Text>
                <TouchableOpacity onPress={() => removeTest(index)}>
                  <Icon name="close" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
              {test.instructions && (
                <Text style={styles.itemInstructions}>{test.instructions}</Text>
              )}
            </View>
          ))}

          {/* Add Test Form */}
          <View style={styles.addForm}>
            <Text style={styles.addFormTitle}>Add Test</Text>

            <TextInput
              style={styles.input}
              placeholder="Test Name *"
              value={currentTest.testName}
              onChangeText={text =>
                setCurrentTest({...currentTest, testName: text})
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Instructions (optional)"
              value={currentTest.instructions}
              onChangeText={text =>
                setCurrentTest({...currentTest, instructions: text})
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

          <Text style={styles.label}>Follow-up Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD HH:MM"
            value={formData.followUpDate}
            onChangeText={text =>
              setFormData({...formData, followUpDate: text})
            }
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.input}
            placeholder="Follow-up notes"
            value={formData.followUpNotes}
            onChangeText={text =>
              setFormData({...formData, followUpNotes: text})
            }
          />
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
              <Icon name="content-save" size={20} color="#fff" />
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
  scrollView: {
    flex: 1,
  },
  patientBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  patientInfo: {
    marginLeft: 12,
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  patientDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#fff',
  },
  textArea: {
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
  itemCard: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  itemDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  itemInstructions: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  addForm: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  addFormTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
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
