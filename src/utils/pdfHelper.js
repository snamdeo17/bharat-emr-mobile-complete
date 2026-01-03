import {Platform, Alert, PermissionsAndroid} from 'react-native';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

/**
 * Download PDF to device
 * @param {string} pdfUrl - URL of the PDF
 * @param {string} fileName - Name of the file
 * @returns {Promise<boolean>} Success status
 */
export const downloadPDF = async (pdfUrl, fileName = 'prescription.pdf') => {
  try {
    // Request storage permission on Android
    if (Platform.OS === 'android') {
      const granted = await requestStoragePermission();
      if (!granted) {
        Alert.alert('Permission Denied', 'Storage permission is required to download files.');
        return false;
      }
    }

    // Determine download path
    const downloadDest = Platform.OS === 'ios'
      ? `${RNFS.DocumentDirectoryPath}/${fileName}`
      : `${RNFS.DownloadDirectoryPath}/${fileName}`;

    // Download file
    const result = await RNFS.downloadFile({
      fromUrl: pdfUrl,
      toFile: downloadDest,
    }).promise;

    if (result.statusCode === 200) {
      Alert.alert(
        'Success',
        `PDF downloaded successfully to ${Platform.OS === 'ios' ? 'Files' : 'Downloads'} folder.`,
      );
      return true;
    } else {
      Alert.alert('Error', 'Failed to download PDF.');
      return false;
    }
  } catch (error) {
    console.error('Error downloading PDF:', error);
    Alert.alert('Error', 'An error occurred while downloading the PDF.');
    return false;
  }
};

/**
 * Share PDF via various apps
 * @param {string} pdfUrl - URL of the PDF
 * @param {string} fileName - Name of the file
 * @returns {Promise<boolean>} Success status
 */
export const sharePDF = async (pdfUrl, fileName = 'prescription.pdf') => {
  try {
    // Download PDF to temp directory first
    const tempPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;

    await RNFS.downloadFile({
      fromUrl: pdfUrl,
      toFile: tempPath,
    }).promise;

    // Share options
    const shareOptions = {
      title: 'Share Prescription',
      message: 'Sharing prescription PDF',
      url: Platform.OS === 'ios' ? tempPath : `file://${tempPath}`,
      type: 'application/pdf',
    };

    await Share.open(shareOptions);
    return true;
  } catch (error) {
    console.error('Error sharing PDF:', error);
    if (error.message !== 'User did not share') {
      Alert.alert('Error', 'An error occurred while sharing the PDF.');
    }
    return false;
  }
};

/**
 * Request storage permission on Android
 * @returns {Promise<boolean>} Permission granted status
 */
const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    if (Platform.Version >= 33) {
      // Android 13+ doesn't require storage permission for downloads
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'Bharat EMR needs access to your storage to download files.',
        buttonPositive: 'OK',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting permission:', error);
    return false;
  }
};

/**
 * Get file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Check if file exists
 * @param {string} filePath - Path to file
 * @returns {Promise<boolean>} File exists status
 */
export const fileExists = async filePath => {
  try {
    return await RNFS.exists(filePath);
  } catch (error) {
    return false;
  }
};

/**
 * Delete file
 * @param {string} filePath - Path to file
 * @returns {Promise<boolean>} Delete success status
 */
export const deleteFile = async filePath => {
  try {
    const exists = await fileExists(filePath);
    if (exists) {
      await RNFS.unlink(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};
