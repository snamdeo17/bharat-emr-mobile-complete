# 🚀 Complete Setup Guide - Bharat EMR Mobile App

**After cloning the repository with Android/iOS native folders included**

---

## ✅ What's Already Included

The repository now includes:
- ✅ Complete Android native configuration
- ✅ Complete iOS native configuration  
- ✅ All React Native source code
- ✅ Build configuration files
- ✅ Gradle wrapper and dependencies

---

## 📥 Step 1: Pull Latest Changes

If you already cloned the repo, pull the latest changes:

```powershell
cd E:\workspace\bharat-emr-mobile-complete
git pull origin main
```

**OR** if starting fresh:

```powershell
cd E:\workspace
rmdir /s /q bharat-emr-mobile-complete
git clone https://github.com/snamdeo17/bharat-emr-mobile-complete.git
cd bharat-emr-mobile-complete
```

---

## 📦 Step 2: Install Dependencies

```powershell
npm install
```

This will install all required packages (takes 3-5 minutes).

---

## ⚙️ Step 3: Configure Backend URL

### **Find Your Computer's IP Address**

```powershell
ipconfig
```

Look for **IPv4 Address** under your active network adapter (e.g., `192.168.1.100`)

### **Update API Configuration**

Edit `src/config/api.js` and replace the IP address:

```javascript
const API_BASE_URL = __DEV__
  ? 'http://192.168.1.100:8080/api' // 👈 Your computer's IP here
  : 'https://your-production-backend.com/api';
```

⚠️ **Important:** 
- Don't use `localhost` or `127.0.0.1`
- Use your actual computer's IP address
- Ensure phone and computer are on same WiFi

---

## 📱 Step 4: Connect Your Android Device

### **Enable Developer Options**
1. Go to **Settings → About Phone**
2. Tap **Build Number** 7 times
3. You'll see "You are now a developer!"

### **Enable USB Debugging**
1. Go to **Settings → Developer Options**
2. Enable **USB Debugging**
3. Enable **Install via USB**

### **Connect via USB**
1. Connect phone to computer using USB cable
2. On phone, tap **Allow** when prompted
3. Check **Always allow from this computer**

### **Verify Connection**

```powershell
adb devices
```

Should show:
```
List of devices attached
ABC123XYZ    device
```

---

## 🚀 Step 5: Run the App

### **Option 1: Two Terminal Windows (Recommended)**

**Terminal 1 - Start Metro:**
```powershell
npm start
```

Wait for:
```
 Welcome to Metro!
  Fast - Scalable - Integrated
```

**Terminal 2 - Build and Install:**
```powershell
npm run android
```

### **Option 2: Single Command**

```powershell
npx react-native run-android
```

---

## ⏱️ What to Expect

### **First Time Build (10-15 minutes)**

1. **Gradle downloads dependencies** (5-8 min)
   ```
   > Task :app:downloadReleaseJavaScriptBundle
   > Task :app:compileDebugJavaWithJavac
   ```

2. **Build Android APK** (3-5 min)
   ```
   > Task :app:packageDebug
   > Task :app:assembleDebug
   ```

3. **Install on device** (1 min)
   ```
   Installing APK 'app-debug.apk' on 'Your Device'
   BUILD SUCCESSFUL in 12m 34s
   ```

4. **App launches automatically** ✅

### **Subsequent Builds (30-60 seconds)**

After first successful build, changes take only 30-60 seconds!

---

## 🎉 Success Indicators

### **Terminal Shows:**
```
info Running /path/to/sdk/platform-tools/adb -s ABC123XYZ reverse tcp:8081 tcp:8081
info Starting the app on "ABC123XYZ" (adb -s ABC123XYZ shell am start -n com.bharatemr/.MainActivity)...
Starting: Intent { cmp=com.bharatemr/.MainActivity }
```

### **On Your Phone:**
- ✅ App icon appears in app drawer
- ✅ App automatically launches
- ✅ You see "Welcome to Bharat EMR" screen
- ✅ Two buttons: "I'm a Doctor" and "I'm a Patient"

---

## 🧪 Test the App

