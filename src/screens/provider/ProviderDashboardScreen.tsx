import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Ticket, Clock, Users, TrendingUp } from 'lucide-react-native';
import { AppDispatch, RootState } from '../../store';
import { fetchProviderStatsThunk, fetchProviderQueueListThunk, fetchMyVenueThunk } from '../../store/slices/providerSlice';
import { ProviderTabBar, getProviderTabBarTotalOffset, ProviderTabKey } from '../../components/provider/ProviderTabBar';
import type { ProviderDashboardScreenProps } from '../../navigation/types';
import { homeSpacing, homeTheme } from '../../theme/homeTheme';

export function ProviderDashboardScreen({ navigation }: ProviderDashboardScreenProps) {
  const insets = useSafeAreaInsets();
  const tabOffset = getProviderTabBarTotalOffset(insets.bottom);
  
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { stats, activeQueue, loading, myProviderDetails } = useSelector((state: RootState) => state.provider);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    // Fetch the venue details first if we don't have them
    let venueId = myProviderDetails?.id;
    if (!venueId) {
      const res = await dispatch(fetchMyVenueThunk());
      if (fetchMyVenueThunk.fulfilled.match(res)) {
        venueId = res.payload.id;
      }
    }

    if (venueId) {
      await Promise.all([
        dispatch(fetchProviderStatsThunk(venueId)),
        dispatch(fetchProviderQueueListThunk(venueId))
      ]);
    }
  }, [dispatch, myProviderDetails?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const onTabPress = useCallback(
    (tab: ProviderTabKey) => {
      if (tab === 'dashboard') return;
      if (tab === 'queue') navigation.navigate('QueueManagement');
      if (tab === 'services') navigation.navigate('ServiceManager');
      if (tab === 'settings') navigation.navigate('ProviderSettings');
    },
    [navigation]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f6f9" />
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingBottom: tabOffset + 24 }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[homeTheme.primary]} />
          }
        >
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.providerName}>{myProviderDetails?.name || 'Your Venue'}</Text>
          </View>

          {loading && !refreshing ? (
            <ActivityIndicator size="large" color={homeTheme.primary} style={{ marginTop: 40 }} />
          ) : (
            <>
              <View style={styles.statsGrid}>
                <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <Text style={styles.statLabel}>Tokens Served</Text>
                    <View style={[styles.iconWrapper, { backgroundColor: '#dcfce7' }]}>
                      <Ticket size={16} color="#16a34a" />
                    </View>
                  </View>
                  <Text style={styles.statValue}>{stats?.tokensServed || 0}</Text>
                </LinearGradient>

                <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <Text style={styles.statLabel}>Avg Wait</Text>
                    <View style={[styles.iconWrapper, { backgroundColor: '#e0e7ff' }]}>
                      <Clock size={16} color="#4f46e5" />
                    </View>
                  </View>
                  <Text style={styles.statValue}>
                    {stats?.avgWaitMinutes 
                      ? (stats.avgWaitMinutes < 60 
                          ? `${stats.avgWaitMinutes}m` 
                          : `${Math.floor(stats.avgWaitMinutes / 60)}h ${stats.avgWaitMinutes % 60 > 0 ? `${stats.avgWaitMinutes % 60}m` : ''}`.trim())
                      : '--'}
                  </Text>
                </LinearGradient>

                <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <Text style={styles.statLabel}>Current Queue</Text>
                    <View style={[styles.iconWrapper, { backgroundColor: '#ffedd5' }]}>
                      <Users size={16} color="#ea580c" />
                    </View>
                  </View>
                  <Text style={styles.statValue}>{activeQueue.length}</Text>
                </LinearGradient>

                <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <Text style={styles.statLabel}>Peak Hour</Text>
                    <View style={[styles.iconWrapper, { backgroundColor: '#fce7f3' }]}>
                      <TrendingUp size={16} color="#db2777" />
                    </View>
                  </View>
                  <Text style={styles.statValue}>{stats?.peakHour || '--'}</Text>
                </LinearGradient>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Queue Snapshot</Text>
                  <Text style={styles.sectionAction} onPress={() => onTabPress('queue')}>View All</Text>
                </View>
                
                {activeQueue.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Users size={32} color="#cbd5e1" style={{ marginBottom: 8 }} />
                    <Text style={styles.emptyText}>No customers waiting.</Text>
                  </View>
                ) : (
                  <View style={styles.queueContainer}>
                    {activeQueue.slice(0, 3).map((booking, index) => (
                      <View key={booking.id} style={[styles.queueItem, index === 0 && styles.queueItemActive]}>
                        <View style={styles.queueItemLeft}>
                          <View style={[styles.tokenBadge, index === 0 && styles.tokenBadgeActive]}>
                            <Text style={[styles.tokenNum, index === 0 && styles.tokenNumActive]}>
                              #{booking.tokenNumber}
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.serviceName}>{booking.subtitle}</Text>
                            <Text style={styles.userName}>{String(booking?.userId || 'User').substring(0, 8)}...</Text>
                          </View>
                        </View>
                        <View style={[styles.statusBadge, index === 0 && styles.statusBadgeActive]}>
                          <Text style={[styles.queueStatus, index === 0 && styles.queueStatusActive]}>
                            {index === 0 ? 'NEXT' : 'WAITING'}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>
        <ProviderTabBar activeTab="dashboard" onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f6f9' },
  content: { flex: 1, position: 'relative' },
  scroll: { paddingHorizontal: homeSpacing.screenHorizontal, paddingTop: 16 },
  header: { marginBottom: 24 },
  greeting: { fontSize: 16, fontWeight: '600', color: homeTheme.textSecondary, marginBottom: 4 },
  providerName: { fontSize: 32, fontWeight: '800', color: homeTheme.text, letterSpacing: -1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  statCard: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: { fontSize: 13, fontWeight: '600', color: homeTheme.textSecondary },
  statValue: { fontSize: 28, fontWeight: '800', color: homeTheme.text, letterSpacing: -0.5 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: homeTheme.text },
  sectionAction: { fontSize: 14, fontWeight: '600', color: homeTheme.primary },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  emptyText: { color: '#94a3b8', fontWeight: '500', fontSize: 14 },
  queueContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  queueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  queueItemActive: {
    backgroundColor: '#f0fdf4',
  },
  queueItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  tokenBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tokenBadgeActive: {
    backgroundColor: '#dcfce7',
  },
  tokenNum: { fontSize: 18, fontWeight: '800', color: '#64748b' },
  tokenNumActive: { color: '#16a34a' },
  serviceName: { fontSize: 15, fontWeight: '700', color: homeTheme.text, marginBottom: 2 },
  userName: { fontSize: 12, color: homeTheme.textSecondary, fontWeight: '500' },
  statusBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeActive: {
    backgroundColor: '#22c55e',
  },
  queueStatus: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, color: '#64748b' },
  queueStatusActive: { color: '#ffffff' },
});
