// API Endpoints
export const API_ENDPOINTS = {
  // OTP
  SEND_OTP: '/otp/send',
  VERIFY_OTP: '/otp/verify',

  // Doctor
  DOCTOR_REGISTER: '/doctors/register',
  DOCTOR_LOGIN: '/doctors/login',
  DOCTOR_PROFILE: '/doctors/profile',
  DOCTOR_PATIENTS: '/doctors/:id/patients',

  // Patient
  PATIENT_LOGIN: '/patients/login',
  PATIENT_PROFILE: '/patients/profile',
  PATIENT_DASHBOARD: '/patients/dashboard',
  PATIENT_VISITS: '/patients/:id/visits',

  // Visit
  VISITS: '/visits',
  VISIT_BY_ID: '/visits/:id',
  VISITS_BY_DOCTOR: '/visits/doctor/:id',
  VISITS_BY_PATIENT: '/visits/patient/:id',
  PRESCRIPTION_PDF: '/visits/:id/prescription/pdf',
  GENERATE_PDF: '/visits/:id/prescription/generate-pdf',

  // Follow-up
  FOLLOW_UPS: '/follow-ups',
  FOLLOW_UP_BY_ID: '/follow-ups/:id',
  FOLLOW_UPS_BY_DOCTOR: '/follow-ups/doctor/:id',
  FOLLOW_UPS_BY_PATIENT: '/follow-ups/patient/:id',
  TODAYS_FOLLOW_UPS: '/follow-ups/today',
};

// Gender Options
export const GENDER_OPTIONS = [
  {label: 'Male', value: 'Male'},
  {label: 'Female', value: 'Female'},
  {label: 'Other', value: 'Other'},
];

// Blood Group Options
export const BLOOD_GROUP_OPTIONS = [
  {label: 'A+', value: 'A+'},
  {label: 'A-', value: 'A-'},
  {label: 'B+', value: 'B+'},
  {label: 'B-', value: 'B-'},
  {label: 'O+', value: 'O+'},
  {label: 'O-', value: 'O-'},
  {label: 'AB+', value: 'AB+'},
  {label: 'AB-', value: 'AB-'},
];

// Medical Specializations
export const SPECIALIZATIONS = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'ENT Specialist',
  'Gynecologist',
  'Neurologist',
  'Oncologist',
  'Ophthalmologist',
  'Orthopedic',
  'Pediatrician',
  'Psychiatrist',
  'Radiologist',
  'Surgeon',
  'Urologist',
  'Other',
];

// Follow-up Status
export const FOLLOW_UP_STATUS = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  MISSED: 'Missed',
};

// OTP Purpose
export const OTP_PURPOSE = {
  REGISTRATION: 'REGISTRATION',
  LOGIN: 'LOGIN',
  VERIFICATION: 'VERIFICATION',
};

// Common Medicine Frequencies
export const MEDICINE_FREQUENCIES = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'As needed',
  'Before meals',
  'After meals',
  'At bedtime',
];

// Common Medicine Durations
export const MEDICINE_DURATIONS = [
  '3 days',
  '5 days',
  '7 days',
  '10 days',
  '14 days',
  '21 days',
  '30 days',
  '60 days',
  '90 days',
  'Continuous',
];

// Common Tests
export const COMMON_TESTS = [
  'Complete Blood Count (CBC)',
  'Blood Sugar (Fasting)',
  'Blood Sugar (Random)',
  'HbA1c',
  'Lipid Profile',
  'Liver Function Test (LFT)',
  'Kidney Function Test (KFT)',
  'Thyroid Profile',
  'Urine Routine',
  'ECG',
  'Chest X-Ray',
  'Ultrasound',
  'CT Scan',
  'MRI',
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_OTP: 'Invalid OTP. Please check and try again.',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_MOBILE: 'Please enter a valid 10-digit mobile number.',
  INVALID_EMAIL: 'Please enter a valid email address.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  OTP_SENT: 'OTP sent successfully to your mobile number.',
  LOGIN_SUCCESS: 'Login successful!',
  REGISTRATION_SUCCESS: 'Registration successful!',
  PROFILE_UPDATED: 'Profile updated successfully.',
  PATIENT_ADDED: 'Patient added successfully.',
  VISIT_CREATED: 'Visit created successfully.',
  PRESCRIPTION_GENERATED: 'Prescription generated successfully.',
  FOLLOW_UP_SCHEDULED: 'Follow-up scheduled successfully.',
};

// App Info
export const APP_INFO = {
  NAME: 'Bharat EMR',
  VERSION: '1.0.0',
  DESCRIPTION: 'Electronic Medical Records for Indian Healthcare',
  SUPPORT_EMAIL: 'support@bharatemr.com',
  SUPPORT_PHONE: '+91-1800-123-4567',
};
