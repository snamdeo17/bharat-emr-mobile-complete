import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import {useAuth} from '../../context/AuthContext';
import api from '../../config/api';

const ProfileScreen = () => {
  const {user, logout} = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const response = await api.get(`/doctors/profile/${user.userId}`);
      setDoctor(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
          },
          style: 'destructive',
        },
      ],
    );
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
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>
            {doctor?.fullName?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.doctorName}>{doctor?.fullName}</Text>
        <Text style={styles.doctorId}>ID: {doctor?.doctorId}</Text>
        <Text style={styles.specialization}>{doctor?.specialization}</Text>
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Information</Text>
        
        <InfoCard
          icon="school"
          label="Qualification"
          value={doctor?.qualification}
        />
        <InfoCard
          icon="briefcase"
          label="Experience"
          value={`${doctor?.yearsOfExperience} years`}
        />
        <InfoCard
          icon="certificate"
          label="Registration Number"
          value={doctor?.medicalRegistrationNumber}
        />
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <InfoCard icon="phone" label="Mobile" value={doctor?.mobileNumber} />
        {doctor?.email && (
          <InfoCard icon="email" label="Email" value={doctor.email} />
        )}
      </View>

      {/* Clinic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Clinic Information</Text>
        
        <InfoCard
          icon="hospital-building"
          label="Clinic Name"
          value={doctor?.clinicName}
        />
        <InfoCard
          icon="map-marker"
          label="Address"
          value={doctor?.clinicAddress}
        />
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="pencil" size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="lock-reset" size={20} color={colors.textSecondary} />
          <Text style={styles.actionButtonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}>
          <Icon name="logout" size={20} color={colors.error} />
          <Text style={[styles.actionButtonText, styles.logoutText]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Bharat EMR v1.0.0</Text>
        <Text style={styles.footerText}>Made with ❤️ for Indian Healthcare</Text>
      </View>
    </ScrollView>
  );
};

const InfoCard = ({icon, label, value}) => (
  <View style={styles.infoCard}>
    <Icon name={icon} size={20} color={colors.primary} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primary,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  doctorId: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  specialization: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    color: colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});

export default ProfileScreen;