### **1. Test Navigation**
- Tap "I'm a Doctor"
- Enter mobile: `9876543210`
- Tap "Send OTP"

### **2. Check Backend Connection**

If you see "Network Error":
- ✅ Verify backend is running (`npm start` in backend folder)
- ✅ Check IP address in `src/config/api.js`
- ✅ Ensure phone and PC on same WiFi
- ✅ Test backend in phone browser: `http://YOUR_IP:8080/api`

---

## 🔧 Common Issues & Fixes

### **Issue 1: "Cannot connect to daemon"**

```powershell
adb kill-server
adb start-server
adb devices
```

### **Issue 2: "INSTALL_FAILED_UPDATE_INCOMPATIBLE"**

```powershell
adb uninstall com.bharatemr
npm run android
```

### **Issue 3: "Task :app:installDebug FAILED"**

```powershell
cd android
.\gradlew clean
cd ..
npm run android
```

### **Issue 4: "Unable to load script"**

**Terminal 1:**
```powershell
npm start -- --reset-cache
```

**Terminal 2:**
```powershell
npm run android
```

### **Issue 5: Metro bundler port in use**

```powershell
netstat -ano | findstr :8081
# Note the PID, then:
taskkill /PID <PID_NUMBER> /F
npm start
```

### **Issue 6: Gradle build fails**

```powershell
cd android
.\gradlew --stop
.\gradlew clean
.\gradlew assembleDebug
```

---

## 📁 Project Structure After Setup

```
bharat-emr-mobile-complete/
├── android/                 ✅ Android native code
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/com/bharatemr/
│   │   │   └── res/
│   │   └── build.gradle
│   ├── gradle/
│   ├── build.gradle
│   └── settings.gradle
├── ios/                     ✅ iOS native code
│   ├── BharatEMR/
│   │   ├── Info.plist
│   │   └── LaunchScreen.storyboard
│   └── Podfile
├── src/                     ✅ React Native code
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── config/
│   └── utils/
├── index.js                 ✅ App entry point
├── app.json
├── package.json
└── README.md
```

---

## 🍎 iOS Setup (Mac Only)

### **Install Pods**

```bash
cd ios
pod install
cd ..
```

### **Run on iOS**

```bash
npm run ios
```

**OR** open in Xcode:

```bash
open ios/BharatEMR.xcworkspace
```

Then click **Run** button.

---

## 🎯 Quick Start Commands

```powershell
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Check device
adb devices

# Terminal 1: Start Metro
npm start

# Terminal 2: Run app
npm run android
```

---

## 📊 Build Times

| Build Type | First Time | Subsequent |
|------------|------------|------------|
| Clean build | 10-15 min | 30-60 sec |
| Code change | N/A | 5-10 sec (hot reload) |
| Dependency add | 3-5 min | 3-5 min |
| Clean + rebuild | 10-15 min | 10-15 min |

---

## 💡 Pro Tips

1. **Keep Metro running** - Don't close Terminal 1
2. **Enable Hot Reload** - Shake phone → Enable Fast Refresh
3. **Use WiFi** - Ensure phone and PC on same network
4. **Check logs** - Use `adb logcat` for Android debugging
5. **Clear cache** - Run `npm start -- --reset-cache` if issues

---

## ✅ Checklist

Before running:
- [ ] Git pulled latest changes
- [ ] `npm install` completed
- [ ] Backend URL updated in `api.js`
- [ ] Backend server running
- [ ] Phone USB debugging enabled
- [ ] `adb devices` shows device
- [ ] Phone and PC on same WiFi

---

## 🎊 You're All Set!

The app should now be running on your phone with complete Android/iOS native configuration!

### **Next Steps:**

1. ✅ Test login flow
2. ✅ Add a patient
3. ✅ Create a visit
4. ✅ Generate prescription
5. ✅ Download PDF

---

## 📞 Need Help?

- **GitHub Issues:** [Report Issue](https://github.com/snamdeo17/bharat-emr-mobile-complete/issues)
- **Email:** support@bharatemr.com
- **Backend Repo:** [bharat-emr-backend-complete](https://github.com/snamdeo17/bharat-emr-backend-complete)

---

**Happy Coding! 🚀**
