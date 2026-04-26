import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDispatch, RootState } from '../../store';
import { fetchProviderQueueListThunk, advanceQueueThunk, fetchMyVenueThunk } from '../../store/slices/providerSlice';
import { ProviderTabBar, getProviderTabBarTotalOffset, ProviderTabKey } from '../../components/provider/ProviderTabBar';
import type { QueueManagementScreenProps } from '../../navigation/types';
import { homeSpacing, homeTheme } from '../../theme/homeTheme';
import type { Booking } from '../../types';

export function QueueManagementScreen({ navigation }: QueueManagementScreenProps) {
  const insets = useSafeAreaInsets();
  const tabOffset = getProviderTabBarTotalOffset(insets.bottom);
  
  const dispatch = useDispatch<AppDispatch>();
  const { activeQueue, loading, myProviderDetails } = useSelector((state: RootState) => state.provider);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const loadData = useCallback(async () => {
    let venueId = myProviderDetails?.id;
    if (!venueId) {
      const res = await dispatch(fetchMyVenueThunk());
      if (fetchMyVenueThunk.fulfilled.match(res)) {
        venueId = res.payload.id;
      }
    }
    if (venueId) {
      await dispatch(fetchProviderQueueListThunk(venueId));
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

  const onCallNext = useCallback(async () => {
    if (activeQueue.length === 0 || !myProviderDetails?.id) return;
    setIsAdvancing(true);
    const res = await dispatch(advanceQueueThunk(myProviderDetails.id));
    if (advanceQueueThunk.fulfilled.match(res)) {
      await loadData(); // Reload queue after advancing
    } else {
      Alert.alert('Error', res.payload as string || 'Failed to advance queue');
    }
    setIsAdvancing(false);
  }, [dispatch, activeQueue.length, loadData, myProviderDetails?.id]);

  const onTabPress = useCallback(
    (tab: ProviderTabKey) => {
      if (tab === 'queue') return;
      if (tab === 'dashboard') navigation.navigate('ProviderDashboard');
      if (tab === 'services') navigation.navigate('ServiceManager');
      if (tab === 'settings') navigation.navigate('ProviderSettings');
    },
    [navigation]
  );

  const renderItem = ({ item, index }: { item: Booking; index: number }) => {
    const isNext = index === 0;
    return (
      <View style={[styles.queueItem, isNext && styles.queueItemNext]}>
        <View style={styles.queueItemLeft}>
          <Text style={[styles.tokenNum, isNext && styles.tokenNumNext]}>#{item.tokenNumber}</Text>
          <View>
            <Text style={styles.serviceName}>{item.subtitle}</Text>
            <Text style={styles.timeWait}>Waiting since {new Date(item.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        </View>
        <Text style={[styles.queueStatus, isNext && styles.queueStatusNext]}>
          {isNext ? 'NEXT IN LINE' : `POSITION ${index + 1}`}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f6f9" />
      <View style={styles.content}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Live Queue</Text>
          <Text style={styles.headerSubtitle}>{activeQueue.length} customers waiting</Text>
        </View>

        <View style={styles.callNextContainer}>
          <Pressable 
            style={[styles.callNextBtn, (activeQueue.length === 0 || isAdvancing) && styles.callNextBtnDisabled]} 
            onPress={onCallNext}
            disabled={activeQueue.length === 0 || isAdvancing}
          >
            {isAdvancing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.callNextText}>CALL NEXT</Text>
            )}
          </Pressable>
        </View>

        {loading && !refreshing && activeQueue.length === 0 ? (
          <ActivityIndicator size="large" color={homeTheme.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={activeQueue}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={[styles.list, { paddingBottom: tabOffset + 24 }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[homeTheme.primary]} />}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyTitle}>Queue is empty</Text>
                <Text style={styles.emptySub}>No one is currently waiting for a service.</Text>
              </View>
            }
          />
        )}

        <ProviderTabBar activeTab="queue" onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f6f9' },
  content: { flex: 1, position: 'relative' },
  header: {
    paddingHorizontal: homeSpacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: homeTheme.text, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, fontWeight: '500', color: homeTheme.textSecondary },
  callNextContainer: {
    paddingHorizontal: homeSpacing.screenHorizontal,
    paddingVertical: 16,
  },
  callNextBtn: {
    backgroundColor: '#0052D0',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#0052D0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  callNextBtnDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  callNextText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  list: { paddingHorizontal: homeSpacing.screenHorizontal, paddingBottom: 16 },
  queueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: homeTheme.border,
  },
  queueItemNext: {
    borderColor: '#2BB673',
    borderWidth: 2,
    backgroundColor: '#f0fdf4',
  },
  queueItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  tokenNum: { fontSize: 20, fontWeight: '800', color: homeTheme.text },
  tokenNumNext: { color: '#2BB673' },
  serviceName: { fontSize: 15, fontWeight: '700', color: homeTheme.text, marginBottom: 2 },
  timeWait: { fontSize: 12, color: homeTheme.textMuted },
  queueStatus: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, color: homeTheme.textMuted },
  queueStatusNext: { color: '#2BB673' },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: homeTheme.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: homeTheme.textSecondary },
});
