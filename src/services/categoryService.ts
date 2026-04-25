import type { Category, ServiceProvider, ServiceProviderDetail } from '../types';
import { randomDelay } from './api';
import { SEED_CATEGORIES, SEED_PROVIDERS } from './data/categoryCatalog';
import { enrichProviderDetail } from './providerDisplay';

/**
 * Category & provider discovery — replace with HTTP calls later.
 */
export async function getCategories(): Promise<Category[]> {
  await randomDelay();
  return [...SEED_CATEGORIES];
}

export async function getProvidersByCategory(
  categoryId: string,
): Promise<ServiceProvider[]> {
  await randomDelay();
  return SEED_PROVIDERS.filter(p => p.categoryId === categoryId);
}

export async function getProviderDetails(
  providerId: string,
): Promise<ServiceProviderDetail | null> {
  await randomDelay();
  const found = SEED_PROVIDERS.find(p => p.id === providerId);
  return found ? enrichProviderDetail(found) : null;
}
