// @ts-ignore - Remove when the dark theme is ready
import { lightTheme, darkTheme } from '@/themes';
import { css } from 'styled-components';

import type { FontShorthandResolver, FontSizeKey, FontWeightKey, Theme, ThemeVariant } from '@/types';

const THEME_VARIANT_STORAGE_KEY = 'themeVariant';
const DEFAULT_THEME_VARIANT: ThemeVariant = 'light';

// @ts-ignore - Remove when the dark theme is ready
const getDefaultThemeVariant = (): ThemeVariant => {
  if (!window.matchMedia) return DEFAULT_THEME_VARIANT;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const isThemeVariant = (value?: string | null): value is ThemeVariant => !!value && ['light', 'dark'].includes(value);

export const getSavedThemeVariant = (): ThemeVariant | null => {
  const variant = localStorage.getItem(THEME_VARIANT_STORAGE_KEY);
  return isThemeVariant(variant) ? variant : null;
};

export const setThemeVariant = (variant: ThemeVariant): void =>
  localStorage.setItem(THEME_VARIANT_STORAGE_KEY, variant);

export const getActiveTheme = (): Theme => {
  return lightTheme;

  // TODO: Uncomment when the dark theme is ready
  // const variant = getSavedThemeVariant() || getDefaultThemeVariant();
  // return variant === 'light' ? lightTheme : darkTheme;
};

export const activateThemeVariant = (variant: ThemeVariant): Theme => {
  setThemeVariant(variant);
  return getActiveTheme();
};

const isFontSizeKey = (size: string): size is FontSizeKey =>
  ['xs', 'sm', 'tiny', 'base', 'lg', 'xl', 'xxl', 'xxxl'].includes(size);

const isFontWeightKey = (weight: string | number): weight is FontWeightKey =>
  typeof weight === 'string' && ['lighter', 'light', 'regular', 'medium', 'semibold', 'bold'].includes(weight);

export const getFontShorthand: FontShorthandResolver = ({ size = 'base', weight = 'regular', lineHeight } = {}) => css`
  ${({ theme: { font } }) =>
    [
      isFontWeightKey(weight) ? font.weight[weight] : weight,
      (isFontSizeKey(size) ? font.size[size] : size) + (lineHeight ? `/${lineHeight}` : ''),
      font.family,
    ].join(' ')}
`;
