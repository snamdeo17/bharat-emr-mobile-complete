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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Patient Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.avatarLarge}>
          <Icon name="account" size={48} color={colors.primary} />
        </View>
        <Text style={styles.patientName}>{patient.fullName}</Text>
        
        <View style={styles.infoGrid}>
          <InfoItem icon="gender-male-female" label="Gender" value={patient.gender} />
          <InfoItem icon="calendar" label="Age" value={`${patient.age} years`} />
          <InfoItem icon="phone" label="Mobile" value={patient.mobileNumber} />
          {patient.email && (
            <InfoItem icon="email" label="Email" value={patient.email} />
          )}
        </View>

        {patient.address && (
          <View style={styles.addressContainer}>
            <Icon name="map-marker" size={16} color={colors.textSecondary} />
            <Text style={styles.addressText}>{patient.address}</Text>
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
          <Icon name="plus-circle" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>New Visit</Text>
        </TouchableOpacity>
      </View>

      {/* Visit History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visit History</Text>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : visits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="file-document-outline" size={48} color={colors.textSecondary} />
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
  );
};

const InfoItem = ({icon, label, value}) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={20} color={colors.primary} />
    <View style={styles.infoItemText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const VisitCard = ({visit, onPress}) => (
  <TouchableOpacity style={styles.visitCard} onPress={onPress}>
    <View style={styles.visitHeader}>
      <View>
        <Text style={styles.visitDate}>
          {format(new Date(visit.visitDate), 'dd MMM yyyy')}
        </Text>
        <Text style={styles.visitTime}>
          {format(new Date(visit.visitDate), 'hh:mm a')}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color={colors.textSecondary} />
    </View>
    <Text style={styles.complaint} numberOfLines={2}>
      {visit.chiefComplaint}
    </Text>
    {visit.medicines && visit.medicines.length > 0 && (
      <View style={styles.medicineTag}>
        <Icon name="pill" size={14} color={colors.primary} />
        <Text style={styles.medicineCount}>
          {visit.medicines.length} medicines prescribed
        </Text>
      </View>
    )}
  </TouchableOpacity>
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
  avatarLarge: {
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
    marginBottom: 20,
  },
  infoGrid: {
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoItemText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addressText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  actionsContainer: {
    padding: 20,
  },
  actionButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  visitCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
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
  visitTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  complaint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  medicineTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicineCount: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
  },
});

export default PatientDetailScreen;
