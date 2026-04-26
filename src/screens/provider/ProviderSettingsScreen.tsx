import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDispatch, RootState } from '../../store';
import { logoutThunk } from '../../store/slices/authSlice';
import { fetchMyVenueThunk, updateMyVenueThunk } from '../../store/slices/providerSlice';

import { ProviderTabBar, getProviderTabBarTotalOffset, ProviderTabKey } from '../../components/provider/ProviderTabBar';
import {
  ProfileAvatarSection,
  ProfileHeader,
  ProfileLogoutButton,
  ProfileMenuRow,
  SidebarDrawer,
} from '../../components/profile';
import type { ProviderSettingsScreenProps } from '../../navigation/types';
import { homeSpacing, homeTheme } from '../../theme/homeTheme';
import { profileTheme } from '../../theme/profileTheme';
import SettingsMenuIcon from '../../assets/icons/settings_icon.svg';

// Dynamic require after all ES imports — react-native-image-picker needs native rebuild to link
let launchImageLibrary: ((opts: any) => Promise<any>) | null = null;
try { launchImageLibrary = require('react-native-image-picker').launchImageLibrary; } catch (_) {}

const MENU_ICON_SIZE = 48;

export function ProviderSettingsScreen({ navigation }: ProviderSettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const tabOffset = getProviderTabBarTotalOffset(insets.bottom);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { myProviderDetails, loading } = useSelector((state: RootState) => state.provider);

  const [venueModalVisible, setVenueModalVisible] = useState(false);
  const [busynessModalVisible, setBusynessModalVisible] = useState(false);
  const [savingVenue, setSavingVenue] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [venueName, setVenueName] = useState('');
  const [venueLocation, setVenueLocation] = useState('');
  const [busyness, setBusyness] = useState<'low' | 'moderate' | 'high'>('low');

  useEffect(() => {
    if (!myProviderDetails?.id) {
      dispatch(fetchMyVenueThunk());
    }
  }, [dispatch, myProviderDetails?.id]);

  const onLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => dispatch(logoutThunk()) },
    ]);
  }, [dispatch]);

  const onTabPress = useCallback(
    (tab: ProviderTabKey) => {
      if (tab === 'settings') return;
      if (tab === 'dashboard') navigation.navigate('ProviderDashboard');
      if (tab === 'queue') navigation.navigate('QueueManagement');
      if (tab === 'services') navigation.navigate('ServiceManager');
    },
    [navigation]
  );

  const onDrawerNavigate = useCallback(
    (route: string) => {
      setDrawerVisible(false);
      // Provider drawer maps to provider screens
      if (route === 'ProviderDashboard') navigation.navigate('ProviderDashboard');
      else if (route === 'QueueManagement') navigation.navigate('QueueManagement');
      else if (route === 'ServiceManager') navigation.navigate('ServiceManager');
      else if (route === 'ProviderSettings') return; // already here
    },
    [navigation]
  );

  /* ── Photo Picker ── */
  const onEditPhoto = useCallback(async () => {
    if (!launchImageLibrary) {
      Alert.alert(
        'Rebuild Required',
        'Photo picker needs a native rebuild. Run: npx react-native run-android',
      );
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });

    if (result.didCancel || !result.assets?.length) return;

    const uri = result.assets[0].uri;
    if (!uri) return;

    try {
      await dispatch(updateMyVenueThunk({
        imageUrl: uri,
      })).unwrap();
      dispatch(fetchMyVenueThunk());
    } catch (err: any) {
      Alert.alert('Error', String(err?.message || err || 'Failed to update photo'));
    }
  }, [dispatch, myProviderDetails]);

  /* ── Venue Detail Modal ── */
  const openVenueModal = () => {
    setVenueName(myProviderDetails?.name || '');
    setVenueLocation(myProviderDetails?.location || '');
    setVenueModalVisible(true);
  };

  const saveVenueDetails = async () => {
    if (!venueName.trim()) {
      Alert.alert('Validation', 'Venue name cannot be empty.');
      return;
    }
    setSavingVenue(true);
    try {
      await dispatch(updateMyVenueThunk({
        name: venueName.trim(),
        location: venueLocation.trim(),
      })).unwrap();
      dispatch(fetchMyVenueThunk());
      setVenueModalVisible(false);
    } catch (err: any) {
      Alert.alert('Error', String(err?.message || err || 'Failed to update venue details'));
    } finally {
      setSavingVenue(false);
    }
  };

  /* ── Busyness Modal ── */
  const openBusynessModal = () => {
    setBusyness(myProviderDetails?.busyness || 'low');
    setBusynessModalVisible(true);
  };

  const saveBusyness = async () => {
    try {
      await dispatch(updateMyVenueThunk({
        busyness,
      })).unwrap();
      dispatch(fetchMyVenueThunk());
      setBusynessModalVisible(false);
    } catch (err: any) {
      Alert.alert('Error', String(err?.message || err || 'Failed to update busyness'));
    }
  };

  const avatarUrl = myProviderDetails?.image || user?.avatarUrl || 'https://i.pravatar.cc/150?img=11';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={profileTheme.screenBg} />
      <View style={styles.content}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollInner,
            { paddingBottom: tabOffset + 24 },
          ]}>

          <ProfileHeader
            avatarUrl={user?.avatarUrl ?? 'https://i.pravatar.cc/150?img=11'}
            onMenuPress={() => setDrawerVisible(true)}
            onAvatarPress={() => setDrawerVisible(true)}
          />

          <ProfileAvatarSection
            avatarUrl={avatarUrl}
            name={user?.displayName ?? myProviderDetails?.name ?? 'Demo Provider'}
            email={user?.email ?? 'provider@example.com'}
            onEditPress={onEditPhoto}
          />

          {/* Venue Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Venue Management</Text>
            <ProfileMenuRow
              icon={<SettingsMenuIcon width={MENU_ICON_SIZE} height={MENU_ICON_SIZE} />}
              title="Edit Venue Details"
              subtitle={myProviderDetails?.name ? `Name: ${myProviderDetails.name}` : 'Update name & location'}
              onPress={openVenueModal}
            />
            <ProfileMenuRow
              icon={<SettingsMenuIcon width={MENU_ICON_SIZE} height={MENU_ICON_SIZE} />}
              title="Busyness Override"
              subtitle={`Currently: ${myProviderDetails?.busyness ?? '—'}`}
              onPress={openBusynessModal}
            />
          </View>

          <ProfileLogoutButton onPress={onLogout} />

        </ScrollView>
        <ProviderTabBar activeTab="settings" onTabPress={onTabPress} />
        
        <SidebarDrawer 
          visible={drawerVisible} 
          onClose={() => setDrawerVisible(false)} 
          onNavigate={onDrawerNavigate}
          currentRoute="ProviderSettings"
          userRole="provider"
        />
      </View>

      {/* ── Edit Venue Details Modal ── */}
      <Modal
        visible={venueModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVenueModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Venue Details</Text>
            <Pressable onPress={() => setVenueModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Venue Name</Text>
            <TextInput
              style={styles.input}
              value={venueName}
              onChangeText={setVenueName}
              placeholder="e.g. Acme Barbershop"
              placeholderTextColor="#999"
              autoCapitalize="words"
            />

            <Text style={styles.label}>Location / Address</Text>
            <TextInput
              style={styles.input}
              value={venueLocation}
              onChangeText={setVenueLocation}
              placeholder="e.g. 123 Main St."
              placeholderTextColor="#999"
            />

            <Pressable
              style={[styles.saveBtn, savingVenue && styles.saveBtnDisabled]}
              onPress={saveVenueDetails}
              disabled={savingVenue}>
              <Text style={styles.saveBtnText}>{savingVenue ? 'Saving…' : 'Save Details'}</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ── Busyness Override Modal ── */}
      <Modal
        visible={busynessModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setBusynessModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Busyness Override</Text>
            <Pressable onPress={() => setBusynessModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Current Traffic Status</Text>

            <View style={styles.radioGroup}>
              {(['low', 'moderate', 'high'] as const).map(b => (
                <Pressable
                  key={b}
                  style={[styles.radioOption, busyness === b && styles.radioActive]}
                  onPress={() => setBusyness(b)}
                >
                  <Text style={[styles.radioText, busyness === b && styles.radioActiveText]}>
                    {b.charAt(0).toUpperCase() + b.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.saveBtn} onPress={saveBusyness}>
              <Text style={styles.saveBtnText}>Update Busyness</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

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
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: homeTheme.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  // Modal
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  cancelText: { fontSize: 16, color: '#0052D0' },
  formContainer: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: '#f4f6f9',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e1e5eb',
  },
  saveBtn: {
    backgroundColor: '#0052D0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  // Radio Buttons
  radioGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  radioOption: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  radioActive: {
    borderColor: '#0052D0',
    backgroundColor: '#0052D0',
  },
  radioText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  radioActiveText: {
    color: '#fff',
  },
});
