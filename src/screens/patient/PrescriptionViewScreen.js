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

const PrescriptionViewScreen = ({route}) => {
  const {visitId} = route.params;
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchVisit();
  }, []);

  const fetchVisit = async () => {
    try {
      const response = await api.get(`/visits/${visitId}`);
      setVisit(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch prescription');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Implementation for PDF download
      await api.get(`/visits/${visitId}/prescription/pdf`);
      Alert.alert('Success', 'Prescription downloaded');
    } catch (error) {
      Alert.alert('Error', 'Failed to download prescription');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Prescription from Dr. ${visit.doctorName}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.clinicName}>{visit.clinicName}</Text>
              <Text style={styles.doctorName}>Dr. {visit.doctorName}</Text>
              <Text style={styles.specialization}>{visit.specialization}</Text>
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>
                {format(new Date(visit.visitDate), 'dd/MM/yyyy')}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.patientInfo}>
            Patient: {visit.patientName} | {visit.patientAge} yrs | {visit.patientGender}
          </Text>
        </View>

        {/* Complaint & Diagnosis */}
        <View style={styles.section}>
          <SectionTitle icon="alert-circle" title="Chief Complaint" />
          <Text style={styles.content}>{visit.chiefComplaint}</Text>
        </View>

        {visit.diagnosis && (
          <View style={styles.section}>
            <SectionTitle icon="medical-bag" title="Diagnosis" />
            <Text style={styles.content}>{visit.diagnosis}</Text>
          </View>
        )}

        {/* Prescription */}
        {visit.medicines && visit.medicines.length > 0 && (
          <View style={styles.section}>
            <SectionTitle icon="pill" title="Prescription" />
            {visit.medicines.map((medicine, index) => (
              <View key={index} style={styles.medicineCard}>
                <View style={styles.medicineNumber}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>
                <View style={styles.medicineDetails}>
                  <Text style={styles.medicineName}>{medicine.medicineName}</Text>
                  <Text style={styles.medicineInfo}>
                    {medicine.dosage} • {medicine.frequency}
                  </Text>
                  <Text style={styles.medicineInfo}>
                    Duration: {medicine.duration}
                  </Text>
                  {medicine.instructions && (
                    <Text style={styles.instructions}>
                      📝 {medicine.instructions}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tests */}
        {visit.tests && visit.tests.length > 0 && (
          <View style={styles.section}>
            <SectionTitle icon="flask" title="Laboratory Tests" />
            {visit.tests.map((test, index) => (
              <View key={index} style={styles.testCard}>
                <Icon name="test-tube" size={20} color={colors.warning} />
                <View style={styles.testDetails}>
                  <Text style={styles.testName}>{test.testName}</Text>
                  {test.instructions && (
                    <Text style={styles.testInstructions}>{test.instructions}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Advice */}
        {visit.advice && (
          <View style={styles.section}>
            <SectionTitle icon="lightbulb" title="Advice" />
            <Text style={styles.content}>{visit.advice}</Text>
          </View>
        )}

        {/* Follow-up */}
        {visit.followUp && (
          <View style={styles.followUpSection}>
            <Icon name="calendar-check" size={24} color={colors.secondary} />
            <View style={styles.followUpInfo}>
              <Text style={styles.followUpLabel}>Next Follow-up</Text>
              <Text style={styles.followUpDate}>
                {format(new Date(visit.followUp.scheduledDate), 'dd MMM yyyy')}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDownload}
          disabled={downloading}>
          {downloading ? (
            <ActivityIndicator size="small" color={colors.secondary} />
          ) : (
            <>
              <Icon name="download" size={24} color={colors.secondary} />
              <Text style={styles.actionText}>Download PDF</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Icon name="share-variant" size={24} color={colors.secondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SectionTitle = ({icon, title}) => (
  <View style={styles.sectionHeader}>
    <Icon name={icon} size={20} color={colors.secondary} />
    <Text style={styles.sectionTitle}>{title}</Text>
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
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
    marginTop: 4,
  },
  specialization: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dateBox: {
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  patientInfo: {
    fontSize: 14,
    color: colors.textSecondary,
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
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  medicineNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  medicineInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  instructions: {
    fontSize: 12,
    color: colors.text,
    fontStyle: 'italic',
    marginTop: 4,
  },
  testCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  testDetails: {
    marginLeft: 12,
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  testInstructions: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  followUpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2f1',
    padding: 16,
    marginTop: 8,
  },
  followUpInfo: {
    marginLeft: 12,
  },
  followUpLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  followUpDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
    marginTop: 2,
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
    color: colors.secondary,
    marginLeft: 8,
  },
});

export default PrescriptionViewScreen;
