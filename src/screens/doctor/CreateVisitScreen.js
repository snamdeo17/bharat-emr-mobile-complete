import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import {useAuth} from '../../context/AuthContext';
import api from '../../config/api';

const CreateVisitScreen = ({navigation, route}) => {
  const {patient} = route.params;
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [presentIllness, setPresentIllness] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  
  const [medicines, setMedicines] = useState([]);
  const [tests, setTests] = useState([]);
  
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ]);
  };

  const removeMedicine = index => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const addTest = () => {
    setTests([...tests, {testName: '', instructions: ''}]);
  };

  const removeTest = index => {
    const updated = tests.filter((_, i) => i !== index);
    setTests(updated);
  };

  const updateTest = (index, field, value) => {
    const updated = [...tests];
    updated[index][field] = value;
    setTests(updated);
  };

  const handleSubmit = async () => {
    if (!chiefComplaint.trim()) {
      Alert.alert('Error', 'Please enter chief complaint');
      return;
    }

    setLoading(true);
    try {
      const visitData = {
        patientId: patient.patientId,
        chiefComplaint,
        presentIllness,
        clinicalNotes,
        medicines: medicines.filter(m => m.medicineName.trim() !== ''),
        tests: tests.filter(t => t.testName.trim() !== ''),
      };

      if (followUpDate) {
        visitData.followUp = {
          scheduledDate: followUpDate,
          notes: followUpNotes,
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Patient Info */}
        <View style={styles.patientCard}>
          <Icon name="account" size={24} color={colors.primary} />
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{patient.fullName}</Text>
            <Text style={styles.patientDetails}>
              {patient.gender}, {patient.age} years
            </Text>
          </View>
        </View>

        {/* Chief Complaint */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chief Complaint *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter patient's main complaint"
            multiline
            numberOfLines={3}
            value={chiefComplaint}
            onChangeText={setChiefComplaint}
          />
        </View>

        {/* Present Illness */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Present Illness</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Detailed history of present illness"
            multiline
            numberOfLines={4}
            value={presentIllness}
            onChangeText={setPresentIllness}
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
            value={clinicalNotes}
            onChangeText={setClinicalNotes}
          />
        </View>

        {/* Medicines */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medicines</Text>
            <TouchableOpacity style={styles.addButton} onPress={addMedicine}>
              <Icon name="plus" size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {medicines.map((medicine, index) => (
            <View key={index} style={styles.medicineCard}>
              <View style={styles.medicineHeader}>
                <Text style={styles.medicineNumber}>Medicine {index + 1}</Text>
                <TouchableOpacity onPress={() => removeMedicine(index)}>
                  <Icon name="delete" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Medicine name"
                value={medicine.medicineName}
                onChangeText={text => updateMedicine(index, 'medicineName', text)}
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Dosage (e.g., 500mg)"
                  value={medicine.dosage}
                  onChangeText={text => updateMedicine(index, 'dosage', text)}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Frequency"
                  value={medicine.frequency}
                  onChangeText={text => updateMedicine(index, 'frequency', text)}
                />
              </View>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Duration (e.g., 7 days)"
                  value={medicine.duration}
                  onChangeText={text => updateMedicine(index, 'duration', text)}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Timing"
                  value={medicine.instructions}
                  onChangeText={text => updateMedicine(index, 'instructions', text)}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Tests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tests/Investigations</Text>
            <TouchableOpacity style={styles.addButton} onPress={addTest}>
              <Icon name="plus" size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {tests.map((test, index) => (
            <View key={index} style={styles.testCard}>
              <View style={styles.medicineHeader}>
                <Text style={styles.medicineNumber}>Test {index + 1}</Text>
                <TouchableOpacity onPress={() => removeTest(index)}>
                  <Icon name="delete" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Test name"
                value={test.testName}
                onChangeText={text => updateTest(index, 'testName', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Instructions (e.g., Fasting required)"
                value={test.instructions}
                onChangeText={text => updateTest(index, 'instructions', text)}
              />
            </View>
          ))}
        </View>

        {/* Follow-up */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow-up (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Follow-up date (YYYY-MM-DD)"
            value={followUpDate}
            onChangeText={setFollowUpDate}
          />
          <TextInput
            style={styles.textArea}
            placeholder="Follow-up notes"
            multiline
            numberOfLines={2}
            value={followUpNotes}
            onChangeText={setFollowUpNotes}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="check-circle" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Create Visit</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  patientInfo: {
    marginLeft: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  patientDetails: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 20,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  medicineCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  testCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicineNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default CreateVisitScreen;
