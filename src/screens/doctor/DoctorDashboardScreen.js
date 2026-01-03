import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import {useAuth} from '../../context/AuthContext';
import api from '../../config/api';
import {format} from 'date-fns';

const DoctorDashboardScreen = ({navigation}) => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todaysVisits: 0,
    upcomingFollowUps: 0,
    totalVisits: 0,
  });
  const [recentVisits, setRecentVisits] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats and recent visits
      const [patientsRes, visitsRes, followUpsRes] = await Promise.all([
        api.get(`/doctors/${user.userId}/patients`),
        api.get(`/visits/doctor/${user.userId}`),
        api.get(`/follow-ups/doctor/${user.userId}`),
      ]);

      const patients = patientsRes.data.data || [];
      const visits = visitsRes.data.data || [];
      const followUps = followUpsRes.data.data || [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysVisits = visits.filter(v => {
        const visitDate = new Date(v.visitDate);
        visitDate.setHours(0, 0, 0, 0);
        return visitDate.getTime() === today.getTime();
      });

      const upcomingFollowUps = followUps.filter(
        f => new Date(f.scheduledDate) > new Date() && f.status === 'SCHEDULED',
      );

      setStats({
        totalPatients: patients.length,
        todaysVisits: todaysVisits.length,
        upcomingFollowUps: upcomingFollowUps.length,
        totalVisits: visits.length,
      });

      setRecentVisits(visits.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, Dr. {user?.userName}!</Text>
        <Text style={styles.date}>{format(new Date(), 'EEEE, dd MMMM yyyy')}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="account-group"
          label="Total Patients"
          value={stats.totalPatients}
          color={colors.primary}
        />
        <StatCard
          icon="clipboard-text"
          label="Today's Visits"
          value={stats.todaysVisits}
          color={colors.success}
        />
        <StatCard
          icon="calendar-clock"
          label="Follow-ups"
          value={stats.upcomingFollowUps}
          color={colors.warning}
        />
        <StatCard
          icon="file-document"
          label="Total Visits"
          value={stats.totalVisits}
          color={colors.info}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <ActionButton
            icon="account-plus"
            label="Add Patient"
            onPress={() => navigation.navigate('Patients', {screen: 'AddPatient'})}
          />
          <ActionButton
            icon="note-plus"
            label="Create Visit"
            onPress={() => navigation.navigate('Patients', {screen: 'PatientList'})}
          />
          <ActionButton
            icon="calendar"
            label="Follow-ups"
            onPress={() => navigation.navigate('FollowUps')}
          />
        </View>
      </View>

      {/* Recent Visits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Visits</Text>
        {recentVisits.length === 0 ? (
          <Text style={styles.emptyText}>No recent visits</Text>
        ) : (
          recentVisits.map(visit => (
            <VisitCard
              key={visit.id}
              visit={visit}
              onPress={() =>
                navigation.navigate('VisitDetail', {visitId: visit.id})
              }
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const StatCard = ({icon, label, value, color}) => (
  <View style={[styles.statCard, {borderLeftColor: color}]}>
    <Icon name={icon} size={24} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActionButton = ({icon, label, onPress}) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Icon name={icon} size={28} color={colors.primary} />
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const VisitCard = ({visit, onPress}) => (
  <TouchableOpacity style={styles.visitCard} onPress={onPress}>
    <View style={styles.visitHeader}>
      <Text style={styles.patientName}>{visit.patientName}</Text>
      <Text style={styles.visitDate}>
        {format(new Date(visit.visitDate), 'dd MMM')}
      </Text>
    </View>
    <Text style={styles.complaint} numberOfLines={2}>
      {visit.chiefComplaint}
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
  header: {
    padding: 20,
    backgroundColor: colors.primary,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    margin: '1%',
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    minWidth: 100,
  },
  actionLabel: {
    fontSize: 12,
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  visitCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  visitDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  complaint: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
});

export default DoctorDashboardScreen;
