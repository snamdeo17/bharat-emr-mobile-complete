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
import {Picker} from '@react-native-picker/picker';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {colors} from '../../config/theme';
import {useAuth} from '../../context/AuthContext';
import api from '../../config/api';

const PatientSchema = Yup.object().shape({
  fullName: Yup.string().min(2).required('Name is required'),
  gender: Yup.string().required('Gender is required'),
  age: Yup.number().min(0).max(150).required('Age is required'),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid mobile number')
    .required('Mobile number is required'),
  email: Yup.string().email('Invalid email'),
  address: Yup.string(),
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add New Patient</Text>
        <Text style={styles.subtitle}>
          Enter patient details to create a new record
        </Text>

        <Formik
          initialValues={{
            fullName: '',
            gender: '',
            age: '',
            mobileNumber: '',
            email: '',
            address: '',
          }}
          validationSchema={PatientSchema}
          onSubmit={handleSubmit}>
          {({handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue}) => (
            <View>
              <InputField
                label="Full Name *"
                placeholder="Enter patient name"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                error={touched.fullName && errors.fullName}
              />

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.gender}
                    onValueChange={value => setFieldValue('gender', value)}>
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
                {touched.gender && errors.gender && (
                  <Text style={styles.errorText}>{errors.gender}</Text>
                )}
              </View>

              <InputField
                label="Age *"
                placeholder="Enter age"
                keyboardType="number-pad"
                value={values.age}
                onChangeText={handleChange('age')}
                onBlur={handleBlur('age')}
                error={touched.age && errors.age}
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

              <InputField
                label="Address (Optional)"
                placeholder="Enter address"
                multiline
                numberOfLines={3}
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                error={touched.address && errors.address}
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
      </View>
    </ScrollView>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
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
    marginTop: 20,
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
