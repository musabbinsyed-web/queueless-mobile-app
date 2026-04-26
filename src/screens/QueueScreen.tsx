import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { AppDispatch, RootState } from '../store';
import { loadBookingsThunk } from '../store/slices/bookingSlice';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomTabBar,
  BookingCard,
  getBottomTabBarTotalOffset,
} from '../components/home';
import type { BookingItem, HomeTabKey } from '../components/home';
import type { QueueScreenProps } from '../navigation/types';
import { homeSpacing, homeTheme } from '../theme/homeTheme';

export function QueueScreen({ navigation }: QueueScreenProps) {
  const insets = useSafeAreaInsets();
  const tabOffset = getBottomTabBarTotalOffset(insets.bottom);
  const dispatch = useDispatch<AppDispatch>();
  const { myBookings, loading } = useSelector((state: RootState) => state.bookings);

  useFocusEffect(
    useCallback(() => {
      dispatch(loadBookingsThunk());
    }, [dispatch])
  );

  const onTabPress = useCallback(
    (tab: HomeTabKey) => {
      if (tab === 'home') {
        navigation.navigate('Home');
        return;
      }
      if (tab === 'bookings') {
        return;
      }
      if (tab === 'profile') {
        navigation.navigate('Profile');
      }
    },
    [navigation],
  );

  const renderItem = useCallback<ListRenderItem<BookingItem>>(
    ({ item }) => (
      <BookingCard
        item={item}
        onPress={() => {
          if (item.status === 'ACTIVE') {
            navigation.navigate('TokenConfirmation', { bookingId: item.id });
          } else {
            navigation.navigate('BookingDetails', { bookingId: item.id });
          }
        }}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: BookingItem) => item.id, []);

  const ListHeader = useCallback(
    () => (
      <View style={styles.headerBlock}>
        <Text style={styles.heading}>Recent Bookings</Text>
        <Text style={styles.subheading}>
          Tap a booking for service details, location, and status.
        </Text>
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={homeTheme.background} />
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={homeTheme.primary} />
          </View>
        ) : (
          <FlatList
            data={myBookings}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={ListHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: tabOffset + 24 },
            ]}
          />
        )}
        <BottomTabBar activeTab="bookings" onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: homeTheme.background,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: homeSpacing.screenHorizontal,
    paddingTop: 16,
  },
  headerBlock: {
    marginBottom: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: homeTheme.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: 15,
    lineHeight: 22,
    color: homeTheme.textSecondary,
    marginBottom: 16,
  },
});
