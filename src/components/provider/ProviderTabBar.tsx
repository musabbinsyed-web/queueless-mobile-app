import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutDashboard, Users, ClipboardList, Settings } from 'lucide-react-native';
import { homeTheme } from '../../theme/homeTheme';

export type ProviderTabKey = 'dashboard' | 'queue' | 'services' | 'settings';

type Props = {
  activeTab: ProviderTabKey;
  onTabPress: (tab: ProviderTabKey) => void;
};

export const TAB_BAR_BASE_HEIGHT = 64;

export function getProviderTabBarTotalOffset(bottomInset: number) {
  return TAB_BAR_BASE_HEIGHT + Math.max(bottomInset, 12);
}

export function ProviderTabBar({ activeTab, onTabPress }: Props) {
  const insets = useSafeAreaInsets();
  const safeBottom = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.container, { paddingBottom: safeBottom }]}>
      <TabItem
        label="Dashboard"
        icon={LayoutDashboard}
        isActive={activeTab === 'dashboard'}
        onPress={() => onTabPress('dashboard')}
      />
      <TabItem
        label="Queue"
        icon={Users}
        isActive={activeTab === 'queue'}
        onPress={() => onTabPress('queue')}
      />
      <TabItem
        label="Services"
        icon={ClipboardList}
        isActive={activeTab === 'services'}
        onPress={() => onTabPress('services')}
      />
      <TabItem
        label="Settings"
        icon={Settings}
        isActive={activeTab === 'settings'}
        onPress={() => onTabPress('settings')}
      />
    </View>
  );
}

function TabItem({
  label,
  icon: Icon,
  isActive,
  onPress,
}: {
  label: string;
  icon: any;
  isActive: boolean;
  onPress: () => void;
}) {
  const color = isActive ? homeTheme.primary : '#94A3B8';
  return (
    <Pressable style={styles.tab} onPress={onPress}>
      <Icon size={24} color={color} strokeWidth={isActive ? 2.5 : 2} style={styles.icon} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: homeTheme.border,
    flexDirection: 'row',
    height: TAB_BAR_BASE_HEIGHT,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
