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
import {format, isToday, isPast} from 'date-fns';

const FollowUpListScreen = () => {
  const {user} = useAuth();
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, today, upcoming, overdue

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
    let filtered = followUps;
    const now = new Date();

    switch (filter) {
      case 'today':
        filtered = followUps.filter(f => isToday(new Date(f.scheduledDate)));
        break;
      case 'upcoming':
        filtered = followUps.filter(
          f => new Date(f.scheduledDate) > now && f.status === 'SCHEDULED',
        );
        break;
      case 'overdue':
        filtered = followUps.filter(
          f => isPast(new Date(f.scheduledDate)) && f.status === 'SCHEDULED',
        );
        break;
      default:
        break;
    }

    return filtered;
  };

  const renderFollowUpItem = ({item}) => {
    const date = new Date(item.scheduledDate);
    const isOverdue = isPast(date) && item.status === 'SCHEDULED';
    const isTodayItem = isToday(date);

    return (
      <TouchableOpacity style={styles.followUpCard}>
        <View style={styles.followUpHeader}>
          <View style={styles.followUpInfo}>
            <Text style={styles.patientName}>{item.patientName}</Text>
            <View style={styles.dateContainer}>
              <Icon name="calendar" size={16} color={colors.textSecondary} />
              <Text style={styles.dateText}>
                {format(date, 'dd MMM yyyy, hh:mm a')}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              isOverdue && styles.statusOverdue,
              isTodayItem && styles.statusToday,
            ]}>
            <Text style={styles.statusText}>
              {isOverdue ? 'Overdue' : isTodayItem ? 'Today' : item.status}
            </Text>
          </View>
        </View>
        {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const filteredFollowUps = getFilteredFollowUps();

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}>
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive,
            ]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'today' && styles.filterTabActive]}
          onPress={() => setFilter('today')}>
          <Text
            style={[
              styles.filterText,
              filter === 'today' && styles.filterTextActive,
            ]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'upcoming' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('upcoming')}>
          <Text
            style={[
              styles.filterText,
              filter === 'upcoming' && styles.filterTextActive,
            ]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'overdue' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('overdue')}>
          <Text
            style={[
              styles.filterText,
              filter === 'overdue' && styles.filterTextActive,
            ]}>
            Overdue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Follow-up List */}
      <FlatList
        data={filteredFollowUps}
        renderItem={renderFollowUpItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-clock" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No follow-ups found</Text>
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
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
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  followUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  followUpInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statusBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusToday: {
    backgroundColor: colors.warning,
  },
  statusOverdue: {
    backgroundColor: colors.error,
  },
  statusText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  notes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
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
