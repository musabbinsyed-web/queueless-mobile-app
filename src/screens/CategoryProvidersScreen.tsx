import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchProvidersByCategoryThunk } from '../store/slices/discoverySlice';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProviderSummaryCard } from '../components/home';
import type { RootStackParamList } from '../navigation/types';
import type { ServiceProvider } from '../types';
import { homeSpacing, homeTheme } from '../theme/homeTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryProviders'>;

export function CategoryProvidersScreen({ route, navigation }: Props) {
  const { categoryId, categoryName } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { providers, loading } = useSelector((state: RootState) => state.discovery);

  useLayoutEffect(() => {
    navigation.setOptions({ title: categoryName });
  }, [categoryName, navigation]);

  useEffect(() => {
    dispatch(fetchProvidersByCategoryThunk(categoryId));
  }, [dispatch, categoryId]);

  const renderItem = useCallback<ListRenderItem<ServiceProvider>>(
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

  const keyExtractor = useCallback((item: ServiceProvider) => item.id, []);

  const ListHeader = useCallback(() => {
    const count = providers.length;
    return (
      <View style={styles.summaryBanner}>
        <Text style={styles.summaryCount}>{count}</Text>
        <View style={styles.summaryTextCol}>
          <Text style={styles.summaryTitle}>
            {count === 1 ? 'Provider' : 'Providers'} in this category
          </Text>
          <Text style={styles.summarySub}>
            Names, locations, busyness, and how many services each offers.
          </Text>
        </View>
      </View>
    );
  }, [providers.length]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={homeTheme.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.listFlex}
      data={providers}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <Text style={styles.empty}>No providers found for this category.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeTheme.background,
  },
  listFlex: {
    flex: 1,
    backgroundColor: homeTheme.background,
  },
  list: {
    paddingHorizontal: homeSpacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: homeTheme.background,
  },
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: homeTheme.surface,
    borderRadius: homeSpacing.cardRadius,
    padding: 16,
    marginBottom: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: homeTheme.border,
    gap: 14,
  },
  summaryCount: {
    fontSize: 32,
    fontWeight: '800',
    color: homeTheme.primary,
    minWidth: 44,
  },
  summaryTextCol: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: homeTheme.text,
    marginBottom: 4,
  },
  summarySub: {
    fontSize: 13,
    lineHeight: 18,
    color: homeTheme.textSecondary,
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 15,
    color: homeTheme.textMuted,
  },
});
