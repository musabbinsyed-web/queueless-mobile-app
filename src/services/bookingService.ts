import type { Booking, TokenConfirmationData } from '../types';
import { randomDelay } from './api';
import { SEED_BOOKINGS } from './data/bookingsSeed';

/**
 * User booking history & detail — replace with authenticated API later.
 */
export async function getBookings(): Promise<Booking[]> {
  await randomDelay();
  return [...SEED_BOOKINGS];
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  await randomDelay();
  const found = SEED_BOOKINGS.find(b => b.id === bookingId);
  return found ?? null;
}

function hashId(id: string): number {
  return id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
}

/** Maps a booking row to the token confirmation screen (defaults when fields absent). */
export function bookingToTokenConfirmationData(b: Booking): TokenConfirmationData {
  const h = hashId(b.id);
  const tokenDisplay = String(
    b.tokenNumber ?? 400 + (h % 80),
  );
  const queuePosition = b.queuePosition ?? 3 + (h % 9);
  const est = b.waitMinutes ?? 15 + (h % 25);
  const progress = b.liveProgressPercent ?? 40 + (h % 50);
  const finished = b.finishedPeopleAhead ?? 2 + (h % 6);

  return {
    tokenDisplay,
    serviceName: b.subtitle,
    providerName: b.name,
    location: b.address,
    queuePosition,
    estimatedWaitMinutes: est,
    liveProgressPercent: progress,
    finishedPeopleCount: finished,
  };
}
