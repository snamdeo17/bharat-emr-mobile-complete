import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import api from '../../config/api';
import {format} from 'date-fns';

const PatientDetailScreen = ({navigation, route}) => {
  const {patientId} = route.params;
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPatientDetails();
  }, []);

  const fetchPatientDetails = async () => {
    try {
      const [patientRes, visitsRes] = await Promise.all([
        api.get(`/patients/profile/${patientId}`),
        api.get(`/patients/${patientId}/visits`),
      ]);

      setPatient(patientRes.data.data);
      setVisits(visitsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPatientDetails();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Patient Header */}
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarTextLarge}>
            {patient?.fullName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.patientName}>{patient?.fullName}</Text>
        <Text style={styles.patientId}>ID: {patient?.patientId}</Text>
      </View>

      {/* Patient Info Cards */}
      <View style={styles.section}>
        <InfoCard icon="gender-male-female" label="Gender" value={patient?.gender} />
        <InfoCard icon="calendar" label="Age" value={`${patient?.age} years`} />
        <InfoCard icon="water" label="Blood Group" value={patient?.bloodGroup || 'N/A'} />
        <InfoCard icon="phone" label="Mobile" value={patient?.mobileNumber} />
      </View>

      {/* Contact Info */}
      {patient?.email && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <InfoRow icon="email" label="Email" value={patient.email} />
          {patient.address && (
            <InfoRow icon="map-marker" label="Address" value={patient.address} />
          )}
          {patient.emergencyContact && (
            <InfoRow
              icon="phone-alert"
              label="Emergency"
              value={patient.emergencyContact}
            />
          )}
        </View>
      )}

      {/* Visit History */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Visit History</Text>
          <Text style={styles.visitCount}>{visits.length} visits</Text>
        </View>

        {visits.length === 0 ? (
          <Text style={styles.emptyText}>No visits yet</Text>
        ) : (
          visits.map(visit => (
            <TouchableOpacity
              key={visit.id}
              style={styles.visitItem}
              onPress={() =>
                navigation.navigate('VisitDetail', {visitId: visit.id})
              }>
              <View style={styles.visitHeader}>
                <Text style={styles.visitDate}>
                  {format(new Date(visit.visitDate), 'dd MMM yyyy')}
                </Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <Text style={styles.visitComplaint} numberOfLines={2}>
                {visit.chiefComplaint}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Create Visit Button */}
      <TouchableOpacity
        style={styles.createVisitButton}
        onPress={() =>
          navigation.navigate('CreateVisit', {patientId: patient.patientId})
        }>
        <Icon name="note-plus" size={20} color="#fff" />
        <Text style={styles.createVisitText}>Create New Visit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoCard = ({icon, label, value}) => (
  <View style={styles.infoCard}>
    <Icon name={icon} size={24} color={colors.primary} />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const InfoRow = ({icon, label, value}) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={20} color={colors.textSecondary} />
    <View style={styles.infoRowContent}>
      <Text style={styles.infoRowLabel}>{label}</Text>
      <Text style={styles.infoRowValue}>{value}</Text>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarTextLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  patientId: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  section: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  infoCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    margin: '1%',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  visitCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRowContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoRowLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoRowValue: {
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
  },
  visitItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  visitDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  visitComplaint: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  createVisitButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    margin: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createVisitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PatientDetailScreen;
