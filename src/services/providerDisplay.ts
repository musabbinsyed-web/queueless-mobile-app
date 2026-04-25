import type {
  Service,
  ServiceDisplay,
  ServiceProvider,
  ServiceProviderDetail,
} from '../types';

const NAME_TO_DESCRIPTION: Record<string, string> = {
  'General Checkup': 'Routine visits and preventive care',
  'Blood Test': 'Laboratory diagnostics and panels',
  'X-Ray': 'Diagnostic imaging',
  'Specialist Consultation': 'Expert physician review',
  Haircut: 'Cut, wash, and style',
  'Beard Styling': 'Trim, line-up, and shaping',
  Facial: 'Skin treatment and consultation',
  'Hair Spa': 'Deep conditioning and scalp care',
  'Bonafide Certificate': 'Official enrollment verification letter',
  'Fee Payment': 'Tuition, housing, and campus fees',
  'ID Card Issue': 'New or replacement campus ID',
  'Table Booking': 'Reserve seating for your party',
  'Takeaway Order': 'Order ahead for pickup',
  'Family Dining': 'Larger tables for groups',
};

const WAIT_MINUTES = [8, 12, 15, 18, 22, 28, 35, 42, 45];

function hashId(id: string): number {
  return id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

function describeService(name: string): string {
  return NAME_TO_DESCRIPTION[name] ?? `Book ${name.toLowerCase()}`;
}

function waitEstimateFor(serviceId: string): string {
  const m = WAIT_MINUTES[hashId(serviceId) % WAIT_MINUTES.length];
  return `~${m}m`;
}

function toDisplay(service: Service): ServiceDisplay {
  return {
    ...service,
    description: describeService(service.name),
    waitEstimate: waitEstimateFor(service.id),
  };
}

/**
 * Adds copy + wait labels for the provider detail screen (until API returns them).
 */
export function enrichProviderDetail(
  provider: ServiceProvider,
): ServiceProviderDetail {
  return {
    ...provider,
    services: provider.services.map(toDisplay),
  };
}
