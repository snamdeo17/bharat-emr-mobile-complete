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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/doctors/profile/${user.userId}`);
      setProfile(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/doctors/profile/${user.userId}`, profile);
      Alert.alert('Success', 'Profile updated successfully');
      setEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
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
          <Icon name="doctor" size={48} color="#fff" />
        </View>
        <Text style={styles.name}>{profile?.fullName}</Text>
        <Text style={styles.doctorId}>{profile?.doctorId}</Text>
        <Text style={styles.specialization}>{profile?.specialization}</Text>
      </View>

      {/* Edit/Save Button */}
      <View style={styles.actionContainer}>
        {editing ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setEditing(false);
                fetchProfile();
              }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(true)}>
            <Icon name="pencil" size={20} color={colors.primary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Information</Text>
        
        <InfoField
          label="Qualification"
          value={profile?.qualification}
          editable={editing}
          onChangeText={text => setProfile({...profile, qualification: text})}
        />
        <InfoField
          label="Years of Experience"
          value={profile?.yearsOfExperience?.toString()}
          editable={editing}
          keyboardType="number-pad"
          onChangeText={text =>
            setProfile({...profile, yearsOfExperience: parseInt(text) || 0})
          }
        />
        <InfoField
          label="Registration Number"
          value={profile?.medicalRegistrationNumber}
          editable={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <InfoField
          label="Mobile Number"
          value={profile?.mobileNumber}
          editable={false}
        />
        <InfoField
          label="Email"
          value={profile?.email}
          editable={editing}
          keyboardType="email-address"
          onChangeText={text => setProfile({...profile, email: text})}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Clinic Information</Text>
        
        <InfoField
          label="Clinic Name"
          value={profile?.clinicName}
          editable={editing}
          onChangeText={text => setProfile({...profile, clinicName: text})}
        />
        <InfoField
          label="Clinic Address"
          value={profile?.clinicAddress}
          editable={editing}
          multiline
          onChangeText={text => setProfile({...profile, clinicAddress: text})}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Bharat EMR v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const InfoField = ({label, value, editable, ...props}) => (
  <View style={styles.infoField}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.value, editable && styles.editableValue]}
      value={value}
      editable={editable}
      {...props}
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
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  doctorId: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  specialization: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
  },
  actionContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    paddingVertical: 8,
  },
  editableValue: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 30,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default ProfileScreen;
