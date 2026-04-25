import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BottomTabBar,
  getBottomTabBarTotalOffset,
} from '../components/home';
import type { HomeTabKey } from '../components/home';
import { ProfileHeader } from '../components/profile';
import { getCurrentUser, getProviderDetails } from '../services';
import type { RootStackParamList } from '../navigation/types';
import type { ServiceDisplay, ServiceProviderDetail } from '../types';
import {
  resolveServiceListIcon,
  serviceIconBubbleColor,
} from '../utils/serviceIconResolver';
import { homeSpacing, homeTheme } from '../theme/homeTheme';
import LocationIcon from '../assets/icons/location_icon.svg';
import GreenNotificationIcon from '../assets/icons/green_notification_icon.svg';

const WAIT_TEAL = '#0f766e';

type Props = NativeStackScreenProps<RootStackParamList, 'ProviderDetail'>;

export function ProviderDetailScreen({ navigation, route }: Props) {
  const { providerId } = route.params;
  const insets = useSafeAreaInsets();
  const tabOffset = getBottomTabBarTotalOffset(insets.bottom);

  const [provider, setProvider] = useState<ServiceProviderDetail | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://i.pravatar.cc/120?u=guest',
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [p, user] = await Promise.all([
        getProviderDetails(providerId),
        getCurrentUser(),
      ]);
      if (!cancelled) {
        setProvider(p);
        setAvatarUrl(user.avatarUrl);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [providerId]);

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

  if (!provider) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={homeTheme.background} />
        <View style={styles.loadingWrap}>
          <Text style={styles.missing}>Provider not found.</Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.goBack}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const showPeakBanner =
    provider.busyness === 'high' || provider.busyness === 'moderate';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={homeTheme.background} />
      <View style={styles.shell}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabOffset + 20 },
          ]}>
          <ProfileHeader
            avatarUrl={avatarUrl}
            onMenuPress={() =>
              Alert.alert('Menu', 'Navigation menu is not wired yet.')
            }
            onAvatarPress={() => navigation.navigate('Profile')}
          />

          <View style={styles.heroCard}>
            <Image source={{ uri: provider.image }} style={styles.heroImg} />
            <View style={styles.heroBody}>
              <View style={styles.nameRow}>
                <Text style={styles.providerName} numberOfLines={2}>
                  {provider.name}
                </Text>
                <View style={styles.ratingPill}>
                  <Text style={styles.star}>★</Text>
                  <Text style={styles.ratingNum}>
                    {provider.rating.toFixed(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.heroLocRow}>
                <LocationIcon width={14} height={16} />
                <Text style={styles.location}>{provider.location}</Text>
              </View>

              <View style={styles.visitorsRow}>
                <View style={styles.avatarStack}>
                  {[0, 1, 2].map(i => (
                    <Image
                      key={i}
                      source={{
                        uri: `https://i.pravatar.cc/96?u=${encodeURIComponent(
                          `${provider.id}-v${i}`,
                        )}`,
                      }}
                      style={[
                        styles.visitorAvatar,
                        i > 0 && styles.visitorAvatarOverlap,
                      ]}
                    />
                  ))}
                </View>
                <View style={styles.visitorsTextCol}>
                  <Text style={styles.visitorsLabel}>CURRENT VISITORS</Text>
                  <Text style={styles.visitorsMeta}>
                    About {provider.currentVisitors} people on-site
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.sectionHead}>
            <View>
              <Text style={styles.sectionTitle}>Select Service</Text>
              <Text style={styles.sectionSub}>Choose your reason for visit</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => Alert.alert('Filter', 'Filters coming soon.')}
              style={({ pressed }) => [styles.filterBtn, pressed && styles.pressed]}>
              <Text style={styles.filterLabel}>Filter</Text>
              <Text style={styles.filterChevron}>▼</Text>
            </Pressable>
          </View>

          {provider.services.map((svc: ServiceDisplay) => {
            const ServiceIcon = resolveServiceListIcon(
              svc.name,
              provider.categoryId,
            );
            const bubbleBg = serviceIconBubbleColor(provider.categoryId);
            return (
              <Pressable
                key={svc.id}
                accessibilityRole="button"
                onPress={() =>
                  navigation.navigate('LiveQueue', {
                    providerId: provider.id,
                    serviceId: svc.id,
                  })
                }
                style={({ pressed }) => [
                  styles.serviceCard,
                  pressed && styles.servicePressed,
                ]}>
                <View
                  style={[styles.serviceIconBubble, { backgroundColor: bubbleBg }]}>
                  <ServiceIcon width={26} height={26} />
                </View>
                <View style={styles.serviceMid}>
                  <Text style={styles.serviceTitle}>{svc.name}</Text>
                  <Text style={styles.serviceDesc}>{svc.description}</Text>
                </View>
                <View style={styles.serviceWait}>
                  <Text style={styles.waitTime}>{svc.waitEstimate}</Text>
                  <Text style={styles.waitLabel}>WAIT TIME</Text>
                </View>
              </Pressable>
            );
          })}

          {showPeakBanner ? (
            <View style={styles.peakBanner}>
              <Text style={styles.peakText}>
                {provider.busyness === 'high'
                  ? 'Service center is currently at peak traffic.'
                  : 'Elevated traffic — expect slightly longer waits.'}
              </Text>
              <GreenNotificationIcon width={40} height={41} />
            </View>
          ) : null}
        </ScrollView>
        <BottomTabBar activeTab="home" onTabPress={onTabPress} />
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
    gap: 12,
  },
  missing: {
    fontSize: 15,
    color: homeTheme.textSecondary,
    marginBottom: 12,
  },
  goBack: {
    fontSize: 16,
    fontWeight: '600',
    color: homeTheme.primary,
  },
  heroCard: {
    backgroundColor: homeTheme.surface,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    shadowColor: homeTheme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 22,
    overflow: 'hidden',
  },
  heroImg: {
    width: '100%',
    height: 176,
    backgroundColor: homeTheme.border,
  },
  heroBody: {
    padding: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  providerName: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: homeTheme.text,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: homeTheme.searchBg,
  },
  star: {
    fontSize: 14,
    color: '#f59e0b',
  },
  ratingNum: {
    fontSize: 14,
    fontWeight: '700',
    color: homeTheme.text,
  },
  heroLocRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  location: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: homeTheme.textSecondary,
    lineHeight: 20,
  },
  visitorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visitorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: homeTheme.surface,
    backgroundColor: homeTheme.border,
  },
  visitorAvatarOverlap: {
    marginLeft: -14,
  },
  visitorsTextCol: {
    flex: 1,
  },
  visitorsLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: homeTheme.tabActiveIcon,
  },
  visitorsMeta: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
    color: homeTheme.textMuted,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: homeTheme.text,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    fontWeight: '500',
    color: homeTheme.textSecondary,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: homeTheme.primary,
  },
  filterChevron: {
    fontSize: 10,
    color: homeTheme.primary,
    marginTop: 1,
  },
  pressed: {
    opacity: 0.75,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: homeTheme.surface,
    borderRadius: homeSpacing.cardRadius,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    shadowColor: homeTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceIconBubble: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  servicePressed: {
    opacity: 0.92,
  },
  serviceMid: {
    flex: 1,
    marginRight: 8,
    minWidth: 0,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: homeTheme.text,
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: homeTheme.textSecondary,
    lineHeight: 18,
  },
  serviceWait: {
    alignItems: 'flex-end',
  },
  waitTime: {
    fontSize: 17,
    fontWeight: '800',
    color: WAIT_TEAL,
    marginBottom: 2,
  },
  waitLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: homeTheme.textMuted,
  },
  peakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  peakText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#047857',
    lineHeight: 18,
  },
});
