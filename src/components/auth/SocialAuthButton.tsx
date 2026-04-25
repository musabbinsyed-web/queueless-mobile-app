import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { authColors, authDesign } from '../../theme/authDesign';

type SocialAuthButtonProps = {
  label: string;
  onPress: () => void;
  leading: ReactNode;
};

export function SocialAuthButton({
  label,
  onPress,
  leading,
}: SocialAuthButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}>
      <View style={styles.inner}>
        {leading}
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minWidth: 0,
    height: authDesign.socialButtonHeight,
    borderRadius: authDesign.socialButtonRadius,
    backgroundColor: authColors.socialBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.88,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: authColors.titleGray,
  },
});
