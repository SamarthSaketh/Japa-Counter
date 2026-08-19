/**
 * theme.ts
 * Central design tokens for Japa Counter — inspired by the DailyBliss
 * serene / devotional visual language (soft lavender-blue gradients,
 * warm dusk photography, a single lotus mark as the recurring motif).
 *
 * Usage: import { colors, gradients } from '@/constants/theme';
 */

export const colors = {
  // Base surfaces
  bg: '#0B0E14',              // pure-black-adjacent, used on the counting screen
  bgSoft: '#F4F1FB',          // light mode background (setup/history/settings)
  bgSoftDark: '#14121C',      // dark mode background (setup/history/settings)

  // Brand / accent — dusky lavender-to-rose, echoes the reference screenshots
  primary: '#8B7CD8',
  primaryDeep: '#5B4E9E',
  accentRose: '#E3936B',
  accentGold: '#E8C77E',

  // Text
  textOnDark: '#F7F5FB',
  textOnDarkMuted: 'rgba(247,245,251,0.68)',
  textOnLight: '#241F35',
  textOnLightMuted: 'rgba(36,31,53,0.6)',

  // Card surface (glass-over-photo)
  cardOverlay: 'rgba(20,14,30,0.35)',
  cardBorder: 'rgba(255,255,255,0.14)',

  // Status
  success: '#7FBF8F',
  warning: '#E0A94E',
};

// Gradient pairs for LinearGradient — each maps loosely to one of the
// reference card photos (dusk sky, ocean, night sky, palm/forest).
export const gradients = {
  dusk: ['#3A2E52', '#8A5A63', '#E3936B'] as const,
  ocean: ['#0F2A3D', '#1F4F5C', '#3C7A80'] as const,
  night: ['#0A0F2C', '#1B2450', '#3D3A76'] as const,
  forest: ['#0E2A1F', '#1E4633', '#3C6B4A'] as const,
  screenBg: ['#1A1430', '#0B0E14'] as const, // counting screen backdrop
  homeBg: ['#EDE9FA', '#F7F4FC'] as const,   // light home background
};

export const radii = {
  card: 22,
  pill: 999,
  sheet: 28,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  // Expo default system font stack reads clean; swap fontFamily for a
  // bundled serif/display font (e.g. 'PlayfairDisplay_600SemiBold' via
  // @expo-google-fonts) if you want the same editorial feel as the
  // reference cards' quote typography.
  display: { fontSize: 32, fontWeight: '600' as const, letterSpacing: -0.3 },
  title: { fontSize: 22, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.4 },
  counter: { fontSize: 96, fontWeight: '200' as const }, // the big tap number
};
