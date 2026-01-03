import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import api from '../../config/api';
import {format} from 'date-fns';

const VisitDetailScreen = ({navigation, route}) => {
  const {visitId} = route.params;
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

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
    setDownloadingPdf(true);
    try {
      // First generate PDF if not already generated
      await api.post(`/visits/${visitId}/prescription/generate-pdf`);

      // Then get download URL
      const response = await api.get(`/visits/${visitId}/prescription/pdf`, {
        responseType: 'blob',
      });

      // Share or save PDF
      Alert.alert('Success', 'Prescription downloaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to download prescription');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleSharePrescription = async () => {
    try {
      await Share.share({
        message: `Prescription for visit on ${format(
          new Date(visit.visitDate),
          'dd MMM yyyy',
        )}`,
        title: 'Share Prescription',
      });
    } catch (error) {
      console.error('Error sharing:', error);
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
    <View style={styles.container}>
      <ScrollView>
        {/* Visit Header */}
        <View style={styles.header}>
          <Text style={styles.patientName}>{visit.patientName}</Text>
          <Text style={styles.visitDate}>
            {format(new Date(visit.visitDate), 'dd MMM yyyy, hh:mm a')}
          </Text>
        </View>

        {/* Chief Complaint */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chief Complaint</Text>
          <Text style={styles.contentText}>{visit.chiefComplaint}</Text>
        </View>

        {/* Present Illness */}
        {visit.presentIllness && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>History of Present Illness</Text>
            <Text style={styles.contentText}>{visit.presentIllness}</Text>
          </View>
        )}

        {/* Clinical Notes */}
        {visit.clinicalNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Clinical Examination</Text>
            <Text style={styles.contentText}>{visit.clinicalNotes}</Text>
          </View>
        )}

        {/* Diagnosis */}
        {visit.diagnosis && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diagnosis</Text>
            <Text style={styles.contentText}>{visit.diagnosis}</Text>
          </View>
        )}

        {/* Medicines */}
        {visit.medicines && visit.medicines.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prescription</Text>
            {visit.medicines.map((med, index) => (
              <View key={index} style={styles.medicineCard}>
                <Text style={styles.medicineName}>
                  {index + 1}. {med.medicineName}
                </Text>
                <Text style={styles.medicineDetail}>
                  Dosage: {med.dosage}
                </Text>
                <Text style={styles.medicineDetail}>
                  Frequency: {med.frequency}
                </Text>
                <Text style={styles.medicineDetail}>
                  Duration: {med.duration}
                </Text>
                {med.instructions && (
                  <Text style={styles.medicineInstructions}>
                    {med.instructions}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Tests */}
        {visit.tests && visit.tests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investigations</Text>
            {visit.tests.map((test, index) => (
              <View key={index} style={styles.testCard}>
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Follow-up</Text>
            <View style={styles.followUpCard}>
              <Icon name="calendar-clock" size={24} color={colors.primary} />
              <View style={styles.followUpInfo}>
                <Text style={styles.followUpDate}>
                  {format(new Date(visit.followUp.scheduledDate), 'dd MMM yyyy')}
                </Text>
                {visit.followUp.notes && (
                  <Text style={styles.followUpNotes}>
                    {visit.followUp.notes}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleSharePrescription}>
          <Icon name="share-variant" size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.downloadButton]}
          onPress={handleDownloadPrescription}
          disabled={downloadingPdf}>
          {downloadingPdf ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="download" size={20} color="#fff" />
              <Text style={[styles.actionButtonText, {color: '#fff'}]}>
                Download PDF
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  visitDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  medicineCard: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  medicineDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  medicineInstructions: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  testCard: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  testInstructions: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  followUpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
  },
  followUpInfo: {
    marginLeft: 12,
    flex: 1,
  },
  followUpDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  followUpNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  actionBar: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  shareButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  downloadButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
});

export default VisitDetailScreen;
