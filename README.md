# 📱 Bharat EMR - Mobile Application

**Electronic Medical Records System for Indian Healthcare Providers**

A complete React Native mobile application for doctors and patients to manage medical records, prescriptions, and appointments.

---

## 🎯 **Features**

### **For Doctors**
- ✅ OTP-based secure registration and login
- ✅ Complete patient onboarding
- ✅ Create visits with detailed prescriptions
- ✅ Add medicines with dosage and instructions
- ✅ Recommend tests and investigations
- ✅ Schedule follow-up appointments
- ✅ Generate and share PDF prescriptions
- ✅ View patient history
- ✅ Dashboard with statistics

### **For Patients**
- ✅ OTP-based secure login
- ✅ View all visits and medical history
- ✅ Access prescriptions anytime
- ✅ Download and share prescription PDFs
- ✅ View upcoming follow-ups
- ✅ Track medications and tests
- ✅ Update personal information

---

## 🚀 **Tech Stack**

- **Framework:** React Native 0.73
- **Navigation:** React Navigation 6
- **UI Library:** React Native Paper
- **State Management:** React Context API
- **Forms:** Formik + Yup
- **HTTP Client:** Axios
- **Storage:** AsyncStorage
- **Icons:** React Native Vector Icons
- **PDF:** React Native PDF
- **Date Utilities:** date-fns

---

## 📋 **Prerequisites**

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **React Native CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - Mac only)
- **JDK 11** or higher

---

## 🛠️ **Installation**

### **1. Clone the Repository**
```bash
git clone https://github.com/snamdeo17/bharat-emr-mobile-complete.git
cd bharat-emr-mobile-complete
```

### **2. Install Dependencies**
```bash
npm install
# or
yarn install
```

### **3. Install iOS Dependencies (Mac only)**
```bash
cd ios
pod install
cd ..
```

### **4. Configure Backend URL**

Edit `src/config/api.js` and update the API base URL:

```javascript
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8080/api' // Android emulator
  : 'https://your-backend-url.com/api'; // Production
```

**For iOS Simulator:** Use `http://localhost:8080/api`

### **5. Run the Application**

**For Android:**
```bash
npm run android
# or
yarn android
```

**For iOS (Mac only):**
```bash
npm run ios
# or
yarn ios
```

---

## 📱 **Running on Physical Device**

### **Android**

1. Enable USB Debugging on your device
2. Connect device via USB
3. Run: `adb devices` to verify connection
4. Run: `npm run android`

### **iOS**

1. Open `ios/BharatEMR.xcworkspace` in Xcode
2. Select your device
3. Click Run or press `Cmd + R`

---

## 🏗️ **Project Structure**

```
bharat-emr-mobile-complete/
├── src/
│   ├── App.js                      # Main app component
│   ├── assets/                     # Images, icons, etc.
│   ├── components/
│   │   ├── common/                 # Reusable components
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Card.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── EmptyState.js
│   │   │   └── ErrorBoundary.js
│   │   ├── medicine/               # Medicine components
│   │   │   ├── MedicineInput.js
│   │   │   └── MedicineCard.js
│   │   └── test/                   # Test components
│   │       ├── TestInput.js
│   │       └── TestCard.js
│   ├── config/
│   │   ├── api.js                  # API configuration
│   │   └── theme.js                # App theme
│   ├── context/
│   │   └── AuthContext.js          # Authentication state
│   ├── navigation/
│   │   ├── AppNavigator.js         # Main navigation
│   │   ├── DoctorNavigator.js      # Doctor tabs
│   │   └── PatientNavigator.js     # Patient tabs
│   ├── screens/
│   │   ├── auth/                   # Authentication screens
│   │   │   ├── WelcomeScreen.js
│   │   │   ├── LoginScreen.js
│   │   │   ├── OTPVerificationScreen.js
│   │   │   └── DoctorRegistrationScreen.js
│   │   ├── doctor/                 # Doctor screens
│   │   │   ├── DoctorDashboardScreen.js
│   │   │   ├── PatientListScreen.js
│   │   │   ├── AddPatientScreen.js
│   │   │   ├── PatientDetailScreen.js
│   │   │   ├── CreateVisitScreen.js
│   │   │   ├── VisitDetailScreen.js
│   │   │   ├── FollowUpListScreen.js
│   │   │   └── ProfileScreen.js
│   │   └── patient/                # Patient screens
│   │       ├── PatientDashboardScreen.js
│   │       ├── VisitHistoryScreen.js
│   │       ├── PrescriptionViewScreen.js
│   │       └── PatientProfileScreen.js
│   └── utils/
│       ├── dateUtils.js            # Date utilities
│       ├── validators.js           # Form validators
│       ├── constants.js            # App constants
│       └── pdfHelper.js            # PDF utilities
├── android/                        # Android native code
├── ios/                            # iOS native code
├── package.json
└── README.md
```

