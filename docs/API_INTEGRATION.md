# 🔌 API Integration Guide - Bharat EMR Mobile App

Complete guide for integrating with the Bharat EMR backend API.

---

## 🔗 Backend Repository

**Backend API:** [bharat-emr-backend-complete](https://github.com/snamdeo17/bharat-emr-backend-complete)

---

## ⚙️ API Configuration

### **Base URL Setup**

Location: `src/config/api.js`

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8080/api' // Development
  : 'https://api.bharatemr.com/api'; // Production

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### **Request Interceptor**

Automatically adds JWT token to requests:

```javascript
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);
```

### **Response Interceptor**

Handles token expiration:

```javascript
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired - clear storage and redirect to login
      await AsyncStorage.clear();
    }
    return Promise.reject(error);
  },
);
```

---

## 📝 API Endpoints

### **Authentication**

#### **Send OTP**
```javascript
POST /api/otp/send

Body:
{
  "mobileNumber": "+919876543210",
  "purpose": "LOGIN" // or "REGISTRATION"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully",
  "data": "123456" // Only in dev mode
}
```

#### **Doctor Login**
```javascript
POST /api/doctors/login

Body:
{
  "mobileNumber": "+919876543210",
  "otp": "123456"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "userId": "DRKUMA1234",
    "userName": "Dr. Amit Kumar",
    "userType": "DOCTOR"
  }
}
```

#### **Patient Login**
```javascript
POST /api/patients/login

Body:
{
  "mobileNumber": "+919876543211",
  "otp": "123456"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "userId": "PATSHA1234",
    "userName": "Rahul Sharma",
    "userType": "PATIENT"
  }
}
```

#### **Doctor Registration**
```javascript
POST /api/doctors/register

Body:
{
  "fullName": "Dr. Amit Kumar",
  "mobileNumber": "+919876543210",
  "email": "amit@example.com",
  "specialization": "Cardiologist",
  "qualification": "MBBS, MD",
  "yearsOfExperience": 10,
  "clinicName": "Kumar Clinic",
  "clinicAddress": "123 MG Road, Delhi",
  "medicalRegistrationNumber": "MCI123456",
  "otp": "123456"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "userId": "DRKUMA1234",
    "userName": "Dr. Amit Kumar",
    "userType": "DOCTOR"
  }
}
```

---

### **Doctor Endpoints**

#### **Get Doctor Profile**
```javascript
GET /api/doctors/profile/{doctorId}
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "doctorId": "DRKUMA1234",
    "fullName": "Dr. Amit Kumar",
    "specialization": "Cardiologist",
    ...
  }
}
```

#### **Get Doctor's Patients**
```javascript
GET /api/doctors/{doctorId}/patients
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "patientId": "PATSHA1234",
      "fullName": "Rahul Sharma",
      "age": 35,
      "gender": "Male",
      ...
    }
  ]
}
```

#### **Add Patient**
```javascript
POST /api/doctors/{doctorId}/patients
Headers: Authorization: Bearer {token}

Body:
{
  "fullName": "Rahul Sharma",
  "age": 35,
  "gender": "Male",
  "mobileNumber": "+919876543211",
  "email": "rahul@example.com",
  "address": "456 Park Street, Mumbai"
}

Response:
{
  "success": true,
  "data": {
    "patientId": "PATSHA1234",
    ...
  }
}
```

---

### **Visit & Prescription**

#### **Create Visit**
```javascript
POST /api/visits
Headers: Authorization: Bearer {token}

Body:
{
  "patientId": "PATSHA1234",
  "chiefComplaint": "Chest pain",
  "presentIllness": "Pain for 2 days",
  "clinicalNotes": "BP: 140/90",
  "medicines": [
    {
      "medicineName": "Aspirin",
      "dosage": "75mg",
      "frequency": "Once daily",
      "duration": "30 days",
      "instructions": "After breakfast"
    }
  ],
  "tests": [
    {
      "testName": "ECG",
      "instructions": "Fasting"
    }
  ],
  "followUp": {
    "scheduledDate": "2026-01-15T10:00:00",
    "notes": "Review ECG results"
  }
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "visitDate": "2026-01-03T20:00:00",
    ...
  }
}
```

#### **Get Visit Details**
```javascript
GET /api/visits/{visitId}
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "patientName": "Rahul Sharma",
    "doctorName": "Dr. Amit Kumar",
    "visitDate": "2026-01-03T20:00:00",
    "chiefComplaint": "Chest pain",
    "medicines": [...],
    "tests": [...]
  }
}
```

#### **Generate Prescription PDF**
```javascript
POST /api/visits/{visitId}/prescription/generate-pdf
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": "https://api.bharatemr.com/prescriptions/prescription_1.pdf"
}
```

#### **Download Prescription PDF**
```javascript
GET /api/visits/{visitId}/prescription/pdf
Headers: Authorization: Bearer {token}

Response: PDF file (binary)
```

---

### **Patient Endpoints**

#### **Get Patient Dashboard**
```javascript
GET /api/patients/dashboard/{patientId}
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "totalVisits": 5,
    "lastVisitDate": "2026-01-03",
    "upcomingFollowUps": 2,
    "recentVisits": [...]
  }
}
```

#### **Get Visit History**
```javascript
GET /api/patients/{patientId}/visits
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "visitDate": "2026-01-03",
      "doctorName": "Dr. Amit Kumar",
      "chiefComplaint": "Chest pain",
      ...
    }
  ]
}
```

---

### **Follow-up Endpoints**

#### **Get Doctor's Follow-ups**
```javascript
GET /api/follow-ups/doctor/{doctorId}
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patientName": "Rahul Sharma",
      "scheduledDate": "2026-01-15T10:00:00",
      "status": "SCHEDULED",
      "notes": "Review ECG"
    }
  ]
}
```

#### **Complete Follow-up**
```javascript
POST /api/follow-ups/{id}/complete
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Follow-up marked as completed"
}
```

---

## 💻 Usage Examples

### **Example 1: Send OTP and Login**

```javascript
import api from '../config/api';

// Send OTP
const sendOTP = async (mobileNumber) => {
  try {
    const response = await api.post('/otp/send', {
      mobileNumber: `+91${mobileNumber}`,
      purpose: 'LOGIN',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to send OTP';
  }
};

// Login
const login = async (mobileNumber, otp, userType) => {
  try {
    const endpoint = userType === 'DOCTOR' ? '/doctors/login' : '/patients/login';
    const response = await api.post(endpoint, {
      mobileNumber: `+91${mobileNumber}`,
      otp,
    });
    
    // Store token
    const {token, userId, userName, userType: type} = response.data.data;
    await AsyncStorage.setItem('jwtToken', token);
    await AsyncStorage.setItem('userId', userId);
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};
```

### **Example 2: Create Visit with Prescription**

```javascript
const createVisit = async (visitData) => {
  try {
    const response = await api.post('/visits', visitData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create visit';
  }
};

// Usage
const handleCreateVisit = async () => {
  const visitData = {
    patientId: 'PATSHA1234',
    chiefComplaint: 'Fever and cough',
    medicines: [
      {
        medicineName: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '5 days',
      },
    ],
    tests: [
      {testName: 'Complete Blood Count'},
    ],
  };
  
  try {
    const result = await createVisit(visitData);
    console.log('Visit created:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### **Example 3: Download Prescription PDF**

```javascript
import {downloadPDF} from '../utils/pdfHelper';

const downloadPrescription = async (visitId) => {
  try {
    // Generate PDF first
    const response = await api.post(`/visits/${visitId}/prescription/generate-pdf`);
    const pdfUrl = response.data.data;
    
    // Download PDF
    await downloadPDF(pdfUrl, `prescription_${visitId}.pdf`);
  } catch (error) {
    console.error('Error downloading prescription:', error);
  }
};
```

---

## ⚡ Error Handling

### **Standard Error Response**

```javascript
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (dev mode only)"
}
```

### **Common Error Codes**

- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### **Error Handling Example**

```javascript
try {
  const response = await api.post('/endpoint', data);
  return response.data;
} catch (error) {
  if (error.response) {
    // Server responded with error
    const {status, data} = error.response;
    
    if (status === 401) {
      // Handle unauthorized
      await logout();
      navigation.navigate('Login');
    } else if (status === 400) {
      // Handle validation error
      Alert.alert('Validation Error', data.message);
    } else {
      Alert.alert('Error', data.message || 'Something went wrong');
    }
  } else if (error.request) {
    // Network error
    Alert.alert('Network Error', 'Please check your internet connection');
  } else {
    // Other error
    Alert.alert('Error', error.message);
  }
}
```

---

## 🔐 Authentication Flow

1. User enters mobile number
2. App sends OTP request to backend
3. Backend sends OTP via SMS
4. User enters OTP
5. App verifies OTP with backend
6. Backend returns JWT token
7. App stores token in AsyncStorage
8. Token is auto-attached to all subsequent requests
9. On 401 error, app clears token and redirects to login

---

## 📝 Best Practices

1. **Always use try-catch** for API calls
2. **Show loading states** during requests
3. **Handle network errors** gracefully
4. **Validate data** before sending
5. **Clear sensitive data** on logout
6. **Use request timeouts** (30 seconds)
7. **Cache data** when appropriate
8. **Retry failed requests** (with exponential backoff)

---

## 📞 Support

For API issues:
- Backend Repo: [bharat-emr-backend-complete](https://github.com/snamdeo17/bharat-emr-backend-complete)
- Email: support@bharatemr.com

---
