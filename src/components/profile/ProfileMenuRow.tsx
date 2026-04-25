import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { profileTheme } from '../../theme/profileTheme';

type ProfileMenuRowProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

export function ProfileMenuRow({
  icon,
  title,
  subtitle,
  onPress,
}: ProfileMenuRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.iconSlot}>{icon}</View>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const ICON_SLOT = 48;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: profileTheme.card,
    borderRadius: profileTheme.cardRadius,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: profileTheme.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardPressed: {
    opacity: 0.92,
  },
  iconSlot: {
    width: ICON_SLOT,
    height: ICON_SLOT,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: profileTheme.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: profileTheme.textMuted,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 28,
    fontWeight: '300',
    color: profileTheme.chevron,
    marginLeft: 4,
    marginTop: -4,
  },
});
