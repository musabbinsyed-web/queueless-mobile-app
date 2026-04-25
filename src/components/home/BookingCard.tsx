import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Booking } from '../../types';
import { homeSpacing, homeTheme } from '../../theme/homeTheme';

export type BookingItem = Booking;

type BookingCardProps = {
  item: BookingItem;
  onPress?: () => void;
};

export function BookingCard({ item, onPress }: BookingCardProps) {
  const isActive = item.status === 'ACTIVE';

  const inner = (
    <>
      <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
      <View style={styles.middle}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
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
          {item.status}
        </Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Opens booking details"
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}>
        {inner}
      </Pressable>
    );
  }

  return <View style={styles.card}>{inner}</View>;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: homeTheme.surface,
    borderRadius: homeSpacing.cardRadius,
    padding: 14,
    marginBottom: 12,
    shadowColor: homeTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15, 23, 42, 0.04)',
  },
  cardPressed: {
    opacity: 0.92,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: homeTheme.border,
  },
  middle: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: homeTheme.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: homeTheme.textSecondary,
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
});
