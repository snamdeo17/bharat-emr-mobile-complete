import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {colors} from '../../config/theme';
import api from '../../config/api';

const RegistrationSchema = Yup.object().shape({
  fullName: Yup.string().min(2).required('Full name is required'),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid mobile number')
    .required('Mobile number is required'),
  email: Yup.string().email('Invalid email'),
  specialization: Yup.string().required('Specialization is required'),
  qualification: Yup.string().required('Qualification is required'),
  yearsOfExperience: Yup.number()
    .min(0)
    .max(70)
    .required('Experience is required'),
  clinicName: Yup.string().required('Clinic name is required'),
  clinicAddress: Yup.string().required('Clinic address is required'),
  medicalRegistrationNumber: Yup.string().required(
    'Registration number is required',
  ),
});

const DoctorRegistrationScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleSendOTP = async values => {
    setLoading(true);
    try {
      await api.post('/otp/send', {
        mobileNumber: `+91${values.mobileNumber}`,
        purpose: 'REGISTRATION',
      });

      Alert.alert('Success', 'OTP sent to your mobile number');
      setFormData(values);
      setOtpSent(true);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async otp => {
    setLoading(true);
    try {
      const registrationData = {
        ...formData,
        mobileNumber: `+91${formData.mobileNumber}`,
        otp,
      };

      const response = await api.post('/doctors/register', registrationData);

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Registration successful! Please login.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login', {userType: 'DOCTOR'}),
            },
          ],
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Registration failed',
      );
    } finally {
      setLoading(false);
    }
  };

  if (otpSent) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setOtpSent(false)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.otpContainer}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            OTP sent to +91{formData.mobileNumber}
          </Text>
          <TextInput
            style={styles.otpInput}
            placeholder="Enter 6-digit OTP"
            keyboardType="number-pad"
            maxLength={6}
            onSubmitEditing={e => handleRegister(e.nativeEvent.text)}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Doctor Registration</Text>
        <Text style={styles.subtitle}>
          Register to start managing your patients
        </Text>

        <Formik
          initialValues={{
            fullName: '',
            mobileNumber: '',
            email: '',
            specialization: '',
            qualification: '',
            yearsOfExperience: '',
            clinicName: '',
            clinicAddress: '',
            medicalRegistrationNumber: '',
          }}
          validationSchema={RegistrationSchema}
          onSubmit={handleSendOTP}>
          {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
            <View>
              <InputField
                label="Full Name"
                placeholder="Dr. John Doe"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                error={touched.fullName && errors.fullName}
              />

              <InputField
                label="Mobile Number"
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
                placeholder="doctor@example.com"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email}
              />

              <InputField
                label="Specialization"
                placeholder="e.g., Cardiologist"
                value={values.specialization}
                onChangeText={handleChange('specialization')}
                onBlur={handleBlur('specialization')}
                error={touched.specialization && errors.specialization}
              />

              <InputField
                label="Qualification"
                placeholder="e.g., MBBS, MD"
                value={values.qualification}
                onChangeText={handleChange('qualification')}
                onBlur={handleBlur('qualification')}
                error={touched.qualification && errors.qualification}
              />

              <InputField
                label="Years of Experience"
                placeholder="e.g., 10"
                keyboardType="number-pad"
                value={values.yearsOfExperience}
                onChangeText={handleChange('yearsOfExperience')}
                onBlur={handleBlur('yearsOfExperience')}
                error={touched.yearsOfExperience && errors.yearsOfExperience}
              />

              <InputField
                label="Clinic Name"
                placeholder="Your Clinic Name"
                value={values.clinicName}
                onChangeText={handleChange('clinicName')}
                onBlur={handleBlur('clinicName')}
                error={touched.clinicName && errors.clinicName}
              />

              <InputField
                label="Clinic Address"
                placeholder="Full address"
                multiline
                numberOfLines={3}
                value={values.clinicAddress}
                onChangeText={handleChange('clinicAddress')}
                onBlur={handleBlur('clinicAddress')}
                error={touched.clinicAddress && errors.clinicAddress}
              />

              <InputField
                label="Medical Registration Number"
                placeholder="MCI Registration Number"
                value={values.medicalRegistrationNumber}
                onChangeText={handleChange('medicalRegistrationNumber')}
                onBlur={handleBlur('medicalRegistrationNumber')}
                error={
                  touched.medicalRegistrationNumber &&
                  errors.medicalRegistrationNumber
                }
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const InputField = ({
  label,
  error,
  ...props
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    fontSize: 16,
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 30,
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
    color: colors.text,
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
  otpContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 30,
  },
});

export default DoctorRegistrationScreen;
