import { useCallback } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BookingHistoryIcon from '../assets/icons/booking_history_icon.svg';
import SavedCenterIcon from '../assets/icons/saved-center_icon.svg';
import SettingsMenuIcon from '../assets/icons/settings_icon.svg';
import {
  BottomTabBar,
  getBottomTabBarTotalOffset,
} from '../components/home';
import type { HomeTabKey } from '../components/home';
import {
  ProfileAvatarSection,
  ProfileHeader,
  ProfileLogoutButton,
  ProfileMenuRow,
  ProfileStatsRow,
} from '../components/profile';
import { appBuildLabel, profileUser } from '../data/profileMock';
import type { ProfileScreenProps } from '../navigation/types';
import { homeSpacing } from '../theme/homeTheme';
import { profileTheme } from '../theme/profileTheme';

const MENU_ICON_SIZE = 48;

const FOOTER_PAD = 8;

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const tabOffset = getBottomTabBarTotalOffset(insets.bottom);

  const onTabPress = useCallback(
    (tab: HomeTabKey) => {
      if (tab === 'home') {
        navigation.navigate('Home');
        return;
      }
      if (tab === 'bookings') {
        navigation.navigate('Queue');
        return;
      }
      if (tab === 'profile') {
        return;
      }
    },
    [navigation],
  );

  const onLogout = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={profileTheme.screenBg} />
      <View style={styles.content}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollInner,
            { paddingBottom: tabOffset + FOOTER_PAD },
          ]}>
          <ProfileHeader
            avatarUrl={profileUser.avatarUrl}
            onMenuPress={() =>
              Alert.alert('Menu', 'Side menu is not wired yet.')
            }
            onAvatarPress={() =>
              Alert.alert('Profile', 'Account settings are coming soon.')
            }
          />
          <ProfileAvatarSection
            avatarUrl={profileUser.avatarUrl}
            name={profileUser.name}
            email={profileUser.email}
            onEditPress={() =>
              Alert.alert('Edit photo', 'Photo picker not wired yet.')
            }
          />
          <ProfileStatsRow
            activeBookings={profileUser.activeBookings}
            timeSavedMinutes={profileUser.timeSavedMinutes}
          />

          <ProfileMenuRow
            icon={
              <BookingHistoryIcon
                width={MENU_ICON_SIZE}
                height={MENU_ICON_SIZE}
              />
            }
            title="Booking History"
            subtitle="View all your past appointments"
            onPress={() =>
              Alert.alert('Booking History', 'History screen not wired yet.')
            }
          />
          <ProfileMenuRow
            icon={
              <SavedCenterIcon width={MENU_ICON_SIZE} height={MENU_ICON_SIZE} />
            }
            title="Saved Centers"
            subtitle="Manage your favorite locations"
            onPress={() =>
              Alert.alert('Saved Centers', 'Favorites not wired yet.')
            }
          />
          <ProfileMenuRow
            icon={
              <SettingsMenuIcon width={MENU_ICON_SIZE} height={MENU_ICON_SIZE} />
            }
            title="Settings"
            subtitle="Privacy, alerts, and preferences"
            onPress={() =>
              Alert.alert('Settings', 'Preferences screen not wired yet.')
            }
          />

          <ProfileLogoutButton onPress={onLogout} />

          <Text style={styles.footer}>
            {`QUEUELESS ${appBuildLabel} | PROFILE`}
          </Text>
        </ScrollView>
        <BottomTabBar activeTab="profile" onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: profileTheme.screenBg,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  scrollInner: {
    paddingHorizontal: homeSpacing.screenHorizontal,
    paddingTop: 4,
  },
  footer: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: profileTheme.footerLabel,
    marginBottom: 4,
  },
});
