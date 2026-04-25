/**
 * Light theme tokens for post-login Home UI.
 */
export const homeTheme = {
  background: '#f4f6f9',
  surface: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  primary: '#2563eb',
  primaryPressed: '#1d4ed8',
  link: '#2563eb',
  border: '#e5e7eb',
  searchBg: '#eef1f5',
  tabActiveBg: '#dcfce7',
  tabActiveIcon: '#16a34a',
  tabInactive: '#9ca3af',
  shadow: '#0f172a',
  badgeActive: '#22c55e',
  badgeActiveText: '#ffffff',
  /** Pill on booking rows (mint background, dark green label). */
  badgeActiveSoftBg: '#E6FAF2',
  badgeActiveSoftText: '#166534',
  badgeCompletedBg: '#f3f4f6',
  badgeCompletedText: '#6b7280',
} as const;

export const homeSpacing = {
  screenHorizontal: 20,
  sectionGap: 24,
  cardRadius: 16,
  buttonRadius: 14,
  searchRadius: 25,
} as const;
