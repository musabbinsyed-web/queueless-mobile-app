import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';
import CollegeIcon from '../assets/icons/college_icon.svg';
import HospitalIcon from '../assets/icons/hospital_icon.svg';
import RestaurantIcon from '../assets/icons/restaurant_icon.svg';
import SaloonIcon from '../assets/icons/saloon_icon.svg';
import type { CategoryIconId } from '../types';

/**
 * Maps API `Category.icon` keys to SVG components (UI concern only).
 */
export const CATEGORY_ICON_MAP: Record<CategoryIconId, FC<SvgProps>> = {
  hospital: HospitalIcon,
  salon: SaloonIcon,
  college: CollegeIcon,
  restaurant: RestaurantIcon,
};

export function resolveCategoryIcon(icon: CategoryIconId): FC<SvgProps> {
  return CATEGORY_ICON_MAP[icon];
}
