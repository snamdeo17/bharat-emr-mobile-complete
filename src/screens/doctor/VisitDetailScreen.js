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
      Alert.alert('Error', 'Failed to fetch visit details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPrescription = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/visits/${visitId}/prescription/pdf`, {
        responseType: 'blob',
      });
      
      // Handle PDF download/share
      Alert.alert('Success', 'Prescription downloaded');
    } catch (error) {
      Alert.alert('Error', 'Failed to download prescription');
    } finally {
      setDownloading(false);
    }
  };

  const handleSharePrescription = async () => {
    try {
      await Share.share({
        message: `Prescription for visit on ${format(new Date(visit.visitDate), 'dd MMM yyyy')}`,
      });
    } catch (error) {
      console.error('Share error:', error);
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Visit Header */}
        <View style={styles.header}>
          <Text style={styles.date}>
            {format(new Date(visit.visitDate), 'EEEE, dd MMMM yyyy')}
          </Text>
          <Text style={styles.patientName}>{visit.patientName}</Text>
        </View>

        {/* Chief Complaint */}
        <Section title="Chief Complaint" icon="alert-circle">
          <Text style={styles.content}>{visit.chiefComplaint}</Text>
        </Section>

        {/* Present Illness */}
        {visit.presentIllness && (
          <Section title="Present Illness" icon="file-document">
            <Text style={styles.content}>{visit.presentIllness}</Text>
          </Section>
        )}

        {/* Clinical Notes */}
        {visit.clinicalNotes && (
          <Section title="Clinical Notes" icon="stethoscope">
            <Text style={styles.content}>{visit.clinicalNotes}</Text>
          </Section>
        )}

        {/* Diagnosis */}
        {visit.diagnosis && (
          <Section title="Diagnosis" icon="medical-bag">
            <Text style={styles.content}>{visit.diagnosis}</Text>
          </Section>
        )}

        {/* Medicines */}
        {visit.medicines && visit.medicines.length > 0 && (
          <Section title="Prescription" icon="pill">
            {visit.medicines.map((medicine, index) => (
              <View key={index} style={styles.medicineCard}>
                <Text style={styles.medicineName}>{medicine.medicineName}</Text>
                <Text style={styles.medicineDetail}>
                  {medicine.dosage} | {medicine.frequency}
                </Text>
                <Text style={styles.medicineDetail}>Duration: {medicine.duration}</Text>
                {medicine.instructions && (
                  <Text style={styles.instructions}>{medicine.instructions}</Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* Tests */}
        {visit.tests && visit.tests.length > 0 && (
          <Section title="Laboratory Tests" icon="flask">
            {visit.tests.map((test, index) => (
              <View key={index} style={styles.testCard}>
                <Text style={styles.testName}>{test.testName}</Text>
                {test.instructions && (
                  <Text style={styles.testInstructions}>{test.instructions}</Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* Advice */}
        {visit.advice && (
          <Section title="Advice" icon="lightbulb">
            <Text style={styles.content}>{visit.advice}</Text>
          </Section>
        )}

        {/* Follow-up */}
        {visit.followUp && (
          <Section title="Follow-up" icon="calendar-clock">
            <Text style={styles.followUpDate}>
              {format(new Date(visit.followUp.scheduledDate), 'dd MMM yyyy')}
            </Text>
            {visit.followUp.notes && (
              <Text style={styles.content}>{visit.followUp.notes}</Text>
            )}
          </Section>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDownloadPrescription}
          disabled={downloading}>
          {downloading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Icon name="download" size={24} color={colors.primary} />
              <Text style={styles.actionText}>Download</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleSharePrescription}>
          <Icon name="share-variant" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Section = ({title, icon, children}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Icon name={icon} size={20} color={colors.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
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
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
  },
  date: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  content: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  medicineCard: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  medicineDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  instructions: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  testCard: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  testInstructions: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  followUpDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 8,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
});

export default VisitDetailScreen;
