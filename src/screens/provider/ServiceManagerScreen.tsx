import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  fetchMyVenueThunk,
  addServiceThunk,
  updateServiceThunk,
  deleteServiceThunk,
} from '../../store/slices/providerSlice';
import { ProviderTabBar, getProviderTabBarTotalOffset, ProviderTabKey } from '../../components/provider/ProviderTabBar';
import type { ServiceManagerScreenProps } from '../../navigation/types';
import { homeSpacing, homeTheme } from '../../theme/homeTheme';

export function ServiceManagerScreen({ navigation }: ServiceManagerScreenProps) {
  const insets = useSafeAreaInsets();
  const tabOffset = getProviderTabBarTotalOffset(insets.bottom);

  const dispatch = useDispatch<AppDispatch>();
  const { myProviderDetails, loading } = useSelector((state: RootState) => state.provider);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  
  const [serviceName, setServiceName] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');

  // Fetch venue on mount if not loaded
  useEffect(() => {
    if (!myProviderDetails?.id) {
      dispatch(fetchMyVenueThunk());
    }
  }, [dispatch, myProviderDetails?.id]);

  const services = myProviderDetails?.services || [];

  const onTabPress = useCallback(
    (tab: ProviderTabKey) => {
      if (tab === 'services') return;
      if (tab === 'dashboard') navigation.navigate('ProviderDashboard');
      if (tab === 'queue') navigation.navigate('QueueManagement');
      if (tab === 'settings') navigation.navigate('ProviderSettings');
    },
    [navigation]
  );

  const onAddService = () => {
    setEditingServiceId(null);
    setServiceName('');
    setServiceDuration('');
    setServicePrice('');
    setServiceDesc('');
    setModalVisible(true);
  };

  const onEditService = (service: any) => {
    setEditingServiceId(service.id);
    setServiceName(service.name);
    setServiceDuration(service.duration);
    setServicePrice(service.price);
    setServiceDesc(service.description || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!serviceName || !serviceDuration || !servicePrice) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (!myProviderDetails?.id) return;

    try {
      if (editingServiceId) {
        await dispatch(updateServiceThunk({
          providerId: myProviderDetails.id,
          serviceId: editingServiceId,
          name: serviceName,
          duration: serviceDuration,
          price: servicePrice,
          description: serviceDesc,
        })).unwrap();
      } else {
        await dispatch(addServiceThunk({
          providerId: myProviderDetails.id,
          name: serviceName,
          duration: serviceDuration,
          price: servicePrice,
          description: serviceDesc,
        })).unwrap();
      }
      
      // Refresh the venue list to get updated services
      dispatch(fetchMyVenueThunk());
      setModalVisible(false);
    } catch (err: any) {
      Alert.alert('Error', err || 'Failed to save service');
    }
  };

  const handleDelete = () => {
    if (!editingServiceId || !myProviderDetails?.id) return;
    
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteServiceThunk({
                providerId: myProviderDetails.id,
                serviceId: editingServiceId,
              })).unwrap();
              dispatch(fetchMyVenueThunk());
              setModalVisible(false);
            } catch (err: any) {
              Alert.alert('Error', err || 'Failed to delete service');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <Pressable style={styles.serviceCard} onPress={() => onEditService(item)}>
      <View style={styles.cardLeft}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDetails}>{item.duration} • {item.price}</Text>
      </View>
      <Text style={styles.editBtn}>Edit</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f6f9" />
      <View style={styles.content}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Services</Text>
          <Pressable style={styles.addBtn} onPress={onAddService}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </Pressable>
        </View>

        <FlatList
          data={services}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.list, { paddingBottom: tabOffset + 24 }]}
        />

        <ProviderTabBar activeTab="services" onTabPress={onTabPress} />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingServiceId ? 'Edit Service' : 'Add Service'}</Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Service Name</Text>
            <TextInput
              style={styles.input}
              value={serviceName}
              onChangeText={setServiceName}
              placeholder="e.g. Haircut"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Duration</Text>
            <TextInput
              style={styles.input}
              value={serviceDuration}
              onChangeText={setServiceDuration}
              placeholder="e.g. 30 mins"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={servicePrice}
              onChangeText={setServicePrice}
              placeholder="e.g. $40"
              placeholderTextColor="#999"
              keyboardType="default"
            />
            
            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={serviceDesc}
              onChangeText={setServiceDesc}
              placeholder="Provide a brief description"
              placeholderTextColor="#999"
              multiline
            />

            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Service</Text>
            </Pressable>

            {editingServiceId && (
              <Pressable style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteBtnText}>Delete Service</Text>
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f6f9' },
  content: { flex: 1, position: 'relative' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: homeSpacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: homeTheme.text, letterSpacing: -0.5 },
  addBtn: {
    backgroundColor: '#0052D0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  list: { paddingHorizontal: homeSpacing.screenHorizontal },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: homeTheme.border,
  },
  cardLeft: {},
  serviceName: { fontSize: 16, fontWeight: '700', color: homeTheme.text, marginBottom: 4 },
  serviceDetails: { fontSize: 13, color: homeTheme.textSecondary },
  editBtn: { fontSize: 14, fontWeight: '700', color: '#0052D0' },
  
  // Modal styles
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
  textArea: { height: 100, textAlignVertical: 'top' },
  saveBtn: {
    backgroundColor: '#0052D0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  deleteBtn: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteBtnText: { color: '#ff3b30', fontSize: 16, fontWeight: '600' },
});
