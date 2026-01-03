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
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Picker} from '@react-native-picker/picker';
import {colors} from '../../config/theme';
import {useAuth} from '../../context/AuthContext';
import api from '../../config/api';

const PatientSchema = Yup.object().shape({
  fullName: Yup.string().min(2).required('Full name is required'),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid mobile number')
    .required('Mobile number is required'),
  email: Yup.string().email('Invalid email'),
  age: Yup.number().min(0).max(150).required('Age is required'),
  gender: Yup.string().required('Gender is required'),
  address: Yup.string(),
  bloodGroup: Yup.string(),
  emergencyContact: Yup.string(),
  medicalHistory: Yup.string(),
  allergies: Yup.string(),
});

const AddPatientScreen = ({navigation}) => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAddPatient = async values => {
    setLoading(true);
    try {
      const patientData = {
        ...values,
        mobileNumber: `+91${values.mobileNumber}`,
      };

      const response = await api.post(
        `/doctors/${user.userId}/patients`,
        patientData,
      );

      if (response.data.success) {
        Alert.alert('Success', 'Patient added successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to add patient',
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
        <Formik
          initialValues={{
            fullName: '',
            mobileNumber: '',
            email: '',
            age: '',
            gender: 'Male',
            address: '',
            bloodGroup: '',
            emergencyContact: '',
            medicalHistory: '',
            allergies: '',
          }}
          validationSchema={PatientSchema}
          onSubmit={handleAddPatient}>
          {({handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue}) => (
            <View>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <InputField
                label="Full Name *"
                placeholder="Enter patient's full name"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                error={touched.fullName && errors.fullName}
              />

              <InputField
                label="Mobile Number *"
                placeholder="10 digit number"
                keyboardType="phone-pad"
                maxLength={10}
                value={values.mobileNumber}
                onChangeText={handleChange('mobileNumber')}
                onBlur={handleBlur('mobileNumber')}
                error={touched.mobileNumber && errors.mobileNumber}
              />

              <InputField
                label="Email (Optional)"
                placeholder="patient@example.com"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email}
              />

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <InputField
                    label="Age *"
                    placeholder="Age"
                    keyboardType="number-pad"
                    value={values.age}
                    onChangeText={handleChange('age')}
                    onBlur={handleBlur('age')}
                    error={touched.age && errors.age}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Gender *</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={values.gender}
                      onValueChange={value => setFieldValue('gender', value)}>
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                      <Picker.Item label="Other" value="Other" />
                    </Picker>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Contact Information</Text>

              <InputField
                label="Address"
                placeholder="Full address"
                multiline
                numberOfLines={3}
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
              />

              <InputField
                label="Emergency Contact"
                placeholder="Emergency contact number"
                keyboardType="phone-pad"
                value={values.emergencyContact}
                onChangeText={handleChange('emergencyContact')}
                onBlur={handleBlur('emergencyContact')}
              />

              <Text style={styles.sectionTitle}>Medical Information</Text>

              <InputField
                label="Blood Group"
                placeholder="e.g., A+, B-, O+"
                value={values.bloodGroup}
                onChangeText={handleChange('bloodGroup')}
                onBlur={handleBlur('bloodGroup')}
              />

              <InputField
                label="Medical History"
                placeholder="Any chronic conditions, previous surgeries, etc."
                multiline
                numberOfLines={4}
                value={values.medicalHistory}
                onChangeText={handleChange('medicalHistory')}
                onBlur={handleBlur('medicalHistory')}
              />

              <InputField
                label="Allergies"
                placeholder="Food, drug, or environmental allergies"
                multiline
                numberOfLines={3}
                value={values.allergies}
                onChangeText={handleChange('allergies')}
                onBlur={handleBlur('allergies')}
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Add Patient</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const InputField = ({label, error, ...props}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 16,
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddPatientScreen;
