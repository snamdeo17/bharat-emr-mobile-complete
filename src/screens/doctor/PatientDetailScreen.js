import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import api from '../../config/api';
import {format} from 'date-fns';

const PatientDetailScreen = ({navigation, route}) => {
  const {patient} = route.params;
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPatientVisits();
  }, []);

  const fetchPatientVisits = async () => {
    try {
      const response = await api.get(`/visits/patient/${patient.patientId}`);
      setVisits(response.data.data || []);
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPatientVisits();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Patient Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Icon name="account" size={48} color="#fff" />
          </View>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.patientId}>ID: {patient.patientId}</Text>
        </View>

        {/* Patient Info Cards */}
        <View style={styles.infoContainer}>
          <InfoCard icon="phone" label="Mobile" value={patient.mobileNumber} />
          <InfoCard
            icon="email"
            label="Email"
            value={patient.email || 'Not provided'}
          />
          <InfoCard icon="calendar" label="Age" value={`${patient.age} years`} />
          <InfoCard icon="gender-male-female" label="Gender" value={patient.gender} />
          {patient.bloodGroup && (
            <InfoCard icon="water" label="Blood Group" value={patient.bloodGroup} />
          )}
        </View>

        {/* Address */}
        {patient.address && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>{patient.address}</Text>
            </View>
          </View>
        )}

        {/* Medical History */}
        {patient.medicalHistory && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical History</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>{patient.medicalHistory}</Text>
            </View>
          </View>
        )}

        {/* Allergies */}
        {patient.allergies && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergies</Text>
            <View style={[styles.card, styles.warningCard]}>
              <Icon name="alert" size={20} color={colors.warning} />
              <Text style={[styles.cardText, styles.warningText]}>
                {patient.allergies}
              </Text>
            </View>
          </View>
        )}

        {/* Visit History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Visit History</Text>
            <Text style={styles.visitCount}>{visits.length} visits</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : visits.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="calendar-blank" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No visits yet</Text>
            </View>
          ) : (
            visits.map(visit => (
              <TouchableOpacity
                key={visit.id}
                style={styles.visitCard}
                onPress={() =>
                  navigation.navigate('VisitDetail', {visitId: visit.id})
                }>
                <View style={styles.visitHeader}>
                  <Text style={styles.visitDate}>
                    {format(new Date(visit.visitDate), 'dd MMM yyyy')}
                  </Text>
                  <Icon name="chevron-right" size={24} color={colors.textSecondary} />
                </View>
                <Text style={styles.complaint} numberOfLines={2}>
                  {visit.chiefComplaint}
                </Text>
                {visit.diagnosis && (
                  <Text style={styles.diagnosis} numberOfLines={1}>
                    Diagnosis: {visit.diagnosis}
                  </Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Create Visit FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateVisit', {patient})}>
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
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
  header: {
    backgroundColor: colors.primary,
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  patientId: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  infoContainer: {
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  visitCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 1,
  },
  cardText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  warningText: {
    marginLeft: 8,
    flex: 1,
  },
  visitCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  visitDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  complaint: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  diagnosis: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default PatientDetailScreen;
