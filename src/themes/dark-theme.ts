import { colorPalette as palette, resolveColor } from '@/themes/color-palette';
import type { Theme } from '@/types';
import { getFontShorthand } from '@/utils/theme.ts';

export const darkTheme: Theme = {
  variant: 'dark',

  palette,

  color: {
    background: 'black',
    paper: 'black',

    text: {
      normal: palette.grey['400'],
      emphasized: palette.grey['900'],
      control: palette.blue['800'],
      active: palette.blue['900'],
    },

    button: {
      primary: {
        color: palette.blue['800'],
        active: palette.blue['900'],
        text: 'white',
      },

      secondary: {
        color: palette.grey['50'],
        active: palette.grey['100'],
        text: palette.grey['900'],
      },

      tertiary: {
        color: palette.blue['50'],
        active: palette.blue['100'],
        text: palette.blue['800'],
      },
    },

    border: '#e5e7f6', // interpolate?

    value: resolveColor,
  },

  radius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },

  font: {
    family: 'Inter,sans-serif',

    size: {
      xs: '8px',
      sm: '10px',
      tiny: '12px',
      base: '14px',
      lg: '16px',
      xl: '20px',
      xxl: '24px',
      xxxl: '28px',
    },

    weight: {
      lighter: 200,
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 500,
      bold: 600,
    },

    short: getFontShorthand,
  },

  spacing: {
    horizontal: '24px',
    vertical: '16px',
  },

  padding: {
    vertical: '8px',
    horizontal: '16px',
  },
};
