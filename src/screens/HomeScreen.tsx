import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { loadBookingsThunk } from '../store/slices/bookingSlice';
import { fetchCategoriesThunk, searchProvidersThunk } from '../store/slices/discoverySlice';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BOOK_TOKEN_BUTTON_HEIGHT,
  BOOK_TOKEN_GAP_ABOVE_TAB,
  BottomTabBar,
  BookingCard,
  CategoryCard,
  FloatingBookTokenButton,
  getBottomTabBarTotalOffset,
  Header,
  SearchBar,
  ProviderSummaryCard,
} from '../components/home';
import type { CategoryItem, HomeTabKey } from '../components/home';
import type { HomeScreenProps } from '../navigation/types';
import type { Booking, Category, UserProfile, ServiceProvider } from '../types';
import { resolveCategoryIcon } from '../utils/categoryIconMap';
import { homeSpacing, homeTheme } from '../theme/homeTheme';

const COLUMN_GAP = 12;

/** Extra scroll padding below the floating Book Token bar. */
const SCROLL_PAD_BELOW_FLOAT = 16;

function mapCategoriesToRows(categories: Category[]): CategoryItem[] {
  return categories.map(c => ({
    id: c.id,
    name: c.name,
    Icon: resolveCategoryIcon(c.icon),
  }));
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const horizontal = homeSpacing.screenHorizontal;
  const cardWidth = (width - horizontal * 2 - COLUMN_GAP) / 2;

  const listRef = useRef<FlatList>(null);
  const searchListRef = useRef<FlatList>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useSelector((state: RootState) => state.auth);
  const { myBookings, loading: bookingsLoading } = useSelector((state: RootState) => state.bookings);
  const { categories, providers, loading: categoriesLoading } = useSelector((state: RootState) => state.discovery);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadBookingsThunk());
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        dispatch(searchProvidersThunk(searchQuery));
      }, 400);
      return () => clearTimeout(timeoutId);
    }
  }, [dispatch, searchQuery]);

  const categoryRows = useMemo(
    () => mapCategoriesToRows(categories),
    [categories],
  );

  const tabBarTotal = useMemo(
    () => getBottomTabBarTotalOffset(insets.bottom),
    [insets.bottom],
  );

  const bookTokenBottom = tabBarTotal + BOOK_TOKEN_GAP_ABOVE_TAB;

  const listBottomPadding =
    bookTokenBottom +
    BOOK_TOKEN_BUTTON_HEIGHT +
    SCROLL_PAD_BELOW_FLOAT;

  const renderCategory: ListRenderItem<CategoryItem> = useCallback(
    ({ item }) => (
      <CategoryCard
        item={item}
        width={cardWidth}
        onPress={() =>
          navigation.navigate('CategoryProviders', {
            categoryId: item.id,
            categoryName: item.name,
          })
        }
      />
    ),
    [cardWidth, navigation],
  );

  const renderProvider: ListRenderItem<ServiceProvider> = useCallback(
    ({ item }) => (
      <ProviderSummaryCard
        provider={item}
        onPress={() =>
          navigation.navigate('ProviderDetail', { providerId: item.id })
        }
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  const onTabPress = useCallback(
    (tab: HomeTabKey) => {
      if (tab === 'home') {
        return;
      }
      if (tab === 'bookings') {
        navigation.navigate('Queue');
      }
      if (tab === 'profile') {
        navigation.navigate('Profile');
      }
    },
    [navigation],
  );

  const commonHeader = (
    <>
      <Header
        greetingLine={user ? `Hello, ${user.displayName}` : 'Hello there'}
        headline="Ready to skip the wait?"
        avatarUrl={user?.avatarUrl ?? 'https://i.pravatar.cc/120?u=placeholder'}
      />
      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </>
  );

  const categoriesHeader = (
    <>
      {commonHeader}
      <View style={styles.sectionRow}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <Pressable hitSlop={8}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>
    </>
  );

  const searchHeader = (
    <>
      {commonHeader}
      <View style={styles.sectionRow}>
        <Text style={styles.categoriesTitle}>Search Results</Text>
      </View>
    </>
  );

  const ListFooter = useCallback(
    () => (
      <View style={styles.footerBlock}>
        <Text style={styles.recentSectionTitle}>Recent Bookings</Text>
        {myBookings.slice(0, 3).map(item => (
          <BookingCard key={item.id} item={item} onPress={() => {
            if (item.status === 'ACTIVE') {
              navigation.navigate('TokenConfirmation', { bookingId: item.id });
            } else {
              navigation.navigate('BookingDetails', { bookingId: item.id });
            }
          }} />
        ))}
      </View>
    ),
    [myBookings, navigation],
  );

  if (categoriesLoading && !searchQuery) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={homeTheme.background} />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={homeTheme.primary} />
        </View>
        <BottomTabBar activeTab="home" onTabPress={onTabPress} />
      </SafeAreaView>
    );
  }

  const isSearching = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={homeTheme.background} />
      <View style={styles.content}>
        {isSearching ? (
          <FlatList
            key="search-list"
            ref={searchListRef}
            data={providers}
            keyExtractor={keyExtractor}
            renderItem={renderProvider}
            ListHeaderComponent={searchHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: listBottomPadding },
            ]}
            ListEmptyComponent={
              !categoriesLoading ? (
                <Text style={styles.emptySearch}>No providers found.</Text>
              ) : (
                <ActivityIndicator size="small" color={homeTheme.primary} style={{ marginTop: 20 }} />
              )
            }
          />
        ) : (
          <FlatList
            key="category-list"
            ref={listRef}
            data={categoryRows}
            keyExtractor={keyExtractor}
            renderItem={renderCategory}
            numColumns={2}
            ListHeaderComponent={categoriesHeader}
            ListFooterComponent={ListFooter}
            columnWrapperStyle={styles.columnWrap}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: listBottomPadding },
            ]}
          />
        )}
        <FloatingBookTokenButton
          bottom={bookTokenBottom}
          onPress={() => {
            import('react-native').then(({ Alert }) => {
              Alert.alert('Find a Provider', 'Please select a Category or search for a service center first to book a token!');
            });
            if (isSearching) {
              searchListRef.current?.scrollToOffset({ offset: 0, animated: true });
            } else {
              listRef.current?.scrollToOffset({ offset: 0, animated: true });
            }
          }}
        />
        <BottomTabBar activeTab="home" onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: homeTheme.background,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  listContent: {
    paddingHorizontal: homeSpacing.screenHorizontal,
  },
  footerBlock: {
    marginTop: 20,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: homeTheme.text,
  },
  recentSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: homeTheme.text,
    marginBottom: 14,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: homeTheme.link,
  },
  columnWrap: {
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  emptySearch: {
    textAlign: 'center',
    marginTop: 32,
    color: homeTheme.textMuted,
    fontSize: 16,
  },
});
