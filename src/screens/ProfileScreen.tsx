import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk, updateProfileThunk } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store';
import { fetchUserStatsThunk } from '../store/slices/bookingSlice';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Pressable,
  Platform,
  Image as RNImage
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BookingHistoryIcon from '../assets/icons/booking_history_icon.svg';
import SavedCenterIcon from '../assets/icons/saved-center_icon.svg';
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
  SidebarDrawer,
} from '../components/profile';
const appBuildLabel = 'v1.0.0-beta';
import type { ProfileScreenProps } from '../navigation/types';
import { homeSpacing, homeTheme } from '../theme/homeTheme';
import { profileTheme } from '../theme/profileTheme';

const MENU_ICON_SIZE = 48;

const FOOTER_PAD = 8;

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const tabOffset = getBottomTabBarTotalOffset(insets.bottom);
  
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

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

  const onDrawerNavigate = useCallback(
    (route: string) => {
      setDrawerVisible(false);
      if (route === 'Home') navigation.navigate('Home');
      if (route === 'Queue') navigation.navigate('Queue');
      if (route === 'Profile') return;
    },
    [navigation]
  );

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { userStats } = useSelector((state: RootState) => state.bookings);

  useEffect(() => {
    dispatch(fetchUserStatsThunk());
  }, [dispatch]);

  const onLogout = useCallback(() => {
    dispatch(logoutThunk());
  }, [dispatch]);

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleOpenEdit = () => {
    setNewName(user?.displayName || '');
    setSelectedImage(null);
    setEditModalVisible(true);
  };

  const handleUpdateProfile = async () => {
    if (!newName.trim() && !selectedImage) {
      Alert.alert('No changes', 'Please change your name or select a new profile picture.');
      return;
    }
    setUpdatingProfile(true);
    try {
      const formData = new FormData();
      if (newName.trim()) {
        formData.append('displayName', newName.trim());
      }
      
      if (selectedImage) {
        formData.append('avatar', {
          uri: Platform.OS === 'android' ? selectedImage.uri : selectedImage.uri.replace('file://', ''),
          type: selectedImage.type,
          name: selectedImage.fileName || 'profile_pic.jpg',
        } as any);
      }

      const resultAction = await dispatch(updateProfileThunk(formData as any));
      if (resultAction.meta.requestStatus === 'fulfilled') {
        setEditModalVisible(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', resultAction.payload as string || 'Failed to update profile.');
      }
    } finally {
      setUpdatingProfile(false);
    }
  };

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
            avatarUrl={user?.avatarUrl ?? 'https://i.pravatar.cc/120?u=guest'}
            onMenuPress={() => setDrawerVisible(true)}
            onAvatarPress={() => {}}
          />
          <ProfileAvatarSection
            avatarUrl={user?.avatarUrl ?? 'https://i.pravatar.cc/120?u=guest'}
            name={user?.displayName ?? 'Demo User'}
            email={user?.email ?? 'demo@example.com'}
            onEditPress={handleOpenEdit}
          />
          <ProfileStatsRow
            activeBookings={userStats?.stats?.activeBookings || 0}
            timeSavedMinutes={userStats?.stats?.timeSavedMinutes || 0}
          />

          <ProfileMenuRow
            icon={
              <SavedCenterIcon
                width={MENU_ICON_SIZE}
                height={MENU_ICON_SIZE}
              />
            }
            title="Saved Centers"
            subtitle="View all your favorite clinics"
            onPress={() => navigation.navigate('SavedCenters')}
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
            onPress={() => navigation.navigate('Queue')}
          />

          <ProfileLogoutButton onPress={onLogout} />

          <Text style={styles.footer}>
            {`QUEUELESS ${appBuildLabel} | PROFILE`}
          </Text>
        </ScrollView>
        <BottomTabBar activeTab="profile" onTabPress={onTabPress} />
        
        <SidebarDrawer 
          visible={drawerVisible} 
          onClose={() => setDrawerVisible(false)} 
          onNavigate={onDrawerNavigate}
          currentRoute="Profile"
          userRole="customer"
        />

        {editModalVisible && (
          <Modal transparent={true} animationType="fade" onRequestClose={() => setEditModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                
                <View style={styles.imagePickerContainer}>
                  <RNImage 
                    source={{ uri: selectedImage?.uri || user?.avatarUrl || 'https://i.pravatar.cc/120?u=guest' }} 
                    style={styles.previewImage} 
                  />
                  <Pressable style={styles.pickImageBtn} onPress={handlePickImage}>
                    <Text style={styles.pickImageBtnText}>Change Photo</Text>
                  </Pressable>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={newName}
                    onChangeText={setNewName}
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                  />
                </View>

                <Pressable 
                  style={[styles.saveBtn, updatingProfile && { opacity: 0.7 }]} 
                  onPress={handleUpdateProfile}
                  disabled={updatingProfile}
                >
                  <Text style={styles.saveBtnText}>{updatingProfile ? 'Saving...' : 'Save Changes'}</Text>
                </Pressable>
                
                <Pressable style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    marginBottom: 10,
  },
  pickImageBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  pickImageBtnText: {
    color: homeTheme.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  saveBtn: {
    backgroundColor: homeTheme.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
