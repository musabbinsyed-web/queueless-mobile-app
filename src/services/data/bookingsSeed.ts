import type { Booking } from '../../types';

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    name: 'City Health Hospital',
    subtitle: 'General Checkup',
    status: 'ACTIVE',
    imageUrl:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=200&fit=crop&q=80',
    bookedAt: 'Mar 12, 2026 · 9:30 AM',
    address: '1200 Wellness Blvd, Suite 200',
    waitMinutes: 20,
    referenceCode: 'QL-HSP-20491',
    tokenNumber: 402,
    queuePosition: 5,
    liveProgressPercent: 80,
    finishedPeopleAhead: 4,
  },
  {
    id: 'b2',
    name: 'Modern Edge Salon',
    subtitle: 'Hair Styling',
    status: 'COMPLETED',
    imageUrl:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop&q=80',
    bookedAt: 'Mar 8, 2026 · 2:15 PM',
    address: '88 Style District, Floor 1',
    referenceCode: 'QL-SLN-19802',
  },
];
