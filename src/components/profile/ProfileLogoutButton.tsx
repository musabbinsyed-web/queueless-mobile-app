import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import LogoutIcon from '../../assets/icons/logout_icon.svg';
import { profileTheme } from '../../theme/profileTheme';

const LOGOUT_ICON_SIZE = 20;

type ProfileLogoutButtonProps = {
  label?: string;
  onPress?: () => void;
};

export function ProfileLogoutButton({
  label = 'Logout',
  onPress,
}: ProfileLogoutButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        pressed && styles.btnPressed,
      ]}>
      <LogoutIcon width={LOGOUT_ICON_SIZE} height={LOGOUT_ICON_SIZE} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 28,
    minHeight: 52,
    borderRadius: 28,
    backgroundColor: profileTheme.logoutBg,
    borderWidth: 1,
    borderColor: profileTheme.logoutBorder,
    ...Platform.select({
      ios: {
        shadowColor: profileTheme.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  btnPressed: {
    opacity: 0.9,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: profileTheme.logoutRed,
  },
});
