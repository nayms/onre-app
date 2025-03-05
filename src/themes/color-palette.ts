import { ColorPalette, CSSColorValue, PaletteColor } from '@/types';

const greyColors = {
  50: '#E7EBF1',
  100: '#D1D7E2',
  200: '#949CA9',
  300: '#7C8593',
  400: '#6B7381',
  500: '#494F5F',
  600: '#3F4452',
  700: '#343843',
  800: '#2A2D36',
  900: '#1A1C24',
} as const;

const blueColors = {
  50: '#EFF1FF',
  100: '#D8DDFF',
  200: '#BEC7FF',
  300: '#9CA9FF',
  400: '#7183FA',
  500: '#566BFF',
  600: '#3950ED',
  700: '#293BBA',
  800: '#152598',
  900: '#101D74',
} as const;

const purpleColors = {
  50: '#F5F3FF',
  100: '#EDE9FE',
  200: '#DDD6FE',
  300: '#C4B5FD',
  400: '#A78BFA',
  500: '#8B5CF6',
  600: '#7C3AED',
  700: '#6D28D9',
  800: '#5B21B6',
  900: '#4C1D95',
} as const;

const lightBlueColors = {
  50: '#ECFEFF',
  100: '#CFFAFE',
  200: '#A5F3FC',
  300: '#67E8F9',
  400: '#22D3EE',
  500: '#06B6D4',
  600: '#0891B2',
  700: '#0E7490',
  800: '#155E75',
  900: '#164E63',
} as const;

const greenColors = {
  50: '#F0FDFA',
  100: '#CCFBF1',
  200: '#99F6E4',
  300: '#5EEAD4',
  400: '#2DD4BF',
  500: '#14B8A6',
  600: '#0D9488',
  700: '#0F766E',
  800: '#115E59',
  900: '#134E4A',
} as const;

const redColors = {
  50: '#FFF1F2',
  100: '#FFE4E6',
  200: '#FECDD3',
  300: '#FDA4AF',
  400: '#FB7185',
  500: '#F43F5E',
  600: '#E11D48',
  700: '#BE123C',
  800: '#9F1239',
  900: '#881337',
} as const;

const yellowColors = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B',
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
} as const;

export const colorPalette: ColorPalette = {
  grey: greyColors,
  blue: blueColors,
  purple: purpleColors,
  lightBlue: lightBlueColors,
  green: greenColors,
  red: redColors,
  yellow: yellowColors,
};

const initialColorCacheEntries = (): [PaletteColor, CSSColorValue][] =>
  Object.entries(colorPalette).flatMap(([name, colors]) =>
    Object.entries(colors).map(
      ([intensity, value]) => [`${name}.${intensity}`, value] as [PaletteColor, CSSColorValue],
    ),
  );

// Cache of palette colors
const paletteColorCache = new Map<PaletteColor | string, CSSColorValue>(initialColorCacheEntries());

// Matches `#abc`, `#112233` and `#11223344`
const rxColorValue = /^#[\da-f]{3}(?:[\da-f]{3}(?:[\da-f]{2})?)?$/i;
const isColorValue = (c: string | CSSColorValue): c is CSSColorValue =>
  ['white', 'black', 'transparent'].includes(c) || rxColorValue.test(c);

// We disallow arbitrary values
export const resolveColor = (c: PaletteColor | string): CSSColorValue =>
  paletteColorCache.get(c) ?? (isColorValue(c) ? c : 'transparent');
