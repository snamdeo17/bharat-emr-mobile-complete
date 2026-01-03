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
import {format, isToday, isFuture} from 'date-fns';

const FollowUpListScreen = ({navigation}) => {
  const {user} = useAuth();
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('ALL'); // ALL, TODAY, UPCOMING

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

  const getFilteredFollowUps = () => {
    return followUps.filter(followUp => {
      const date = new Date(followUp.scheduledDate);
      if (filter === 'TODAY') return isToday(date);
      if (filter === 'UPCOMING') return isFuture(date) && !isToday(date);
      return true;
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFollowUps();
  };

  const renderFollowUpCard = ({item}) => {
    const date = new Date(item.scheduledDate);
    const isOverdue = date < new Date() && item.status === 'SCHEDULED';

    return (
      <TouchableOpacity
        style={[styles.card, isOverdue && styles.overdueCard]}
        onPress={() =>
          navigation.navigate('PatientDetail', {patient: item.patient})
        }>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.patientName}>{item.patientName}</Text>
            <Text style={styles.patientId}>ID: {item.patientId}</Text>
          </View>
          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.dateContainer}>
          <Icon name="calendar" size={16} color={colors.primary} />
          <Text style={[styles.dateText, isOverdue && styles.overdueText]}>
            {format(date, 'dd MMM yyyy, h:mm a')}
          </Text>
        </View>

        {item.notes && <Text style={styles.notes} numberOfLines={2}>{item.notes}</Text>}

        {isOverdue && (
          <View style={styles.overdueLabel}>
            <Icon name="alert" size={16} color={colors.error} />
            <Text style={styles.overdueText}>Overdue</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getStatusStyle = status => {
    switch (status) {
      case 'COMPLETED':
        return {backgroundColor: colors.success};
      case 'CANCELLED':
        return {backgroundColor: colors.error};
      default:
        return {backgroundColor: colors.warning};
    }
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
          style={[styles.filterTab, filter === 'ALL' && styles.activeTab]}
          onPress={() => setFilter('ALL')}>
          <Text style={[styles.filterText, filter === 'ALL' && styles.activeText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'TODAY' && styles.activeTab]}
          onPress={() => setFilter('TODAY')}>
          <Text style={[styles.filterText, filter === 'TODAY' && styles.activeText]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'UPCOMING' && styles.activeTab]}
          onPress={() => setFilter('UPCOMING')}>
          <Text
            style={[styles.filterText, filter === 'UPCOMING' && styles.activeText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>

      {/* Follow-up List */}
      <FlatList
        data={getFilteredFollowUps()}
        renderItem={renderFollowUpCard}
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
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeText: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  overdueCard: {
    borderLeftColor: colors.error,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  patientId: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  notes: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  overdueLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  overdueText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});

export default FollowUpListScreen;