---

## 🔧 **Configuration**

### **Environment Variables**

Create a `.env` file in the root directory (optional):

```env
API_BASE_URL=http://your-backend-url.com/api
ENVIRONMENT=development
```

### **Android Configuration**

**Enable Clear Text Traffic** (for development):

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<application
  android:usesCleartextTraffic="true"
  ...
>
```

### **iOS Configuration**

**Allow HTTP Requests** (for development):

Edit `ios/BharatEMR/Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

---

## 🧪 **Testing**

### **Run Tests**
```bash
npm test
# or
yarn test
```

### **Run Tests with Coverage**
```bash
npm test -- --coverage
```

### **Test Credentials**

For development/testing:

**Doctor:**
- Mobile: +919876543210
- OTP: 123456 (in dev mode)

**Patient:**
- Mobile: +919876543211
- OTP: 123456 (in dev mode)

---

## 📦 **Building for Production**

### **Android APK**

```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

### **Android App Bundle (AAB)**

```bash
cd android
./gradlew bundleRelease
```

AAB location: `android/app/build/outputs/bundle/release/app-release.aab`

### **iOS IPA**

1. Open Xcode
2. Select "Any iOS Device"
3. Product → Archive
4. Distribute App

---

## 🚀 **Deployment**

### **Google Play Store**

1. Create a keystore for signing
2. Configure `android/app/build.gradle`
3. Build AAB: `cd android && ./gradlew bundleRelease`
4. Upload to Google Play Console

### **Apple App Store**

1. Configure signing in Xcode
2. Archive the app
3. Upload via Xcode or Transporter
4. Submit for review in App Store Connect

---

## 🐛 **Troubleshooting**

### **Common Issues**

**1. Metro Bundler Port Already in Use**
```bash
npx react-native start --reset-cache
```

**2. Android Build Failed**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**3. iOS Pod Install Failed**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

**4. Network Request Failed**
- Check backend URL in `src/config/api.js`
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For iOS simulator, use `localhost`
- Ensure backend server is running

**5. Clear Cache**
```bash
npm start -- --reset-cache
# or
watchman watch-del-all
rm -rf node_modules
npm install
```

---

## 📚 **Documentation**

- [Installation Guide](./INSTALLATION.md)
- [API Integration](./docs/API_INTEGRATION.md)
- [Screens Guide](./docs/SCREENS_GUIDE.md)
- [Contributing](./CONTRIBUTING.md)

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 **Team**

- **Developer:** Shivendra Namdeo
- **Email:** support@bharatemr.com
- **GitHub:** [@snamdeo17](https://github.com/snamdeo17)

---

## 🔗 **Related Repositories**

- **Backend API:** [bharat-emr-backend-complete](https://github.com/snamdeo17/bharat-emr-backend-complete)

---

## 📞 **Support**

For support and queries:
- **Email:** support@bharatemr.com
- **Phone:** +91-1800-123-4567
- **Issues:** [GitHub Issues](https://github.com/snamdeo17/bharat-emr-mobile-complete/issues)

---

## ⭐ **Acknowledgments**

- Built with React Native
- Icons by React Native Vector Icons
- UI components by React Native Paper
- Made with ❤️ for Indian Healthcare

---

**Version:** 1.0.0  
**Last Updated:** January 2026

**Built with ❤️ for Indian Healthcare Providers**
