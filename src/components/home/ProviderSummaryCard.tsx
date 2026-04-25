import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ServiceProvider } from '../../types';
import { busynessHint, busynessLabel } from '../../utils/providerBusyness';
import { homeSpacing, homeTheme } from '../../theme/homeTheme';

type ProviderSummaryCardProps = {
  provider: ServiceProvider;
  onPress?: () => void;
};

const BUSYNESS_STYLES: Record<
  ServiceProvider['busyness'],
  { bg: string; text: string }
> = {
  low: { bg: '#dcfce7', text: '#166534' },
  moderate: { bg: '#fef3c7', text: '#b45309' },
  high: { bg: '#fee2e2', text: '#b91c1c' },
};

export function ProviderSummaryCard({
  provider,
  onPress,
}: ProviderSummaryCardProps) {
  const busy = BUSYNESS_STYLES[provider.busyness];
  const serviceCount = provider.services.length;

  const inner = (
    <>
      <Image source={{ uri: provider.image }} style={styles.thumb} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {provider.name}
        </Text>
        <Text style={styles.location} numberOfLines={2}>
          {provider.location}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.busyPill, { backgroundColor: busy.bg }]}>
            <Text style={[styles.busyText, { color: busy.text }]}>
              {busynessLabel(provider.busyness)}
            </Text>
          </View>
          <Text style={styles.servicesCount}>
            {serviceCount} service{serviceCount === 1 ? '' : 's'}
          </Text>
        </View>
        <Text style={styles.busyHint}>{busynessHint(provider.busyness)}</Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Opens provider details"
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        {inner}
      </Pressable>
    );
  }

  return <View style={styles.card}>{inner}</View>;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: homeTheme.surface,
    borderRadius: homeSpacing.cardRadius,
    padding: 14,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    shadowColor: homeTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.92,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: homeTheme.border,
  },
  body: {
    flex: 1,
    marginLeft: 14,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: homeTheme.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  location: {
    fontSize: 13,
    fontWeight: '500',
    color: homeTheme.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  busyPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  busyText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  servicesCount: {
    fontSize: 13,
    fontWeight: '600',
    color: homeTheme.primary,
  },
  busyHint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: homeTheme.textMuted,
  },
});
