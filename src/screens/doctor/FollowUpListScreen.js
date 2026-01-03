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
import {format, isToday, isTomorrow, isPast} from 'date-fns';

const FollowUpListScreen = () => {
  const {user} = useAuth();
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('upcoming'); // upcoming, today, all

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
    if (filter === 'today') {
      return followUps.filter(f => isToday(new Date(f.scheduledDate)));
    } else if (filter === 'upcoming') {
      return followUps.filter(
        f => !isPast(new Date(f.scheduledDate)) && f.status === 'SCHEDULED',
      );
    }
    return followUps;
  };

  const getDateBadge = scheduledDate => {
    const date = new Date(scheduledDate);
    if (isToday(date)) return {text: 'Today', color: colors.success};
    if (isTomorrow(date)) return {text: 'Tomorrow', color: colors.warning};
    if (isPast(date)) return {text: 'Overdue', color: colors.error};
    return {text: format(date, 'dd MMM'), color: colors.primary};
  };

  const renderFollowUpCard = ({item}) => {
    const badge = getDateBadge(item.scheduledDate);

    return (
      <View style={styles.followUpCard}>
        <View style={styles.cardHeader}>
          <View style={styles.patientInfo}>
            <Icon name="account" size={20} color={colors.text} />
            <Text style={styles.patientName}>{item.patientName}</Text>
          </View>
          <View style={[styles.badge, {backgroundColor: badge.color}]}>
            <Text style={styles.badgeText}>{badge.text}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              {format(new Date(item.scheduledDate), 'dd MMM yyyy, hh:mm a')}
            </Text>
          </View>

          {item.notes && (
            <View style={styles.infoRow}>
              <Icon name="note-text" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText} numberOfLines={2}>
                {item.notes}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  const getStatusStyle = status => {
    switch (status) {
      case 'SCHEDULED':
        return {backgroundColor: colors.info};
      case 'COMPLETED':
        return {backgroundColor: colors.success};
      case 'CANCELLED':
        return {backgroundColor: colors.error};
      default:
        return {backgroundColor: colors.textSecondary};
    }
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
          style={[
            styles.filterTab,
            filter === 'today' && styles.filterTabActive,
          ]}
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
            filter === 'all' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('all')}>
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive,
            ]}>
            All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Follow-up List */}
      <FlatList
        data={filteredFollowUps}
        renderItem={renderFollowUpCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent=(
          <View style={styles.emptyContainer}>
            <Icon
              name="calendar-blank"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>No follow-ups found</Text>
          </View>
        )
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  followUpCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
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
