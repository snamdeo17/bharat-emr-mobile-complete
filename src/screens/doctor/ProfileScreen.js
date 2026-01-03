import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import {useAuth} from '../../context/AuthContext';
import api from '../../config/api';

const ProfileScreen = () => {
  const {user, logout} = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/doctors/profile/${user.userId}`);
      setProfile(response.data.data);
      setFormData(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/doctors/profile/${user.userId}`, formData);
      Alert.alert('Success', 'Profile updated successfully');
      setProfile(formData);
      setEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', onPress: logout, style: 'destructive'},
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="doctor" size={48} color={colors.primary} />
        </View>
        <Text style={styles.name}>{profile?.fullName}</Text>
        <Text style={styles.doctorId}>{profile?.doctorId}</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <Icon
              name={editing ? 'close' : 'pencil'}
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {editing ? (
          <View>
            <InfoField
              label="Specialization"
              value={formData.specialization}
              onChangeText={text =>
                setFormData({...formData, specialization: text})
              }
              editable
            />
            <InfoField
              label="Qualification"
              value={formData.qualification}
              onChangeText={text =>
                setFormData({...formData, qualification: text})
              }
              editable
            />
            <InfoField
              label="Clinic Name"
              value={formData.clinicName}
              onChangeText={text => setFormData({...formData, clinicName: text})}
              editable
            />
            <InfoField
              label="Clinic Address"
              value={formData.clinicAddress}
              onChangeText={text =>
                setFormData({...formData, clinicAddress: text})
              }
              editable
              multiline
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <InfoItem
              icon="stethoscope"
              label="Specialization"
              value={profile?.specialization}
            />
            <InfoItem
              icon="school"
              label="Qualification"
              value={profile?.qualification}
            />
            <InfoItem
              icon="briefcase"
              label="Experience"
              value={`${profile?.yearsOfExperience} years`}
            />
            <InfoItem
              icon="hospital-building"
              label="Clinic"
              value={profile?.clinicName}
            />
            <InfoItem
              icon="map-marker"
              label="Address"
              value={profile?.clinicAddress}
            />
            <InfoItem
              icon="phone"
              label="Mobile"
              value={profile?.mobileNumber}
            />
            <InfoItem
              icon="email"
              label="Email"
              value={profile?.email || 'Not provided'}
            />
            <InfoItem
              icon="card-account-details"
              label="Registration No."
              value={profile?.medicalRegistrationNumber}
            />
          </View>
        )}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="bell-outline" size={24} color={colors.text} />
          <Text style={styles.settingText}>Notifications</Text>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="lock-outline" size={24} color={colors.text} />
          <Text style={styles.settingText}>Privacy</Text>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="help-circle-outline" size={24} color={colors.text} />
          <Text style={styles.settingText}>Help & Support</Text>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color={colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoItem = ({icon, label, value}) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={20} color={colors.primary} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const InfoField = ({label, value, onChangeText, editable, multiline}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.textArea]}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.primary,
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  doctorId: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    marginTop: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
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
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    margin: 20,
    borderRadius: 8,
    elevation: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 8,
  },
});

export default ProfileScreen;
