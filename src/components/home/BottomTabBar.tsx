import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BookingActiveIcon from '../../assets/icons/booking_active_nav_icon.svg';
import BookingIcon from '../../assets/icons/booking_nav_icon.svg';
import HomeActiveIcon from '../../assets/icons/home_active_nav_icon.svg';
import HomeIcon from '../../assets/icons/home_nav_icon.svg';
import ProfileActiveIcon from '../../assets/icons/profile_active_nav_icon.svg';
import ProfileIcon from '../../assets/icons/profile_nav_icon.svg';
import { homeTheme } from '../../theme/homeTheme';

export type HomeTabKey = 'home' | 'bookings' | 'profile';

type BottomTabBarProps = {
  activeTab?: HomeTabKey;
  onTabPress?: (tab: HomeTabKey) => void;
};

const NAV_ICON_SIZE = 22;

export function BottomTabBar({
  activeTab = 'home',
  onTabPress,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const noop = () => {};

  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: bottomPad,
        },
      ]}>
      <Pressable
        onPress={() => (onTabPress ? onTabPress('home') : noop())}
        style={({ pressed }) => [
          styles.item,
          activeTab === 'home' && styles.itemActive,
          pressed && styles.itemPressed,
        ]}>
        {activeTab === 'home' ? (
          <HomeActiveIcon width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
        ) : (
          <HomeIcon width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
        )}
        <Text style={[styles.label, activeTab === 'home' && styles.labelActive]}>
          Home
        </Text>
      </Pressable>
      <Pressable
        onPress={() => (onTabPress ? onTabPress('bookings') : noop())}
        style={({ pressed }) => [
          styles.item,
          activeTab === 'bookings' && styles.itemActive,
          pressed && styles.itemPressed,
        ]}>
        {activeTab === 'bookings' ? (
          <BookingActiveIcon width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
        ) : (
          <BookingIcon width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
        )}
        <Text
          style={[
            styles.label,
            activeTab === 'bookings' && styles.labelActive,
          ]}>
          Bookings
        </Text>
      </Pressable>
      <Pressable
        onPress={() => (onTabPress ? onTabPress('profile') : noop())}
        style={({ pressed }) => [
          styles.item,
          activeTab === 'profile' && styles.itemActive,
          pressed && styles.itemPressed,
        ]}>
        {activeTab === 'profile' ? (
          <ProfileActiveIcon width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
        ) : (
          <ProfileIcon width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
        )}
        <Text
          style={[styles.label, activeTab === 'profile' && styles.labelActive]}>
          Profile
        </Text>
      </Pressable>
    </View>
  );
}

/** Fixed chrome height for scroll padding (tab row above home indicator; add `insets.bottom` in screen). */
export const BOTTOM_TAB_BAR_OFFSET = 72;

/** Total vertical space occupied by the bottom tab bar from the bottom of the screen. */
export function getBottomTabBarTotalOffset(insetsBottom: number): number {
  return BOTTOM_TAB_BAR_OFFSET + Math.max(insetsBottom, 10);
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '0%' as const,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: homeTheme.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: homeTheme.border,
    shadowColor: homeTheme.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
    paddingHorizontal: 15,
    zIndex: 5,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 14,
  },
  itemActive: {
    backgroundColor: homeTheme.tabActiveBg,
  },
  itemPressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: homeTheme.tabInactive,
    marginTop: 6,
  },
  labelActive: {
    color: homeTheme.tabActiveIcon,
    fontWeight: '700',
  },
});
