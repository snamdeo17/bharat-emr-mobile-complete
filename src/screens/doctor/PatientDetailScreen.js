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

const PatientDetailScreen = ({route, navigation}) => {
  const {patient} = route.params;
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPatientVisits();
  }, []);

  const fetchPatientVisits = async () => {
    try {
      const response = await api.get(`/patients/${patient.patientId}/visits`);
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
        {/* Patient Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.avatar}>
            <Icon
              name={patient.gender === 'Male' ? 'account' : 'account-outline'}
              size={48}
              color={colors.primary}
            />
          </View>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.patientId}>ID: {patient.patientId}</Text>

          <View style={styles.infoGrid}>
            <InfoItem icon="calendar" label="Age" value={`${patient.age} years`} />
            <InfoItem icon="gender-male-female" label="Gender" value={patient.gender} />
            <InfoItem icon="phone" label="Mobile" value={patient.mobileNumber} />
            {patient.bloodGroup && (
              <InfoItem icon="water" label="Blood Group" value={patient.bloodGroup} />
            )}
          </View>

          {patient.allergies && (
            <View style={styles.medicalInfo}>
              <Text style={styles.medicalLabel}>
                <Icon name="alert-circle" size={16} color={colors.error} /> Allergies
              </Text>
              <Text style={styles.medicalText}>{patient.allergies}</Text>
            </View>
          )}

          {patient.chronicConditions && (
            <View style={styles.medicalInfo}>
              <Text style={styles.medicalLabel}>
                <Icon name="medical-bag" size={16} color={colors.warning} /> Chronic Conditions
              </Text>
              <Text style={styles.medicalText}>{patient.chronicConditions}</Text>
            </View>
          )}
        </View>

        {/* Visit History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Visit History</Text>
            <Text style={styles.visitCount}>{visits.length} visits</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : visits.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="clipboard-text-off" size={48} color={colors.textSecondary} />
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
                  <Icon name="chevron-right" size={20} color={colors.textSecondary} />
                </View>
                <Text style={styles.complaint} numberOfLines={2}>
                  {visit.chiefComplaint}
                </Text>
                {visit.medicines?.length > 0 && (
                  <Text style={styles.medicineCount}>
                    <Icon name="pill" size={14} /> {visit.medicines.length} medicines
                  </Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Create Visit Button */}
      <TouchableOpacity
        style={styles.createVisitButton}
        onPress={() => navigation.navigate('CreateVisit', {patient})}>
        <Icon name="plus" size={24} color="#fff" />
        <Text style={styles.createVisitText}>Create Visit</Text>
      </TouchableOpacity>
    </View>
  );
};

const InfoItem = ({icon, label, value}) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={20} color={colors.primary} />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  patientId: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    width: '100%',
  },
  infoItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  medicalInfo: {
    width: '100%',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  medicalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  medicalText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    padding: 20,
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
  visitCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  complaint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  medicineCount: {
    fontSize: 12,
    color: colors.primary,
  },
  createVisitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    margin: 20,
    borderRadius: 8,
    elevation: 2,
  },
  createVisitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PatientDetailScreen;
