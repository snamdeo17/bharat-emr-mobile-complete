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

const PatientDashboardScreen = ({navigation}) => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [recentVisits, setRecentVisits] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [dashboardRes, visitsRes] = await Promise.all([
        api.get(`/patients/dashboard/${user.userId}`),
        api.get(`/patients/${user.userId}/visits`),
      ]);

      setDashboard(dashboardRes.data.data);
      setRecentVisits(visitsRes.data.data?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
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
        <View>
          <Text style={styles.greeting}>Hello, {user?.userName}!</Text>
          <Text style={styles.subtitle}>Here's your health summary</Text>
        </View>
        <View style={styles.avatar}>
          <Icon name="account" size={40} color="#fff" />
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="clipboard-text"
          label="Total Visits"
          value={dashboard?.totalVisits || 0}
          color={colors.secondary}
        />
        <StatCard
          icon="calendar-clock"
          label="Upcoming Follow-ups"
          value={dashboard?.upcomingFollowUps || 0}
          color={colors.warning}
        />
      </View>

      {/* Health Info */}
      {dashboard?.patient && (
        <View style={styles.healthCard}>
          <Text style={styles.sectionTitle}>Health Information</Text>
          <View style={styles.healthInfo}>
            <HealthItem icon="calendar" label="Age" value={`${dashboard.patient.age} years`} />
            <HealthItem
              icon="gender-male-female"
              label="Gender"
              value={dashboard.patient.gender}
            />
            {dashboard.patient.bloodGroup && (
              <HealthItem
                icon="water"
                label="Blood Group"
                value={dashboard.patient.bloodGroup}
              />
            )}
          </View>
          {dashboard.patient.allergies && (
            <View style={styles.allergyWarning}>
              <Icon name="alert" size={20} color={colors.warning} />
              <Text style={styles.allergyText}>
                Allergies: {dashboard.patient.allergies}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Recent Visits */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Visits</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Visits', {screen: 'VisitHistory'})}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentVisits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="calendar-blank" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No visits yet</Text>
          </View>
        ) : (
          recentVisits.map(visit => (
            <VisitCard
              key={visit.id}
              visit={visit}
              onPress={() =>
                navigation.navigate('PrescriptionView', {visitId: visit.id})
              }
            />
          ))
        )}
      </View>

      {/* Next Follow-up */}
      {dashboard?.nextFollowUp && (
        <View style={styles.followUpCard}>
          <View style={styles.followUpHeader}>
            <Icon name="calendar-check" size={24} color={colors.secondary} />
            <Text style={styles.followUpTitle}>Next Follow-up</Text>
          </View>
          <Text style={styles.followUpDate}>
            {format(new Date(dashboard.nextFollowUp.scheduledDate), 'EEEE, dd MMMM yyyy')}
          </Text>
          <Text style={styles.followUpDoctor}>Dr. {dashboard.nextFollowUp.doctorName}</Text>
          {dashboard.nextFollowUp.notes && (
            <Text style={styles.followUpNotes}>{dashboard.nextFollowUp.notes}</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const StatCard = ({icon, label, value, color}) => (
  <View style={[styles.statCard, {borderTopColor: color}]}>
    <Icon name={icon} size={32} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const HealthItem = ({icon, label, value}) => (
  <View style={styles.healthItem}>
    <Icon name={icon} size={18} color={colors.secondary} />
    <Text style={styles.healthLabel}>{label}</Text>
    <Text style={styles.healthValue}>{value}</Text>
  </View>
);

const VisitCard = ({visit, onPress}) => (
  <TouchableOpacity style={styles.visitCard} onPress={onPress}>
    <View style={styles.visitHeader}>
      <Text style={styles.visitDate}>
        {format(new Date(visit.visitDate), 'dd MMM yyyy')}
      </Text>
      <Icon name="chevron-right" size={24} color={colors.textSecondary} />
    </View>
    <Text style={styles.doctorName}>Dr. {visit.doctorName}</Text>
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
    backgroundColor: colors.secondary,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderTopWidth: 4,
    elevation: 2,
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
    textAlign: 'center',
  },
  healthCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  healthInfo: {
    marginTop: 12,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  healthLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  healthValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  allergyWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  allergyText: {
    fontSize: 14,
    color: colors.warning,
    marginLeft: 8,
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
  },
  visitCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  visitDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  complaint: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  followUpCard: {
    backgroundColor: '#e0f2f1',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  followUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  followUpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  followUpDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 4,
  },
  followUpDoctor: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  followUpNotes: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
});

export default PatientDashboardScreen;
