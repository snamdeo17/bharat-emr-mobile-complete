# 🛠️ Installation Guide - Bharat EMR Mobile App

Complete step-by-step installation guide for setting up the Bharat EMR mobile application.

---

## 📊 System Requirements

### **Minimum Requirements**
- **OS:** Windows 10, macOS 10.15+, or Linux
- **RAM:** 8GB (16GB recommended)
- **Storage:** 10GB free space
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher

### **For Android Development**
- **Android Studio:** 2022.1.1 or later
- **JDK:** 11 or higher
- **Android SDK:** API Level 31+
- **Emulator or Physical Device:** Android 8.0+

### **For iOS Development (Mac Only)**
- **Xcode:** 14.0 or later
- **CocoaPods:** 1.11.0 or later
- **iOS Simulator or Device:** iOS 13.0+

---

## 💻 Step 1: Install Node.js

### **Windows & Mac**

1. Download from [nodejs.org](https://nodejs.org/)
2. Install the LTS version
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### **Linux (Ubuntu/Debian)**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## 🤖 Step 2: Install React Native CLI

```bash
npm install -g react-native-cli
```

Verify:
```bash
react-native --version
```

---

## 🟢 Step 3: Android Setup

### **Install Android Studio**

1. Download from [developer.android.com/studio](https://developer.android.com/studio)
2. Install Android Studio
3. During installation, ensure these are checked:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device

### **Configure Android SDK**

1. Open Android Studio
2. Go to **Preferences** → **Appearance & Behavior** → **System Settings** → **Android SDK**
3. Install:
   - Android 12.0 (API Level 31)
   - Android 13.0 (API Level 33)
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools

### **Set Environment Variables**

**Windows:**
```cmd
setx ANDROID_HOME "C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools"
```

**Mac/Linux:**

Add to `~/.bashrc` or `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Reload:
```bash
source ~/.bashrc  # or ~/.zshrc
```

Verify:
```bash
adb --version
```

### **Create Android Emulator**

1. Open Android Studio
2. Go to **Tools** → **AVD Manager**
3. Click **Create Virtual Device**
4. Select a device (e.g., Pixel 5)
5. Select system image (Android 12 or 13)
6. Click **Finish**

---

## 🍎 Step 4: iOS Setup (Mac Only)

### **Install Xcode**

1. Download from Mac App Store
2. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```

### **Install CocoaPods**

```bash
sudo gem install cocoapods
```

Verify:
```bash
pod --version
```

### **Accept Xcode License**

```bash
sudo xcodebuild -license accept
```

---

## 📦 Step 5: Clone and Setup Project

### **Clone Repository**

```bash
git clone https://github.com/snamdeo17/bharat-emr-mobile-complete.git
cd bharat-emr-mobile-complete
```

### **Install Dependencies**

```bash
npm install
# or
yarn install
```

### **Install iOS Pods (Mac Only)**

```bash
cd ios
pod install
cd ..
```

---

## ⚙️ Step 6: Configure Backend URL

### **Update API Configuration**

Edit `src/config/api.js`:

```javascript
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8080/api' // For Android Emulator
  // ? 'http://localhost:8080/api' // For iOS Simulator
  : 'https://your-production-backend.com/api';
```

**Important:**
- **Android Emulator:** Use `10.0.2.2` to access host machine's localhost
- **iOS Simulator:** Use `localhost` or your machine's IP
- **Physical Device:** Use your machine's local IP (e.g., `192.168.1.100`)

### **Find Your Local IP**

**Mac/Linux:**
```bash
ifconfig | grep "inet "
```

**Windows:**
```cmd
ipconfig
```

---

## 🏃 Step 7: Run the Application

### **Start Metro Bundler**

In one terminal:
```bash
npm start
# or
yarn start
```

### **Run on Android**

In another terminal:
```bash
npm run android
# or
yarn android
```

### **Run on iOS (Mac Only)**

```bash
npm run ios
# or
yarn ios
```

---

## 📱 Step 8: Run on Physical Device

### **Android Physical Device**

1. **Enable Developer Options:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times

2. **Enable USB Debugging:**
   - Settings → Developer Options → Enable USB Debugging

3. **Connect Device:**
   ```bash
   adb devices
   ```
   You should see your device listed

4. **Run App:**
   ```bash
   npm run android
   ```

### **iOS Physical Device (Mac Only)**

1. **Connect iPhone via USB**

2. **Open in Xcode:**
   ```bash
   open ios/BharatEMR.xcworkspace
   ```

3. **Configure Signing:**
   - Select project in Xcode
   - Go to Signing & Capabilities
   - Select your Team
   - Choose Automatic signing

4. **Select Device:**
   - In Xcode, select your connected iPhone
   - Click Run (or press Cmd + R)

5. **Trust Developer:**
   - On iPhone: Settings → General → Device Management
   - Trust the developer certificate

---

## ✅ Step 9: Verify Installation

### **Check if App is Running**

1. App should open on emulator/device
2. You should see the Welcome screen
3. Test OTP login flow

### **Test Backend Connection**

1. Click "I'm a Doctor" or "I'm a Patient"
2. Enter mobile number
3. Click "Send OTP"
4. If successful, you should receive OTP (check backend logs in dev mode)

---

## 🐛 Common Installation Issues

### **Issue 1: Metro Bundler Won't Start**

```bash
npx react-native start --reset-cache
```

### **Issue 2: Android Build Failed**

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### **Issue 3: iOS Pod Install Failed**

```bash
cd ios
rm -rf Pods Podfile.lock
pod cache clean --all
pod install
cd ..
```

### **Issue 4: "Command not found: adb"**

Ensure ANDROID_HOME is set correctly and added to PATH.

### **Issue 5: "Unable to load script from assets"**

```bash
npx react-native start --reset-cache
# In another terminal
npm run android
```

### **Issue 6: Network Request Failed**

- Check backend is running
- Verify API_BASE_URL in `src/config/api.js`
- For Android emulator, use `10.0.2.2` instead of `localhost`
- Disable firewall or add exception

### **Issue 7: "spawnSync ./gradlew EACCES"**

```bash
cd android
chmod +x gradlew
cd ..
```

---

## 🛡️ Security Configuration

### **Android Network Security (Development)**

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<application
  android:usesCleartextTraffic="true"
  ...
>
```

### **iOS App Transport Security (Development)**

Edit `ios/BharatEMR/Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

**Note:** Remove these in production!

---

## 🚀 Next Steps

1. ✅ Install dependencies
2. ✅ Configure backend URL
3. ✅ Run the app
4. 📖 Read [API Integration Guide](./docs/API_INTEGRATION.md)
5. 📖 Check [Screens Guide](./docs/SCREENS_GUIDE.md)
6. 👨‍💻 Start development!

---

## 📞 Support

If you encounter any issues:

- **GitHub Issues:** [Report Issue](https://github.com/snamdeo17/bharat-emr-mobile-complete/issues)
- **Email:** support@bharatemr.com
- **Documentation:** Check README.md

---

**Happy Coding! 🎉**
