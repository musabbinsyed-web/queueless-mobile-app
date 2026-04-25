/**
 * Shared domain types — used by services and UI.
 * Keep serializable (no React components here).
 */

/** Keys used to resolve category icons in the UI layer. */
export type CategoryIconId =
  | 'hospital'
  | 'salon'
  | 'college'
  | 'restaurant';

export type Category = {
  id: string;
  name: string;
  icon: CategoryIconId;
};

export type Service = {
  id: string;
  name: string;
  /** Human-readable, e.g. "45 min" */
  duration: string;
  /** Display price, e.g. "$85" */
  price: string;
};

/** Queue / foot-traffic level for a venue (from API or estimates). */
export type ProviderBusyness = 'low' | 'moderate' | 'high';

export type ServiceProvider = {
  id: string;
  name: string;
  categoryId: string;
  image: string;
  rating: number;
  location: string;
  busyness: ProviderBusyness;
  /** Approximate people on-site (for “current visitors” UI). */
  currentVisitors: number;
  services: Service[];
};

/** Service row on provider detail (enriched in the service layer for UI). */
export type ServiceDisplay = Service & {
  description: string;
  /** e.g. "~12m" */
  waitEstimate: string;
};

export type ServiceProviderDetail = Omit<ServiceProvider, 'services'> & {
  services: ServiceDisplay[];
};

export type BookingStatus = 'ACTIVE' | 'COMPLETED';

export type Booking = {
  id: string;
  name: string;
  subtitle: string;
  status: BookingStatus;
  imageUrl: string;
  bookedAt: string;
  address: string;
  waitMinutes?: number;
  referenceCode: string;
  /** Active token / confirmation screen (optional until API provides). */
  tokenNumber?: number;
  queuePosition?: number;
  liveProgressPercent?: number;
  finishedPeopleAhead?: number;
};

/** Payload for the token confirmation / active queue UI. */
export type TokenConfirmationData = {
  tokenDisplay: string;
  serviceName: string;
  providerName: string;
  location: string;
  queuePosition: number;
  estimatedWaitMinutes: number;
  liveProgressPercent: number;
  finishedPeopleCount: number;
};

export type UserProfile = {
  displayName: string;
  avatarUrl: string;
};
