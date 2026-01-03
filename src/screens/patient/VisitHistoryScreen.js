import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import {useAuth} from '../../context/AuthContext';
import api from '../../config/api';
import {format} from 'date-fns';

const VisitHistoryScreen = ({navigation}) => {
  const {user} = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await api.get(`/patients/${user.userId}/visits`);
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

  const renderVisitCard = ({item}) => (
    <TouchableOpacity
      style={styles.visitCard}
      onPress={() => navigation.navigate('PrescriptionView', {visitId: item.id})}>
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.day}>
            {format(new Date(item.visitDate), 'd')}
          </Text>
          <Text style={styles.month}>
            {format(new Date(item.visitDate), 'MMM')}
          </Text>
        </View>
        <View style={styles.visitInfo}>
          <Text style={styles.doctorName}>Dr. {item.doctorName}</Text>
          <Text style={styles.specialization}>{item.specialization}</Text>
          <Text style={styles.complaint} numberOfLines={2}>
            {item.chiefComplaint}
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color={colors.textSecondary} />
      </View>

      {item.diagnosis && (
        <View style={styles.diagnosisContainer}>
          <Icon name="stethoscope" size={16} color={colors.secondary} />
          <Text style={styles.diagnosis} numberOfLines={1}>
            {item.diagnosis}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        {item.medicines && item.medicines.length > 0 && (
          <View style={styles.tag}>
            <Icon name="pill" size={14} color={colors.primary} />
            <Text style={styles.tagText}>
              {item.medicines.length} Medicine(s)
            </Text>
          </View>
        )}
        {item.tests && item.tests.length > 0 && (
          <View style={styles.tag}>
            <Icon name="flask" size={14} color={colors.warning} />
            <Text style={styles.tagText}>{item.tests.length} Test(s)</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={visits}
        renderItem={renderVisitCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-blank" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No visits recorded</Text>
            <Text style={styles.emptySubtext}>
              Your visit history will appear here
            </Text>
          </View>
        }
      />
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
  listContent: {
    padding: 16,
  },
  visitCard: {
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
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dateContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  day: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  month: {
    fontSize: 12,
    color: '#fff',
    textTransform: 'uppercase',
  },
  visitInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  specialization: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  complaint: {
    fontSize: 14,
    color: colors.text,
  },
  diagnosisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  diagnosis: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
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
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '600',
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
});

export default VisitHistoryScreen;
