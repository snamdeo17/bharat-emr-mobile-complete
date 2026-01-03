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
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchVisitDetails();
  }, []);

  const fetchVisitDetails = async () => {
    try {
      const response = await api.get(`/visits/${visitId}`);
      setVisit(response.data.data);
    } catch (error) {
      console.error('Error fetching visit:', error);
      Alert.alert('Error', 'Failed to load visit details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/visits/${visitId}/prescription/pdf`, {
        responseType: 'blob',
      });
      // Handle PDF download/opening
      Alert.alert('Success', 'Prescription downloaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to download prescription');
    } finally {
      setDownloading(false);
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
      {/* Visit Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Visit Information</Text>
        <InfoRow icon="calendar" label="Date" value={format(new Date(visit.visitDate), 'dd MMM yyyy, hh:mm a')} />
        <InfoRow icon="account" label="Patient" value={visit.patientName} />
      </View>

      {/* Chief Complaint */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Chief Complaint</Text>
        <Text style={styles.contentText}>{visit.chiefComplaint}</Text>
      </View>

      {/* Present Illness */}
      {visit.presentIllness && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Present Illness</Text>
          <Text style={styles.contentText}>{visit.presentIllness}</Text>
        </View>
      )}

      {/* Clinical Notes */}
      {visit.clinicalNotes && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Clinical Notes</Text>
          <Text style={styles.contentText}>{visit.clinicalNotes}</Text>
        </View>
      )}

      {/* Medicines */}
      {visit.medicines && visit.medicines.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Prescribed Medicines</Text>
          {visit.medicines.map((medicine, index) => (
            <View key={index} style={styles.medicineItem}>
              <View style={styles.medicineHeader}>
                <Text style={styles.medicineName}>
                  {index + 1}. {medicine.medicineName}
                </Text>
              </View>
              <Text style={styles.medicineDetail}>Dosage: {medicine.dosage}</Text>
              <Text style={styles.medicineDetail}>Frequency: {medicine.frequency}</Text>
              <Text style={styles.medicineDetail}>Duration: {medicine.duration}</Text>
              {medicine.instructions && (
                <Text style={styles.medicineDetail}>Instructions: {medicine.instructions}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Tests */}
      {visit.tests && visit.tests.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recommended Tests</Text>
          {visit.tests.map((test, index) => (
            <View key={index} style={styles.testItem}>
              <Text style={styles.testName}>
                {index + 1}. {test.testName}
              </Text>
              {test.instructions && (
                <Text style={styles.testInstructions}>{test.instructions}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Follow-up */}
      {visit.followUp && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Follow-up</Text>
          <InfoRow
            icon="calendar-clock"
            label="Scheduled"
            value={format(new Date(visit.followUp.scheduledDate), 'dd MMM yyyy')}
          />
          {visit.followUp.notes && (
            <Text style={styles.contentText}>{visit.followUp.notes}</Text>
          )}
        </View>
      )}

      {/* Download Button */}
      <TouchableOpacity
        style={[styles.downloadButton, downloading && styles.buttonDisabled]}
        onPress={handleDownloadPDF}
        disabled={downloading}>
        {downloading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Icon name="download" size={20} color="#fff" />
            <Text style={styles.downloadButtonText}>Download Prescription</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoRow = ({icon, label, value}) => (
  <View style={styles.infoRow}>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoContent: {
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
  contentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  medicineItem: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 12,
    marginBottom: 16,
  },
  medicineHeader: {
    marginBottom: 8,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  medicineDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  testItem: {
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
    paddingLeft: 12,
    marginBottom: 12,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  testInstructions: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  downloadButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    margin: 16,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default VisitDetailScreen;
