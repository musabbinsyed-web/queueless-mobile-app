import { StyleSheet, Text, View } from 'react-native';
import { profileTheme } from '../../theme/profileTheme';

type ProfileStatsRowProps = {
  activeBookings: number;
  timeSavedMinutes: number;
};

export function ProfileStatsRow({
  activeBookings,
  timeSavedMinutes,
}: ProfileStatsRowProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.card, styles.cardLeft]}>
        <Text style={styles.value}>{activeBookings}</Text>
        <Text style={styles.caption}>ACTIVE BOOKINGS</Text>
      </View>
      <View style={[styles.card, styles.cardRight]}>
        <Text style={styles.value}>{timeSavedMinutes}m</Text>
        <Text style={styles.caption}>TIME SAVED</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  card: {
    flex: 1,
    backgroundColor: profileTheme.card,
    borderRadius: profileTheme.cardRadius,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    shadowColor: profileTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLeft: {},
  cardRight: {},
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: profileTheme.statValue,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  caption: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: profileTheme.textSubtle,
    textAlign: 'center',
  },
});
