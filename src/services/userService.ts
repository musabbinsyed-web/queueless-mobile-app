import type { UserProfile } from '../types';
import { randomDelay } from './api';
import { SEED_CURRENT_USER } from './data/userSeed';

/**
 * Current session user — replace with auth/session service later.
 */
export async function getCurrentUser(): Promise<UserProfile> {
  await randomDelay();
  return { ...SEED_CURRENT_USER };
}
