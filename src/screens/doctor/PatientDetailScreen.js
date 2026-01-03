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
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
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
    fetchVisits();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Patient Info Card */}
        <View style={styles.patientCard}>
          <View style={styles.avatar}>
            <Icon name="account" size={48} color="#fff" />
          </View>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.patientId}>ID: {patient.patientId}</Text>

          <View style={styles.infoGrid}>
            <InfoItem icon="gender-male-female" label="Gender" value={patient.gender} />
            <InfoItem icon="cake-variant" label="Age" value={`${patient.age} yrs`} />
            <InfoItem
              icon="water"
              label="Blood"
              value={patient.bloodGroup || 'N/A'}
            />
            <InfoItem
              icon="phone"
              label="Contact"
              value={patient.mobileNumber}
            />
          </View>

          {patient.allergies && (
            <View style={styles.alertBox}>
              <Icon name="alert" size={20} color={colors.error} />
              <Text style={styles.alertText}>Allergies: {patient.allergies}</Text>
            </View>
          )}

          {patient.chronicConditions && (
            <View style={[styles.alertBox, {backgroundColor: '#fff3cd'}]}>
              <Icon name="clipboard-pulse" size={20} color={colors.warning} />
              <Text style={[styles.alertText, {color: colors.warning}]}>
                Conditions: {patient.chronicConditions}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('CreateVisit', {patient})
            }>
            <Icon name="note-plus" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Create Visit</Text>
          </TouchableOpacity>
        </View>

        {/* Visit History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visit History</Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : visits.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="clipboard-text-off" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No visits yet</Text>
            </View>
          ) : (
            visits.map(visit => (
              <VisitCard
                key={visit.id}
                visit={visit}
                onPress={() =>
                  navigation.navigate('VisitDetail', {visitId: visit.id})
                }
              />
            ))
          )}
        </View>
      </ScrollView>
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

const VisitCard = ({visit, onPress}) => (
  <TouchableOpacity style={styles.visitCard} onPress={onPress}>
    <View style={styles.visitHeader}>
      <View>
        <Text style={styles.visitDate}>
          {format(new Date(visit.visitDate), 'dd MMM yyyy, hh:mm a')}
        </Text>
        <Text style={styles.visitComplaint} numberOfLines={2}>
          {visit.chiefComplaint}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color={colors.textSecondary} />
    </View>
    {visit.prescriptionGenerated && (
      <View style={styles.prescriptionBadge}>
        <Icon name="file-document" size={14} color={colors.success} />
        <Text style={styles.prescriptionText}>Prescription</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  patientCard: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
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
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
  },
  alertText: {
    fontSize: 14,
    color: colors.error,
    marginLeft: 8,
    flex: 1,
  },
  actionsContainer: {
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    elevation: 2,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
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
  },
  visitDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  visitComplaint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  prescriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  prescriptionText: {
    fontSize: 12,
    color: colors.success,
    marginLeft: 4,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
});

export default PatientDetailScreen;
