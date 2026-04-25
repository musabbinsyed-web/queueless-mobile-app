import type { PropsWithChildren } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { homeSpacing, homeTheme } from '../../theme/homeTheme';

type HomePrimaryButtonProps = PropsWithChildren<{
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}>;

/**
 * Full-width primary CTA for Home (light theme). Separate from auth PrimaryButton (dark theme).
 */
export function HomePrimaryButton({
  children,
  onPress,
  style,
}: HomePrimaryButtonProps) {
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
    backgroundColor: homeTheme.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: homeSpacing.buttonRadius,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  pressed: {
    backgroundColor: homeTheme.primaryPressed,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
