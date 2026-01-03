import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
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
      const data = response.data.data || [];
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterPatients = () => {
    if (searchQuery.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        p =>
          p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.mobileNumber.includes(searchQuery),
      );
      setFilteredPatients(filtered);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPatients();
  };

  const renderPatientItem = ({item}) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => navigation.navigate('PatientDetail', {patient: item})}>
      <View style={styles.patientAvatar}>
        <Icon name="account" size={32} color={colors.primary} />
      </View>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.fullName}</Text>
        <Text style={styles.patientDetails}>
          {item.gender}, {item.age} years
        </Text>
        <Text style={styles.patientMobile}>{item.mobileNumber}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={colors.textSecondary} />
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
        <Icon name="magnify" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or mobile"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Patient List */}
      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
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
        <Icon name="plus" size={24} color="#fff" />
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
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  patientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  patientMobile: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
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
  },
});

export default PatientListScreen;
