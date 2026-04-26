import { Modal, Pressable, StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';
import { homeTheme } from '../../theme/homeTheme';
import { profileTheme } from '../../theme/profileTheme';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

type NavItem = { label: string; route: string; emoji: string };

type SidebarDrawerProps = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  currentRoute?: string;
  /** Pass the user's role to show the correct nav items */
  userRole?: 'customer' | 'provider' | string;
};

const CUSTOMER_ITEMS: NavItem[] = [
  { label: 'Home', route: 'Home', emoji: '🏠' },
  { label: 'My Bookings', route: 'Queue', emoji: '🎟️' },
  { label: 'Profile', route: 'Profile', emoji: '👤' },
];

const PROVIDER_ITEMS: NavItem[] = [
  { label: 'Dashboard', route: 'ProviderDashboard', emoji: '📊' },
  { label: 'Live Queue', route: 'QueueManagement', emoji: '🔢' },
  { label: 'Services', route: 'ServiceManager', emoji: '🛠️' },
  { label: 'Settings', route: 'ProviderSettings', emoji: '⚙️' },
];

export function SidebarDrawer({
  visible,
  onClose,
  onNavigate,
  currentRoute,
  userRole,
}: SidebarDrawerProps) {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  if (!visible) return null;

  const isProvider = userRole === 'provider';
  const navItems = isProvider ? PROVIDER_ITEMS : CUSTOMER_ITEMS;
  const roleLabel = isProvider ? 'Provider Portal' : 'Customer';

  return (
    <Modal visible={visible} transparent={true} animationType="none" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.header}>
            <Text style={styles.brand}>QueueLess</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleLabel}>{roleLabel}</Text>
            </View>
          </View>

          <View style={styles.navItems}>
            {navItems.map(item => {
              const isActive = currentRoute === item.route;
              return (
                <Pressable
                  key={item.route}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={() => onNavigate(item.route)}
                >
                  <Text style={[styles.navText, isActive && styles.navTextActive]}>
                    {item.emoji}  {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: profileTheme.screenBg,
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: homeTheme.border,
  },
  brand: {
    fontSize: 24,
    fontWeight: '800',
    color: homeTheme.primary,
    letterSpacing: -0.5,
  },
  roleBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: homeTheme.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  navItems: {
    paddingTop: 12,
  },
  navItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  navItemActive: {
    backgroundColor: '#eff6ff',
    borderRightWidth: 4,
    borderRightColor: homeTheme.primary,
  },
  navText: {
    fontSize: 17,
    fontWeight: '600',
    color: homeTheme.textSecondary,
  },
  navTextActive: {
    color: homeTheme.primary,
    fontWeight: '700',
  },
});
