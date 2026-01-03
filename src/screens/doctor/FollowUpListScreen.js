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
import {format, isPast, isToday} from 'date-fns';

const FollowUpListScreen = ({navigation}) => {
  const {user} = useAuth();
  const [followUps, setFollowUps] = useState([]);
  const [filter, setFilter] = useState('upcoming'); // upcoming, today, all
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    const now = new Date();

    switch (filter) {
      case 'today':
        return followUps.filter(f => isToday(new Date(f.scheduledDate)));
      case 'upcoming':
        return followUps.filter(
          f =>
            new Date(f.scheduledDate) > now && f.status === 'SCHEDULED',
        );
      case 'all':
        return followUps;
      default:
        return followUps;
    }
  };

  const handleComplete = async followUpId => {
    try {
      await api.post(`/follow-ups/${followUpId}/complete`);
      fetchFollowUps();
    } catch (error) {
      console.error('Error completing follow-up:', error);
    }
  };

  const renderFollowUpCard = ({item}) => {
    const scheduledDate = new Date(item.scheduledDate);
    const isOverdue = isPast(scheduledDate) && item.status === 'SCHEDULED';

    return (
      <View
        style={[
          styles.followUpCard,
          isOverdue && styles.overdueCard,
          item.status === 'COMPLETED' && styles.completedCard,
        ]}>
        <View style={styles.cardHeader}>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{item.patientName}</Text>
            <Text style={styles.date}>
              {format(scheduledDate, 'dd MMM yyyy, hh:mm a')}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              item.status === 'COMPLETED' && styles.completedBadge,
              isOverdue && styles.overdueBadge,
            ]}>
            <Text
              style={[
                styles.statusText,
                item.status === 'COMPLETED' && styles.completedText,
                isOverdue && styles.overdueText,
              ]}>
              {item.status === 'COMPLETED'
                ? 'Completed'
                : isOverdue
                ? 'Overdue'
                : 'Scheduled'}
            </Text>
          </View>
        </View>

        {item.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionLink}
            onPress={() =>
              navigation.navigate('PatientDetail', {
                patient: {patientId: item.patientId},
              })
            }>
            <Icon name="account" size={16} color={colors.primary} />
            <Text style={styles.actionLinkText}>View Patient</Text>
          </TouchableOpacity>

          {item.status === 'SCHEDULED' && (
            <TouchableOpacity
              style={styles.actionLink}
              onPress={() => handleComplete(item.id)}>
              <Icon name="check-circle" size={16} color={colors.success} />
              <Text style={[styles.actionLinkText, {color: colors.success}]}>
                Mark Complete
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

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
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'today' && styles.activeFilterTab,
          ]}
          onPress={() => setFilter('today')}>
          <Text
            style={[
              styles.filterText,
              filter === 'today' && styles.activeFilterText,
            ]}>
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'upcoming' && styles.activeFilterTab,
          ]}
          onPress={() => setFilter('upcoming')}>
          <Text
            style={[
              styles.filterText,
              filter === 'upcoming' && styles.activeFilterText,
            ]}>
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'all' && styles.activeFilterTab,
          ]}
          onPress={() => setFilter('all')}>
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText,
            ]}>
            All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Follow-up List */}
      <FlatList
        data={getFilteredFollowUps()}
        renderItem={renderFollowUpCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-clock" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No follow-ups</Text>
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
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  activeFilterTab: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeFilterText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  followUpCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  completedCard: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  completedBadge: {
    backgroundColor: '#d4edda',
  },
  overdueBadge: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  completedText: {
    color: colors.success,
  },
  overdueText: {
    color: colors.error,
  },
  notes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionLinkText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
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
