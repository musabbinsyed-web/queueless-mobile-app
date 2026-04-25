import { Image, StyleSheet, Text, View } from 'react-native';
import { homeSpacing, homeTheme } from '../../theme/homeTheme';

type HeaderProps = {
  appName?: string;
  greetingLine: string;
  headline: string;
  avatarUrl: string;
};

export function Header({
  appName = 'QueueLess',
  greetingLine,
  headline,
  avatarUrl,
}: HeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <Text style={styles.brand}>{appName}</Text>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      </View>
      <Text style={styles.greeting}>{greetingLine}</Text>
      <Text style={styles.headline}>{headline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: homeSpacing.sectionGap,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brand: {
    fontSize: 22,
    fontWeight: '700',
    color: homeTheme.primary,
    letterSpacing: -0.3,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: homeTheme.border,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '500',
    color: homeTheme.textSecondary,
    marginBottom: 6,
  },
  headline: {
    fontSize: 26,
    fontWeight: '700',
    color: homeTheme.text,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
});
