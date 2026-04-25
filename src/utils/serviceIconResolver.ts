import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';
import BookingHistoryIcon from '../assets/icons/booking_history_icon.svg';
import CollegeIcon from '../assets/icons/college_icon.svg';
import HospitalIcon from '../assets/icons/hospital_icon.svg';
import RestaurantIcon from '../assets/icons/restaurant_icon.svg';
import SaloonIcon from '../assets/icons/saloon_icon.svg';
import SavedCenterIcon from '../assets/icons/saved-center_icon.svg';
import SettingsIcon from '../assets/icons/settings_icon.svg';

/**
 * Soft tile behind category-aligned service icons on provider detail rows.
 */
export function serviceIconBubbleColor(categoryId: string): string {
  switch (categoryId) {
    case 'cat-hospital':
      return '#dbeafe';
    case 'cat-salon':
      return '#fce7f3';
    case 'cat-college':
      return '#e0e7ff';
    case 'cat-restaurant':
      return '#ffedd5';
    default:
      return '#f1f5f9';
  }
}

type IconComponent = FC<SvgProps>;

const DEFAULT_ICON: IconComponent = BookingHistoryIcon;

/**
 * Picks an icon by category and service name (keyword fallbacks for mixed catalogs).
 */
export function resolveServiceListIcon(
  serviceName: string,
  categoryId: string,
): IconComponent {
  const lower = serviceName.toLowerCase();

  if (categoryId === 'cat-hospital') {
    return HospitalIcon;
  }
  if (categoryId === 'cat-salon') {
    return SaloonIcon;
  }
  if (categoryId === 'cat-restaurant') {
    return RestaurantIcon;
  }
  if (categoryId === 'cat-college') {
    return CollegeIcon;
  }

  if (
    /hospital|health|medical|clinic|checkup|blood|x-ray|xray|lab|radiology|vaccin|consult/i.test(
      lower,
    )
  ) {
    return HospitalIcon;
  }
  if (/hair|beard|facial|spa|salon|style|cut|trim/i.test(lower)) {
    return SaloonIcon;
  }
  if (/table|takeaway|dining|restaurant|food|order|drink|coffee/i.test(lower)) {
    return RestaurantIcon;
  }
  if (/bonafide|fee|id card|certificate|college|registrar|campus/i.test(lower)) {
    return CollegeIcon;
  }
  if (/setting|preference|privacy|account/i.test(lower)) {
    return SettingsIcon;
  }
  if (/save|favorite|bookmark|center/i.test(lower)) {
    return SavedCenterIcon;
  }

  return DEFAULT_ICON;
}
