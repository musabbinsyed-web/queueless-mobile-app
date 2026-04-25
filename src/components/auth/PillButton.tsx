import type { PropsWithChildren } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { authColors, authDesign } from '../../theme/authDesign';

type PillButtonProps = PropsWithChildren<{
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'ghost';
}>;

export function PillButton({
  children,
  onPress,
  style,
  variant = 'primary',
}: PillButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.ghost,
        pressed && (isPrimary ? styles.primaryPressed : styles.ghostPressed),
        style,
      ]}>
      <Text style={[styles.label, !isPrimary && styles.labelGhost]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: authDesign.primaryButtonMinHeight,
    borderRadius: authDesign.pillButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: authColors.brandBlue,
    ...Platform.select({
      ios: {
        shadowColor: authColors.brandBlue,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  primaryPressed: {
    opacity: 0.92,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostPressed: {
    opacity: 0.7,
  },
  label: {
    color: authColors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  labelGhost: {
    color: authColors.brandBlue,
    fontSize: 15,
    fontWeight: '600',
  },
});
