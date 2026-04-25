import { useCallback, useEffect, useMemo, useState } from 'react';
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
} from '../components/home';
import type { CategoryItem, HomeTabKey } from '../components/home';
import { getBookings, getCategories, getCurrentUser } from '../services';
import type { HomeScreenProps } from '../navigation/types';
import type { Booking, Category, UserProfile } from '../types';
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

  const [categories, setCategories] = useState<Category[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cats, books, profile] = await Promise.all([
          getCategories(),
          getBookings(),
          getCurrentUser(),
        ]);
        if (!cancelled) {
          setCategories(cats);
          setBookings(books);
          setUser(profile);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const keyExtractor = useCallback((item: CategoryItem) => item.id, []);

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

  const ListHeader = useCallback(
    () => (
      <>
        <Header
          greetingLine={
            user ? `Hello, ${user.displayName}` : 'Hello there'
          }
          headline="Ready to skip the wait?"
          avatarUrl={
            user?.avatarUrl ??
            'https://i.pravatar.cc/120?u=placeholder'
          }
        />
        <SearchBar />
        <View style={styles.sectionRow}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <Pressable hitSlop={8}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>
      </>
    ),
    [user],
  );

  const ListFooter = useCallback(
    () => (
      <View style={styles.footerBlock}>
        <Text style={styles.recentSectionTitle}>Recent Bookings</Text>
        {bookings.map(item => (
          <BookingCard key={item.id} item={item} />
        ))}
      </View>
    ),
    [bookings],
  );

  if (loading) {
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

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={homeTheme.background} />
      <View style={styles.content}>
        <FlatList
          data={categoryRows}
          keyExtractor={keyExtractor}
          renderItem={renderCategory}
          numColumns={2}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          columnWrapperStyle={styles.columnWrap}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: listBottomPadding },
          ]}
        />
        <FloatingBookTokenButton
          bottom={bookTokenBottom}
          onPress={() => {
            /* Token booking flow — wire later */
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
});
