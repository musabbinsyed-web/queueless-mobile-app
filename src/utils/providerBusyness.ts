import type { ProviderBusyness } from '../types';

export function busynessLabel(level: ProviderBusyness): string {
  switch (level) {
    case 'low':
      return 'Low traffic';
    case 'moderate':
      return 'Moderate';
    case 'high':
      return 'Very busy';
    default:
      return level;
  }
}

export function busynessHint(level: ProviderBusyness): string {
  switch (level) {
    case 'low':
      return 'Short waits expected';
    case 'moderate':
      return 'Typical wait times';
    case 'high':
      return 'Longer waits likely';
    default:
      return '';
  }
}
