import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import SideMenuIcon from '../../assets/icons/side_menu_icon.svg';
import { homeTheme } from '../../theme/homeTheme';

type ProfileHeaderProps = {
  avatarUrl: string;
  onMenuPress?: () => void;
  onAvatarPress?: () => void;
};

export function ProfileHeader({
  avatarUrl,
  onMenuPress,
  onAvatarPress,
}: ProfileHeaderProps) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open menu"
        hitSlop={10}
        onPress={onMenuPress}
        style={({ pressed }) => [styles.sideSlot, pressed && styles.pressed]}>
        <SideMenuIcon width={22} height={14} />
      </Pressable>

      <View style={styles.brandWrap} pointerEvents="none">
        <Text style={styles.brandQueue}>Queue</Text>
        <Text style={styles.brandLess}>Less</Text>
      </View>

      <Pressable
        accessibilityRole="imagebutton"
        accessibilityLabel="Profile"
        onPress={onAvatarPress}
        style={({ pressed }) => [styles.sideSlot, styles.avatarSlot, pressed && styles.pressed]}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  sideSlot: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  avatarSlot: {
    alignItems: 'flex-end',
  },
  pressed: {
    opacity: 0.75,
  },
  brandWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  brandQueue: {
    fontSize: 19,
    fontWeight: '800',
    color: homeTheme.primary,
    letterSpacing: -0.2,
  },
  brandLess: {
    fontSize: 19,
    fontWeight: '800',
    color: homeTheme.primary,
    letterSpacing: -0.2,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: homeTheme.border,
  },
});
