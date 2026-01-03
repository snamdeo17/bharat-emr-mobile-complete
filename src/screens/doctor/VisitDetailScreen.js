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
      console.error('Error fetching visit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      Alert.alert('Success', 'Prescription PDF download started');
      // PDF download logic here
    } catch (error) {
      Alert.alert('Error', 'Failed to download PDF');
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
        {/* Header */}
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
            <Text style={styles.sectionTitle}>Clinical Notes</Text>
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

        {/* Prescription */}
        {visit.medicines && visit.medicines.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Prescription</Text>
              <TouchableOpacity onPress={handleDownloadPDF}>
                <Icon name="download" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {visit.medicines.map((medicine, index) => (
              <View key={index} style={styles.medicineCard}>
                <Text style={styles.medicineName}>
                  {index + 1}. {medicine.medicineName}
                </Text>
                <View style={styles.medicineDetails}>
                  <Text style={styles.medicineDetail}>
                    <Icon name="pill" size={14} /> {medicine.dosage} •{' '}
                    {medicine.frequency}
                  </Text>
                  <Text style={styles.medicineDetail}>
                    <Icon name="calendar" size={14} /> {medicine.duration}
                  </Text>
                  {medicine.instructions && (
                    <Text style={styles.medicineInstructions}>
                      {medicine.instructions}
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
            <Text style={styles.sectionTitle}>Tests Recommended</Text>
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
      </ScrollView>
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
    color: colors.textSecondary,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  visitDate: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
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
    marginBottom: 8,
  },
  medicineDetails: {
    marginLeft: 20,
  },
  medicineDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  medicineInstructions: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
    fontStyle: 'italic',
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
});

export default VisitDetailScreen;
