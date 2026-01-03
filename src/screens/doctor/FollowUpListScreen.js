import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import {useAuth} from '../../context/AuthContext';
import api from '../../config/api';
import {format, isPast, isToday, isTomorrow} from 'date-fns';

const FollowUpListScreen = ({navigation}) => {
  const {user} = useAuth();
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, today, upcoming, completed

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      const response = await api.get(`/follow-ups/doctor/${user.userId}`);
      setFollowUps(response.data.data || []);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFollowUps();
  };

  const getFilteredFollowUps = () => {
    return followUps.filter(followUp => {
      const followUpDate = new Date(followUp.scheduledDate);
      switch (filter) {
        case 'today':
          return isToday(followUpDate) && followUp.status === 'SCHEDULED';
        case 'upcoming':
          return !isPast(followUpDate) && followUp.status === 'SCHEDULED';
        case 'completed':
          return followUp.status === 'COMPLETED';
        default:
          return true;
      }
    });
  };

  const getFollowUpStatus = followUp => {
    const followUpDate = new Date(followUp.scheduledDate);
    if (followUp.status === 'COMPLETED') return 'completed';
    if (followUp.status === 'CANCELLED') return 'cancelled';
    if (isPast(followUpDate)) return 'overdue';
    if (isToday(followUpDate)) return 'today';
    if (isTomorrow(followUpDate)) return 'tomorrow';
    return 'upcoming';
  };

  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.textSecondary;
      case 'overdue':
        return colors.error;
      case 'today':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const renderFollowUp = ({item}) => {
    const status = getFollowUpStatus(item);
    const statusColor = getStatusColor(status);

    return (
      <TouchableOpacity
        style={styles.followUpCard}
        onPress={() =>
          navigation.navigate('PatientDetail', {patient: {patientId: item.patientId}})
        }>
        <View style={[styles.statusIndicator, {backgroundColor: statusColor}]} />
        <View style={styles.followUpContent}>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <Text style={styles.followUpDate}>
            <Icon name="calendar" size={14} />{' '}
            {format(new Date(item.scheduledDate), 'dd MMM yyyy')}
          </Text>
          {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, {color: statusColor}]}>
              {status.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredFollowUps = getFilteredFollowUps();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FilterTab
          label="All"
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <FilterTab
          label="Today"
          active={filter === 'today'}
          onPress={() => setFilter('today')}
        />
        <FilterTab
          label="Upcoming"
          active={filter === 'upcoming'}
          onPress={() => setFilter('upcoming')}
        />
        <FilterTab
          label="Completed"
          active={filter === 'completed'}
          onPress={() => setFilter('completed')}
        />
      </View>

      {/* Follow-up List */}
      <FlatList
        data={filteredFollowUps}
        renderItem={renderFollowUp}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-blank" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No follow-ups found</Text>
          </View>
        }
      />
    </View>
  );
};

const FilterTab = ({label, active, onPress}) => (
  <TouchableOpacity
    style={[styles.filterTab, active && styles.filterTabActive]}
    onPress={onPress}>
    <Text style={[styles.filterText, active && styles.filterTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    elevation: 2,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  followUpCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    overflow: 'hidden',
  },
  statusIndicator: {
    width: 4,
  },
  followUpContent: {
    flex: 1,
    padding: 16,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  followUpDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  notes: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});

export default FollowUpListScreen;
