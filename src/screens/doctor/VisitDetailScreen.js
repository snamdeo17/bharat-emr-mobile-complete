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
import api from '../../config/api';
import {format} from 'date-fns';

const VisitDetailScreen = ({route}) => {
  const {visitId} = route.params;
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitDetails();
  }, []);

  const fetchVisitDetails = async () => {
    try {
      const response = await api.get(`/visits/${visitId}`);
      setVisit(response.data.data);
    } catch (error) {
      console.error('Error fetching visit details:', error);
      Alert.alert('Error', 'Failed to load visit details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPrescription = async () => {
    try {
      Alert.alert('Info', 'Prescription download functionality will be implemented');
      // TODO: Implement PDF download using react-native-pdf or similar
    } catch (error) {
      Alert.alert('Error', 'Failed to download prescription');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!visit) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Visit not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Visit Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.patientName}>{visit.patientName}</Text>
            <Text style={styles.visitDate}>
              {format(new Date(visit.visitDate), 'dd MMMM yyyy, hh:mm a')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownloadPrescription}>
            <Icon name="download" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Visit Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visit Details</Text>
        
        <DetailCard label="Chief Complaint" value={visit.chiefComplaint} />
        
        {visit.presentIllness && (
          <DetailCard label="Present Illness" value={visit.presentIllness} />
        )}
        
        {visit.clinicalNotes && (
          <DetailCard label="Clinical Notes" value={visit.clinicalNotes} />
        )}
      </View>

      {/* Prescription */}
      {visit.medicines && visit.medicines.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prescription</Text>
          {visit.medicines.map((medicine, index) => (
            <View key={index} style={styles.medicineCard}>
              <View style={styles.medicineHeader}>
                <Icon name="pill" size={20} color={colors.primary} />
                <Text style={styles.medicineName}>{medicine.medicineName}</Text>
              </View>
              <Text style={styles.medicineDetail}>
                Dosage: {medicine.dosage}
              </Text>
              <Text style={styles.medicineDetail}>
                Frequency: {medicine.frequency}
              </Text>
              <Text style={styles.medicineDetail}>
                Duration: {medicine.duration}
              </Text>
              {medicine.instructions && (
                <Text style={styles.medicineInstructions}>
                  {medicine.instructions}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Tests */}
      {visit.tests && visit.tests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tests/Investigations</Text>
          {visit.tests.map((test, index) => (
            <View key={index} style={styles.testCard}>
              <View style={styles.testHeader}>
                <Icon name="test-tube" size={20} color={colors.warning} />
                <Text style={styles.testName}>{test.testName}</Text>
              </View>
              {test.instructions && (
                <Text style={styles.testInstructions}>{test.instructions}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Follow-up */}
      {visit.followUp && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow-up</Text>
          <View style={styles.followUpCard}>
            <View style={styles.followUpHeader}>
              <Icon name="calendar-clock" size={20} color={colors.success} />
              <Text style={styles.followUpDate}>
                {format(new Date(visit.followUp.scheduledDate), 'dd MMM yyyy')}
              </Text>
            </View>
            {visit.followUp.notes && (
              <Text style={styles.followUpNotes}>{visit.followUp.notes}</Text>
            )}
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{visit.followUp.status}</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const DetailCard = ({label, value}) => (
  <View style={styles.detailCard}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  visitDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  downloadButton: {
    padding: 8,
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
  detailCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
  },
  medicineCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  medicineDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  medicineInstructions: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
    fontStyle: 'italic',
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 4,
  },
  testCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  testInstructions: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  followUpCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  followUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  followUpDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  followUpNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});

export default VisitDetailScreen;
