import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchSavedCentersThunk } from '../store/slices/savedCenterSlice';
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
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedCenters'>;

export function SavedCentersScreen({ navigation }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { savedCenters, loading } = useSelector((state: RootState) => state.savedCenters);

  useEffect(() => {
    dispatch(fetchSavedCentersThunk());
  }, [dispatch]);

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
    const count = savedCenters.length;
    return (
      <View style={styles.summaryBanner}>
        <Text style={styles.summaryCount}>{count}</Text>
        <View style={styles.summaryTextCol}>
          <Text style={styles.summaryTitle}>
            Saved Centers
          </Text>
          <Text style={styles.summarySub}>
            Quick access to your favorite clinics and studios.
          </Text>
        </View>
      </View>
    );
  }, [savedCenters.length]);

  if (loading && savedCenters.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={homeTheme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <FlatList
        style={styles.listFlex}
        data={savedCenters}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>You haven't saved any centers yet.</Text>
            <Text style={styles.emptySub}>Tap the heart icon on any clinic to save it here.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: homeTheme.background,
  },
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
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  empty: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: homeTheme.text,
    marginBottom: 8,
  },
  emptySub: {
    textAlign: 'center',
    fontSize: 14,
    color: homeTheme.textSecondary,
    paddingHorizontal: 40,
  },
});
