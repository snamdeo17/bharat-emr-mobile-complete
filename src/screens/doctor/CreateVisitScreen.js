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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import {colors} from '../../config/theme';
import api from '../../config/api';
import {format} from 'date-fns';

const CreateVisitScreen = ({navigation, route}) => {
  const {patient} = route.params;
  const [loading, setLoading] = useState(false);
  
  // Visit Details
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [presentIllness, setPresentIllness] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  
  // Medicines
  const [medicines, setMedicines] = useState([]);
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  
  // Tests
  const [tests, setTests] = useState([]);
  const [showTestForm, setShowTestForm] = useState(false);
  
  // Follow-up
  const [followUpDate, setFollowUpDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [includeFollowUp, setIncludeFollowUp] = useState(false);

  const handleAddMedicine = medicine => {
    setMedicines([...medicines, {...medicine, id: Date.now()}]);
    setShowMedicineForm(false);
  };

  const handleRemoveMedicine = id => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const handleAddTest = test => {
    setTests([...tests, {...test, id: Date.now()}]);
    setShowTestForm(false);
  };

  const handleRemoveTest = id => {
    setTests(tests.filter(t => t.id !== id));
  };

  const handleCreateVisit = async () => {
    if (!chiefComplaint.trim()) {
      Alert.alert('Error', 'Please enter chief complaint');
      return;
    }

    setLoading(true);
    try {
      const visitData = {
        patientId: patient.id,
        chiefComplaint,
        presentIllness,
        clinicalNotes,
        diagnosis,
        advice,
        medicines: medicines.map(m => ({
          medicineName: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          instructions: m.instructions,
        })),
        tests: tests.map(t => ({
          testName: t.name,
          instructions: t.instructions,
        })),
      };

      if (includeFollowUp) {
        visitData.followUp = {
          scheduledDate: followUpDate.toISOString(),
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Patient Info */}
        <View style={styles.patientBanner}>
          <Icon name="account" size={32} color={colors.primary} />
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{patient.fullName}</Text>
            <Text style={styles.patientMeta}>
              {patient.age} yrs | {patient.gender}
            </Text>
          </View>
        </View>

        {/* Chief Complaint */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chief Complaint *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Primary reason for visit"
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
            style={[styles.input, styles.textArea]}
            placeholder="History of present illness"
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
            style={[styles.input, styles.textArea]}
            placeholder="Examination findings, vitals, etc."
            multiline
            numberOfLines={4}
            value={clinicalNotes}
            onChangeText={setClinicalNotes}
          />
        </View>

        {/* Diagnosis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          <TextInput
            style={styles.input}
            placeholder="Provisional or final diagnosis"
            value={diagnosis}
            onChangeText={setDiagnosis}
          />
        </View>

        {/* Medicines */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medicines</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowMedicineForm(true)}>
              <Icon name="plus" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {medicines.map(medicine => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onRemove={() => handleRemoveMedicine(medicine.id)}
            />
          ))}
        </View>

        {/* Tests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Laboratory Tests</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowTestForm(true)}>
              <Icon name="plus" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {tests.map(test => (
            <TestCard
              key={test.id}
              test={test}
              onRemove={() => handleRemoveTest(test.id)}
            />
          ))}
        </View>

        {/* Advice */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advice</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="General advice, lifestyle modifications, etc."
            multiline
            numberOfLines={3}
            value={advice}
            onChangeText={setAdvice}
          />
        </View>

        {/* Follow-up */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIncludeFollowUp(!includeFollowUp)}>
            <Icon
              name={includeFollowUp ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={24}
              color={colors.primary}
            />
            <Text style={styles.checkboxLabel}>Schedule Follow-up</Text>
          </TouchableOpacity>

          {includeFollowUp && (
            <View style={styles.followUpContainer}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}>
                <Icon name="calendar" size={20} color={colors.primary} />
                <Text style={styles.dateText}>
                  {format(followUpDate, 'dd MMM yyyy')}
                </Text>
              </TouchableOpacity>

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Follow-up notes"
                multiline
                numberOfLines={2}
                value={followUpNotes}
                onChangeText={setFollowUpNotes}
              />
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleCreateVisit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Visit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Medicine Form Modal */}
      {showMedicineForm && (
        <MedicineFormModal
          onAdd={handleAddMedicine}
          onClose={() => setShowMedicineForm(false)}
        />
      )}

      {/* Test Form Modal */}
      {showTestForm && (
        <TestFormModal
          onAdd={handleAddTest}
          onClose={() => setShowTestForm(false)}
        />
      )}

      {/* Date Picker */}
      <DatePicker
        modal
        open={showDatePicker}
        date={followUpDate}
        mode="date"
        minimumDate={new Date()}
        onConfirm={date => {
          setFollowUpDate(date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </View>
  );
};

const MedicineCard = ({medicine, onRemove}) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{medicine.name}</Text>
      <TouchableOpacity onPress={onRemove}>
        <Icon name="close" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
    <Text style={styles.cardDetail}>
      {medicine.dosage} | {medicine.frequency} | {medicine.duration}
    </Text>
    {medicine.instructions && (
      <Text style={styles.cardInstructions}>{medicine.instructions}</Text>
    )}
  </View>
);

const TestCard = ({test, onRemove}) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{test.name}</Text>
      <TouchableOpacity onPress={onRemove}>
        <Icon name="close" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
    {test.instructions && (
      <Text style={styles.cardDetail}>{test.instructions}</Text>
    )}
  </View>
);

const MedicineFormModal = ({onAdd, onClose}) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleAdd = () => {
    if (!name || !dosage || !frequency || !duration) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    onAdd({name, dosage, frequency, duration, instructions});
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Medicine</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView>
          <TextInput
            style={styles.modalInput}
            placeholder="Medicine Name *"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Dosage (e.g., 500mg) *"
            value={dosage}
            onChangeText={setDosage}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Frequency (e.g., Twice daily) *"
            value={frequency}
            onChangeText={setFrequency}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Duration (e.g., 7 days) *"
            value={duration}
            onChangeText={setDuration}
          />
          <TextInput
            style={[styles.modalInput, styles.textArea]}
            placeholder="Instructions (e.g., After meals)"
            multiline
            numberOfLines={2}
            value={instructions}
            onChangeText={setInstructions}
          />
        </ScrollView>

        <TouchableOpacity style={styles.modalButton} onPress={handleAdd}>
          <Text style={styles.modalButtonText}>Add Medicine</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TestFormModal = ({onAdd, onClose}) => {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleAdd = () => {
    if (!name) {
      Alert.alert('Error', 'Please enter test name');
      return;
    }
    onAdd({name, instructions});
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Lab Test</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.modalInput}
          placeholder="Test Name *"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.modalInput, styles.textArea]}
          placeholder="Instructions (e.g., Fasting required)"
          multiline
          numberOfLines={2}
          value={instructions}
          onChangeText={setInstructions}
        />

        <TouchableOpacity style={styles.modalButton} onPress={handleAdd}>
          <Text style={styles.modalButtonText}>Add Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  patientBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
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
  patientMeta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
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
    fontWeight: '600',
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
    color: colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  cardDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  cardInstructions: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
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
  followUpContainer: {
    marginTop: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateVisitScreen;
