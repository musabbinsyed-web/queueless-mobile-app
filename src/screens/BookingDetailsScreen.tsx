import { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getBookingById } from '../services';
import type { RootStackParamList } from '../navigation/types';
import type { Booking } from '../types';
import { homeSpacing, homeTheme } from '../theme/homeTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingDetails'>;

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function BookingDetailsScreen({ route, navigation }: Props) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getBookingById(bookingId);
      if (!cancelled) {
        setBooking(result);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const isActive = booking?.status === 'ACTIVE';

  useLayoutEffect(() => {
    if (booking) {
      navigation.setOptions({ title: booking.name });
    }
  }, [booking, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={homeTheme.primary} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Booking not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <Image source={{ uri: booking.imageUrl }} style={styles.hero} />
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{booking.name}</Text>
        <View
          style={[
            styles.badge,
            isActive ? styles.badgeActive : styles.badgeCompleted,
          ]}>
          <Text
            style={[
              styles.badgeText,
              isActive ? styles.badgeTextActive : styles.badgeTextCompleted,
            ]}>
            {booking.status}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <DetailRow label="Service" value={booking.subtitle} />
        <View style={styles.hairline} />
        <DetailRow label="Booked" value={booking.bookedAt} />
        <View style={styles.hairline} />
        <DetailRow label="Location" value={booking.address} />
        {typeof booking.waitMinutes === 'number' ? (
          <>
            <View style={styles.hairline} />
            <DetailRow
              label="Est. wait"
              value={`~${booking.waitMinutes} min`}
            />
          </>
        ) : null}
        <View style={styles.hairline} />
        <DetailRow label="Reference" value={booking.referenceCode} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: homeTheme.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeTheme.background,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeTheme.background,
    padding: 24,
  },
  missingText: {
    fontSize: 16,
    color: homeTheme.textSecondary,
  },
  hero: {
    width: '100%',
    height: 220,
    backgroundColor: homeTheme.border,
    borderBottomLeftRadius: homeSpacing.cardRadius,
    borderBottomRightRadius: homeSpacing.cardRadius,
  },
  titleBlock: {
    paddingHorizontal: homeSpacing.screenHorizontal,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: homeTheme.text,
    letterSpacing: -0.3,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  badgeActive: {
    backgroundColor: homeTheme.badgeActiveSoftBg,
  },
  badgeCompleted: {
    backgroundColor: homeTheme.badgeCompletedBg,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  badgeTextActive: {
    color: homeTheme.badgeActiveSoftText,
  },
  badgeTextCompleted: {
    color: homeTheme.badgeCompletedText,
  },
  card: {
    marginHorizontal: homeSpacing.screenHorizontal,
    marginTop: 12,
    backgroundColor: homeTheme.surface,
    borderRadius: homeSpacing.cardRadius,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: homeTheme.border,
    shadowColor: homeTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    gap: 6,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: homeTheme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '600',
    color: homeTheme.text,
    lineHeight: 22,
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: homeTheme.border,
    marginVertical: 14,
  },
});
