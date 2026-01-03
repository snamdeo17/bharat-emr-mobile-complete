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
import {colors} from '../../config/theme';
import {useAuth} from '../../context/AuthContext';
import api from '../../config/api';
import {Picker} from '@react-native-picker/picker';

const PatientSchema = Yup.object().shape({
  fullName: Yup.string().min(2).required('Name is required'),
  age: Yup.number().min(0).max(120).required('Age is required'),
  gender: Yup.string().required('Gender is required'),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid mobile number')
    .required('Mobile number is required'),
  email: Yup.string().email('Invalid email'),
  address: Yup.string(),
  bloodGroup: Yup.string(),
  allergies: Yup.string(),
  chronicConditions: Yup.string(),
});

const AddPatientScreen = ({navigation}) => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async values => {
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
            age: '',
            gender: 'Male',
            mobileNumber: '',
            email: '',
            address: '',
            bloodGroup: '',
            allergies: '',
            chronicConditions: '',
          }}
          validationSchema={PatientSchema}
          onSubmit={handleSubmit}>
          {({handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue}) => (
            <View>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <InputField
                label="Full Name *"
                placeholder="Enter patient name"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                error={touched.fullName && errors.fullName}
              />

              <View style={styles.row}>
                <View style={styles.halfInput}>
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
                <View style={styles.halfInput}>
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

              <Text style={styles.label}>Mobile Number *</Text>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="10 digit mobile number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={values.mobileNumber}
                  onChangeText={handleChange('mobileNumber')}
                  onBlur={handleBlur('mobileNumber')}
                />
              </View>
              {touched.mobileNumber && errors.mobileNumber && (
                <Text style={styles.errorText}>{errors.mobileNumber}</Text>
              )}

              <InputField
                label="Email"
                placeholder="email@example.com"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email}
              />

              <InputField
                label="Address"
                placeholder="Full address"
                multiline
                numberOfLines={3}
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
              />

              <Text style={styles.sectionTitle}>Medical Information</Text>

              <InputField
                label="Blood Group"
                placeholder="e.g., O+, A+, B+, AB+"
                value={values.bloodGroup}
                onChangeText={handleChange('bloodGroup')}
                onBlur={handleBlur('bloodGroup')}
              />

              <InputField
                label="Allergies"
                placeholder="Any known allergies"
                multiline
                numberOfLines={3}
                value={values.allergies}
                onChangeText={handleChange('allergies')}
                onBlur={handleBlur('allergies')}
              />

              <InputField
                label="Chronic Conditions"
                placeholder="Any chronic health conditions"
                multiline
                numberOfLines={3}
                value={values.chronicConditions}
                onChangeText={handleChange('chronicConditions')}
                onBlur={handleBlur('chronicConditions')}
              />

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Add Patient</Text>
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
    {label && <Text style={styles.label}>{label}</Text>}
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
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  countryCode: {
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
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

export default AddPatientScreen;
