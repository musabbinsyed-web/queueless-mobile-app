import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  ActivityIndicator,
  Alert,
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
import BlueNotificationsIcon from '../assets/icons/blue_notifications_icon.svg';
import GreenChartsIcon from '../assets/icons/green_charts_icon.svg';
import LocationIcon from '../assets/icons/location_icon.svg';
import {
  BottomTabBar,
  getBottomTabBarTotalOffset,
} from '../components/home';
import type { HomeTabKey } from '../components/home';
import { ProfileHeader } from '../components/profile';
import type { RootStackParamList } from '../navigation/types';
import type { TokenConfirmationData } from '../types';
import { homeSpacing, homeTheme } from '../theme/homeTheme';

const PRIMARY_BLUE = '#2196F3';
const WALLET_BLUE = '#1565c0';

/** Live progress bar (Figma): teal → cyan. */
const PROGRESS_GRADIENT_START = '#00685A';
const PROGRESS_GRADIENT_END = '#5AFBDF';

const WAITING_TEAL = '#0d9488';

type Props = NativeStackScreenProps<RootStackParamList, 'TokenConfirmation'>;

function ordinal(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) {
    return `${n}st`;
  }
  if (j === 2 && k !== 12) {
    return `${n}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${n}rd`;
  }
  return `${n}th`;
}

export function TokenConfirmationScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const tabOffset = getBottomTabBarTotalOffset(insets.bottom);
  const { bookingId, snapshot } = route.params ?? {};

  const [data, setData] = useState<TokenConfirmationData | null>(
    snapshot ?? null,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { myBookings } = useSelector((state: RootState) => state.bookings);
  
  // Find booking in Redux
  const booking = myBookings.find(b => b.id === bookingId);
  
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(!snapshot && !!bookingId);

  useEffect(() => {
    let cancelled = false;
    
    if (snapshot) {
      setLoading(false);
      return;
    }
    
    if (!booking) {
      setMissing(true);
      setLoading(false);
      return;
    }
    
    if (booking.status === 'ACTIVE') {
      setData({
        tokenDisplay: String(booking.tokenNumber || '---'),
        serviceName: booking.subtitle,
        providerName: booking.name,
        location: booking.address,
        queuePosition: booking.queuePosition || 1,
        estimatedWaitMinutes: booking.waitMinutes || 0,
        liveProgressPercent: booking.liveProgressPercent || 10,
        finishedPeopleCount: booking.finishedPeopleAhead || 0,
      });
    } else {
      setMissing(true);
    }
    setLoading(false);
    
    return () => {
      cancelled = true;
    };
  }, [snapshot, booking]);

  const onTabPress = useCallback(
    (tab: HomeTabKey) => {
      if (tab === 'home') {
        navigation.navigate('Home');
        return;
      }
      if (tab === 'bookings') {
        navigation.navigate('Queue');
        return;
      }
      if (tab === 'profile') {
        navigation.navigate('Profile');
      }
    },
    [navigation],
  );

  const onWallet = useCallback(() => {
    Alert.alert(
      'Apple Wallet',
      'Add pass to Wallet will be available in a future update.',
    );
  }, []);

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

  if (missing || !data) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <Text style={styles.missing}>Booking not available.</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const aheadCount = Math.max(0, data.queuePosition - 1);
  const pct = Math.min(100, Math.max(0, data.liveProgressPercent));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={homeTheme.background} />
      <View style={styles.shell}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabOffset + 24 },
          ]}>
          <ProfileHeader
            avatarUrl={user?.avatarUrl ?? 'https://i.pravatar.cc/120?u=guest'}
            onMenuPress={() => navigation.navigate('Home')}
            onAvatarPress={() => navigation.navigate('Profile')}
          />

          <View style={styles.waitingPill}>
            <Text style={styles.waitingTxt}>WAITING</Text>
          </View>

          <Text style={styles.headline}>You&apos;re in the queue!</Text>
          <Text style={styles.subhead}>
            Grab a coffee, we&apos;ll notify you when it&apos;s time.
          </Text>

          <View style={styles.tokenCard}>
            <Text style={styles.yourTokenLabel}>YOUR TOKEN</Text>
            <Text style={styles.tokenHash}>#{data.tokenDisplay}</Text>
            <Text style={styles.serviceTypeLabel}>SERVICE TYPE</Text>
            <Text style={styles.serviceName}>{data.serviceName}</Text>
            <View style={styles.locRow}>
              <LocationIcon width={16} height={18} />
              <Text style={styles.locText}>{data.providerName}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statBig}>{ordinal(data.queuePosition)}</Text>
              <Text style={styles.statSub}>In line</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statBig}>
                {data.estimatedWaitMinutes}min
              </Text>
              <Text style={styles.statSub}>Est. Wait</Text>
            </View>
          </View>

          <View style={styles.noteBox}>
            <BlueNotificationsIcon width={28} height={28} />
            <Text style={styles.noteText}>
              Stay Relaxed. We will send a push notification when there are{' '}
              {aheadCount} people ahead of you. No need to watch the screen.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.walletBtn, pressed && styles.pressed]}
            onPress={onWallet}>
            <Text style={styles.walletBtnText}>Add to Apple Wallet</Text>
          </Pressable>

          <View style={styles.liveCard}>
            <View style={styles.liveCardTop}>
              <View style={styles.liveIconSquare}>
                <GreenChartsIcon width={20} height={20} />
              </View>
              <View style={styles.liveTitles}>
                <Text style={styles.liveEyebrow}>LIVE PROGRESS</Text>
                <Text style={styles.liveTitle}>{data.serviceName}</Text>
              </View>
            </View>
            <View style={styles.liveProgressRow}>
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={[PROGRESS_GRADIENT_START, PROGRESS_GRADIENT_END]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${pct}%` }]}
                />
              </View>
              <Text style={styles.pctText}>{pct}%</Text>
            </View>
          </View>
        </ScrollView>
        <BottomTabBar activeTab="bookings" onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  link: {
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
    color: homeTheme.primary,
  },
  waitingPill: {
    alignSelf: 'center',
    backgroundColor: WAITING_TEAL,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 16,
  },
  waitingTxt: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: '#ffffff',
  },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e3a5f',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subhead: {
    fontSize: 15,
    fontWeight: '500',
    color: homeTheme.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  tokenCard: {
    backgroundColor: homeTheme.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: homeTheme.border,
    shadowColor: homeTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  yourTokenLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: homeTheme.textMuted,
    marginBottom: 6,
  },
  tokenHash: {
    fontSize: 40,
    fontWeight: '800',
    color: PRIMARY_BLUE,
    marginBottom: 14,
    letterSpacing: -1,
  },
  serviceTypeLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: homeTheme.textMuted,
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e3a5f',
    marginBottom: 10,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: homeTheme.textSecondary,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statBig: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  statSub: {
    fontSize: 12,
    fontWeight: '600',
    color: homeTheme.textMuted,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e3f2fd',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    marginBottom: 18,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: '#1565c0',
  },
  walletBtn: {
    backgroundColor: WALLET_BLUE,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 22,
  },
  walletBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.92,
  },
  liveCard: {
    backgroundColor: homeTheme.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: homeTheme.border,
    shadowColor: homeTheme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  liveCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  liveIconSquare: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveTitles: {
    flex: 1,
    minWidth: 0,
  },
  liveEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: homeTheme.textMuted,
    marginBottom: 4,
  },
  liveTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e3a5f',
  },
  liveProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  pctText: {
    fontSize: 15,
    fontWeight: '800',
    color: homeTheme.text,
    minWidth: 44,
    textAlign: 'right',
  },
});
