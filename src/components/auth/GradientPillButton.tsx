import type { PropsWithChildren } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { authColors, authDesign } from '../../theme/authDesign';

type GradientPillButtonProps = PropsWithChildren<{
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}>;

export function GradientPillButton({
  children,
  onPress,
  style,
}: GradientPillButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.shadowWrap,
        pressed && styles.pressed,
        style,
      ]}>
      <LinearGradient
        colors={[authColors.brandBlue, authColors.brandBlueSoft]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}>
        <Text style={styles.label}>{children}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: authDesign.pillButtonRadius,
    overflow: 'hidden',
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
  pressed: {
    opacity: 0.92,
  },
  gradient: {
    minHeight: authDesign.primaryButtonMinHeight,
    width:"100%",
    borderRadius: authDesign.pillButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: 24,
  },
  label: {
    color: authColors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
