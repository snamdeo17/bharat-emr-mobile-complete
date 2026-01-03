import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import {useAuth} from '../../context/AuthContext';
import api from '../../config/api';

const PatientListScreen = ({navigation}) => {
  const {user} = useAuth();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchQuery, patients]);

  const fetchPatients = async () => {
    try {
      const response = await api.get(`/doctors/${user.userId}/patients`);
      const patientsData = response.data.data || [];
      setPatients(patientsData);
      setFilteredPatients(patientsData);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterPatients = () => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(
      patient =>
        patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.mobileNumber.includes(searchQuery) ||
        patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredPatients(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPatients();
  };

  const renderPatientCard = ({item}) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => navigation.navigate('PatientDetail', {patient: item})}>
      <View style={styles.patientHeader}>
        <View style={styles.avatar}>
          <Icon name="account" size={32} color="#fff" />
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.fullName}</Text>
          <Text style={styles.patientId}>ID: {item.patientId}</Text>
          <View style={styles.patientMeta}>
            <Icon name="phone" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.mobileNumber}</Text>
          </View>
        </View>
        <View style={styles.patientStats}>
          <Text style={styles.statsValue}>{item.age}</Text>
          <Text style={styles.statsLabel}>Years</Text>
        </View>
      </View>
      <View style={styles.patientFooter}>
        <View style={styles.tag}>
          <Icon name="gender-male-female" size={14} color={colors.primary} />
          <Text style={styles.tagText}>{item.gender}</Text>
        </View>
        {item.lastVisit && (
          <Text style={styles.lastVisit}>
            Last visit: {new Date(item.lastVisit).toLocaleDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients by name, phone, or ID"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Patient List */}
      <FlatList
        data={filteredPatients}
        renderItem={renderPatientCard}
        keyExtractor={item => item.patientId}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-off" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No patients found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search' : 'Add your first patient'}
            </Text>
          </View>
        }
      />

      {/* Add Patient FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddPatient')}>
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  patientHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  patientId: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  patientMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  patientStats: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  patientFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  lastVisit: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default PatientListScreen;
