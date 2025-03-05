import { colorPalette as palette, resolveColor } from '@/themes/color-palette';
import { Theme } from '@/types';

export const defaultTheme: Theme = {
  variant: 'onRe',

  color: {
    background: 'white',
    paper: 'white',
    text: 'black',
    link: palette.blue['700'],

    // TODO: REMOVE
    navbar: {
      background: '#fff',
      border: palette.grey['50'],
    },

    view: {
      background: '#fafbfe',
    },

    button: {
      primary: {
        background: palette.blue['600'],
        text: '#fff',
        border: '#000',
        hover: palette.blue['700'],
        disabledBackground: palette.grey['100'],
      },

      secondary: {
        background: '#ECF1F4',
        text: palette.grey['900'],
        border: '#ECF1F4',
        hover: '#E7EAF1',
        disabledColor: palette.grey['100'],
      },

      icon: {
        background: '#fff',
      },
    },

    value: resolveColor,
  },

  palette,

  font: {
    family: 'Inter,sans-serif',

    // Sizes 'lighter', 'light' and 'bold' are not used
    weight: {
      lighter: 400,
      light: 400,
      regular: 400,
      medium: 500,
      semiBold: 500,
      bold: 600,
    },

    size: {
      xs: '8px',
      sm: '10px',
      tiny: '12px',
      base: '14px',
      lg: '16px',
      xl: '20px',
      xxl: '24px',
      '3xl': '28px',
    },

    lineHeight: {
      xs: 'normal',
      sm: 'normal',
      tiny: 'normal',
      base: 'normal',
      lg: 'normal',
      xl: 'normal',
      xxl: 'normal',
      '3xl': 'normal',
    },

    letterSpacing: {
      xs: 'normal',
      sm: 'normal',
      tiny: 'normal',
      base: 'normal',
      lg: 'normal',
      xl: 'normal',
      xxl: 'normal',
      '3xl': 'normal',
    },

    // TODO: WIP
    // sizes: {
    //   h1: { size: 28, weight: 'medium' },
    //   h2: { size: 24, weight: 'medium' },
    //   h3: { size: 20, weight: 'medium' },
    //   large: { size: 16, weight: 'medium' },
    //   regular: { size: 14, weight: 'regular' },
    //   small: { size: 12 },
    // },

    // shorthand: getFontShorthand,
  },

  // TODO: WIP
  borderRadius: {
    inner: 8,
    outer: 12,
  },

  //@ts-ignore
  spacing: (device: Device): GeometryDescriptor =>
    device === 'phone'
      ? { horizontal: 16, vertical: 12 }
      : device === 'tablet'
        ? { horizontal: 24, vertical: 16 }
        : // desktop
          { horizontal: 24, vertical: 16 },

  // spacing: {
  //   // TODO: WIP
  //   //baseline: 4,
  //   vertical: 12,
  //   horizontal: 12,
  // },

  // TODO: WIP
  padding: {
    vertical: 8,
    horizontal: 16,
  },
};
