import type { PropsWithChildren } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';

type PrimaryButtonProps = PropsWithChildren<{
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}>;

export function PrimaryButton({ children, onPress, style }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: colors.accentPressed,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
