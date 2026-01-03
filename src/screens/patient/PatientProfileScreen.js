import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import {useAuth} from '../../context/AuthContext';
import api from '../../config/api';

const PatientProfileScreen = () => {
  const {user, logout} = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/patients/profile/${user.userId}`);
      setProfile(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile');
    } finally {
      setLoading(false);
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
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="account" size={48} color="#fff" />
        </View>
        <Text style={styles.name}>{profile?.fullName}</Text>
        <Text style={styles.patientId}>ID: {profile?.patientId}</Text>
      </View>

      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <InfoCard icon="phone" label="Mobile" value={profile?.mobileNumber} />
        {profile?.email && (
          <InfoCard icon="email" label="Email" value={profile.email} />
        )}
        <InfoCard icon="calendar" label="Age" value={`${profile?.age} years`} />
        <InfoCard icon="gender-male-female" label="Gender" value={profile?.gender} />
        {profile?.bloodGroup && (
          <InfoCard icon="water" label="Blood Group" value={profile.bloodGroup} />
        )}
      </View>

      {/* Contact Info */}
      {profile?.address && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>{profile.address}</Text>
          </View>
        </View>
      )}

      {/* Medical Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Information</Text>
        
        {profile?.medicalHistory ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="history" size={20} color={colors.secondary} />
              <Text style={styles.cardTitle}>Medical History</Text>
            </View>
            <Text style={styles.cardText}>{profile.medicalHistory}</Text>
          </View>
        ) : (
          <Text style={styles.emptyText}>No medical history recorded</Text>
        )}

        {profile?.allergies && (
          <View style={[styles.card, styles.allergyCard]}>
            <View style={styles.cardHeader}>
              <Icon name="alert" size={20} color={colors.warning} />
              <Text style={styles.cardTitle}>Allergies</Text>
            </View>
            <Text style={[styles.cardText, styles.allergyText]}>
              {profile.allergies}
            </Text>
          </View>
        )}
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="help-circle" size={24} color={colors.textSecondary} />
          <Text style={styles.menuText}>Help & Support</Text>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="shield-check" size={24} color={colors.textSecondary} />
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="information" size={24} color={colors.textSecondary} />
          <Text style={styles.menuText}>About</Text>
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Bharat EMR v1.0.0</Text>
        <Text style={styles.footerText}>Made with ❤️ for Indian Healthcare</Text>
      </View>
    </ScrollView>
  );
};

const InfoCard = ({icon, label, value}) => (
  <View style={styles.infoCard}>
    <Icon name={icon} size={20} color={colors.secondary} />
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
    backgroundColor: colors.secondary,
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
  patientId: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
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
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  cardText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  allergyCard: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  allergyText: {
    color: colors.warning,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuText: {
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
    paddingVertical: 14,
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 16,
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
    marginBottom: 4,
  },
});

export default PatientProfileScreen;
