import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { bookTokenThunk } from '../store/slices/bookingSlice';
import { fetchProviderDetailThunk, fetchLiveQueueThunk, clearCurrentProvider } from '../store/slices/discoverySlice';
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BOOK_TOKEN_BUTTON_HEIGHT,
  FloatingBookTokenButton,
} from '../components/home';
import { ProfileHeader } from '../components/profile';
import type { TokenConfirmationData } from '../types';
import type { RootStackParamList } from '../navigation/types';
import type { ServiceDisplay, ServiceProviderDetail } from '../types';
import { homeSpacing, homeTheme } from '../theme/homeTheme';

const TEAL = '#2BB673';
const TEAL_DARK = '#0f766e';
const GRADIENT = { start: '#0052D0', end: '#799DFF' };

type Props = NativeStackScreenProps<RootStackParamList, 'LiveQueue'>;

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

function formatHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

function hashStr(s: string): number {
  return s.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
}

// We will use real queue data fetched from backend

export function LiveQueueScreen({ navigation, route }: Props) {
  const { providerId, serviceId } = route.params;
  const insets = useSafeAreaInsets();
  const fabBottom = Math.max(insets.bottom, 12) + 8;

  const [loading, setLoading] = useState(true);
  const { currentProvider: provider, liveQueue: liveQueueData, loading: discoveryLoading } = useSelector(
    (state: RootState) => state.discovery
  );
  const [queue, setQueue] = useState({
    nowServing: 0,
    yourToken: 0,
    peopleAhead: 0,
    estimatedWaitMinutes: 0,
    progress: 0.1,
  });

  const [secondsLeft, setSecondsLeft] = useState(600);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isBooking = useSelector((state: RootState) => state.bookings.loading);
  const { user } = useSelector((state: RootState) => state.auth);

  const service = provider?.services.find(s => s.id === serviceId) ?? null;

  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(fetchProviderDetailThunk(providerId)),
        dispatch(fetchLiveQueueThunk(providerId)),
      ]);
      setLoading(false);
    })();
    return () => {
      dispatch(clearCurrentProvider());
    };
  }, [dispatch, providerId, serviceId]);

  useEffect(() => {
    if (liveQueueData) {
      setQueue({
        nowServing: liveQueueData.nowServing,
        yourToken: liveQueueData.nextToken,
        peopleAhead: liveQueueData.peopleAhead,
        estimatedWaitMinutes: liveQueueData.estimatedWaitMinutes,
        progress: Math.min(0.9, Math.max(0.1, 1 - liveQueueData.peopleAhead / 20)),
      });
    }
  }, [liveQueueData]);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const onBookTokenPress = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const onConfirmNo = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const onConfirmYes = useCallback(async () => {
    if (!provider || !service) return;
    
    // Dispatch real booking thunk
    const resultAction = await dispatch(bookTokenThunk({ providerId, serviceId }));
    
    if (bookTokenThunk.fulfilled.match(resultAction)) {
      setConfirmOpen(false);
      const { tokenConfirmation } = resultAction.payload;
      
      const snap: TokenConfirmationData = {
        tokenDisplay: String(tokenConfirmation.tokenNumber),
        serviceName: service.name,
        providerName: provider.name,
        location: provider.location,
        queuePosition: tokenConfirmation.queuePosition,
        estimatedWaitMinutes: parseInt(tokenConfirmation.estimatedWaitTime.replace(/[^0-9]/g, '')) || 5,
        liveProgressPercent: Math.round(queue.progress * 100),
        finishedPeopleCount: 0, // Not tracked on backend currently
      };
      
      navigation.navigate('TokenConfirmation', { snapshot: snap });
    } else {
      // Handled by standard error UI if we had one, for now just close
      setConfirmOpen(false);
      console.warn('Booking failed:', resultAction.payload);
    }
  }, [dispatch, navigation, provider, service, providerId, serviceId, queue.progress]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={homeTheme.background} />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={homeTheme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!provider || !service) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <Text style={styles.missing}>Could not load queue.</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.goBack}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const scrollBottomPad =
    BOOK_TOKEN_BUTTON_HEIGHT + fabBottom + 24;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={homeTheme.background} />
      <View style={styles.shell}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: scrollBottomPad },
          ]}>
          <ProfileHeader
            avatarUrl={user?.avatarUrl ?? 'https://i.pravatar.cc/120?u=guest'}
            onMenuPress={() => navigation.navigate('Home')}
            onAvatarPress={() => navigation.navigate('Profile')}
          />

          <Text style={styles.liveLabel}>LIVE STATUS</Text>
          <Text style={styles.venueTitle}>{provider.name}</Text>
          <View style={styles.locRow}>
            <Text style={styles.pin}>📍</Text>
            <Text style={styles.locText}>{provider.location}</Text>
          </View>

          <View style={styles.tokenRow}>
            <View style={styles.nowCard}>
              <Text style={styles.nowLabel}>NOW SERVING</Text>
              <Text style={styles.nowNum}>{queue.nowServing}</Text>
              <Text style={styles.tokenSub}>Token Number</Text>
            </View>
            <LinearGradient
              colors={[GRADIENT.start, GRADIENT.end]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.yourCard}>
              <Text style={styles.yourLabel}>NEXT TOKEN</Text>
              <Text style={styles.yourNum}>{queue.yourToken}</Text>
              <Text style={styles.yourSub}>Next in line</Text>
            </LinearGradient>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.estWait}>
              Estimated wait ~ {queue.estimatedWaitMinutes} Mins
            </Text>
            <Text style={styles.ahead}>
              People Ahead {queue.peopleAhead}
            </Text>
          </View>

          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.round(queue.progress * 100)}%` },
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progLeft}>CURRENTLY</Text>
              <Text style={styles.progRight}>YOUR TURN</Text>
            </View>
          </View>

          <View style={styles.timerPill}>
            <Text style={styles.clockIcon}>🕐</Text>
            <Text style={styles.timerText}>
              {formatHMS(secondsLeft)} remaining
            </Text>
          </View>

          <View style={styles.alertCard}>
            <View style={styles.bellCircle}>
              <Text style={styles.bell}>🔔</Text>
            </View>
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>Proximity Alert</Text>
              <Text style={styles.alertDesc}>
                {
                  "We'll notify you when there are 3 people ahead of you. Feel free to explore the area."
                }
              </Text>
              <Pressable onPress={() => {}} hitSlop={8}>
                <Text style={styles.alertLink}>Modify Alert Settings &gt;</Text>
              </Pressable>
            </View>
          </View>

          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=400&fit=crop&q=80',
            }}
            style={styles.promoBanner}
            imageStyle={styles.promoImgRadius}>
            <View style={styles.promoOverlay}>
              <Text style={styles.promoText}>
                15% off your first pastry while you wait
              </Text>
              <Pressable style={styles.promoFab}>
                <Text style={styles.promoFabIcon}>🎁</Text>
              </Pressable>
            </View>
          </ImageBackground>
        </ScrollView>

        <FloatingBookTokenButton bottom={fabBottom} onPress={onBookTokenPress} />

        <Modal
          visible={confirmOpen}
          transparent
          animationType="fade"
          onRequestClose={onConfirmNo}>
          <View style={styles.modalOuter}>
            <Pressable style={styles.modalBackdropFill} onPress={onConfirmNo} />
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Book token?</Text>
              <Text style={styles.modalBody}>
                Confirm you want to book a token for{' '}
                <Text style={styles.modalBold}>{service.name}</Text> at{' '}
                <Text style={styles.modalBold}>{provider.name}</Text>.
              </Text>
              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalBtn, styles.modalBtnGhost]}
                  onPress={onConfirmNo}>
                  <Text style={styles.modalBtnGhostText}>No</Text>
                </Pressable>
                <Pressable style={styles.modalBtn} onPress={onConfirmYes} disabled={isBooking}>
                  <Text style={styles.modalBtnPrimaryText}>{isBooking ? 'Wait...' : 'Yes'}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: homeTheme.background,
  },
  shell: {
    flex: 1,
    position: 'relative',
  },
  scroll: {
    paddingHorizontal: homeSpacing.screenHorizontal,
    paddingTop: 4,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missing: {
    textAlign: 'center',
    marginTop: 40,
    color: homeTheme.textSecondary,
  },
  goBack: {
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
    color: homeTheme.primary,
  },
  liveLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: TEAL,
    marginBottom: 6,
  },
  venueTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: homeTheme.text,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 20,
  },
  pin: {
    fontSize: 14,
    marginTop: 1,
  },
  locText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: homeTheme.textSecondary,
    lineHeight: 20,
  },
  tokenRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  nowCard: {
    flex: 1,
    backgroundColor: homeTheme.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: homeTheme.border,
  },
  nowLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: TEAL_DARK,
    marginBottom: 8,
  },
  nowNum: {
    fontSize: 36,
    fontWeight: '800',
    color: homeTheme.text,
    marginBottom: 4,
  },
  tokenSub: {
    fontSize: 12,
    fontWeight: '500',
    color: homeTheme.textMuted,
  },
  yourCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
  },
  yourLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 8,
  },
  yourNum: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  yourSub: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },
  estWait: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: homeTheme.text,
  },
  ahead: {
    fontSize: 15,
    fontWeight: '800',
    color: TEAL,
  },
  progressWrap: {
    marginBottom: 18,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: homeTheme.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: TEAL,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progLeft: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: homeTheme.textMuted,
  },
  progRight: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: homeTheme.textMuted,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#d1fae5',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    gap: 8,
    marginBottom: 22,
  },
  clockIcon: {
    fontSize: 16,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065f46',
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: homeTheme.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: homeTheme.border,
    gap: 12,
  },
  bellCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    fontSize: 20,
  },
  alertBody: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: homeTheme.text,
    marginBottom: 6,
  },
  alertDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: homeTheme.textSecondary,
    marginBottom: 8,
  },
  alertLink: {
    fontSize: 14,
    fontWeight: '700',
    color: homeTheme.primary,
  },
  promoBanner: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  promoImgRadius: {
    borderRadius: 16,
  },
  promoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    padding: 16,
    justifyContent: 'center',
  },
  promoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    maxWidth: '78%',
  },
  promoFab: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoFabIcon: {
    fontSize: 20,
  },
  modalOuter: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  modalBackdropFill: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  modalCard: {
    backgroundColor: homeTheme.surface,
    borderRadius: 18,
    padding: 22,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: homeTheme.text,
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 15,
    lineHeight: 22,
    color: homeTheme.textSecondary,
    marginBottom: 20,
  },
  modalBold: {
    fontWeight: '700',
    color: homeTheme.text,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    backgroundColor: homeTheme.primary,
    minWidth: 88,
    alignItems: 'center',
  },
  modalBtnGhost: {
    backgroundColor: homeTheme.searchBg,
  },
  modalBtnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalBtnGhostText: {
    fontSize: 16,
    fontWeight: '700',
    color: homeTheme.text,
  },
});
