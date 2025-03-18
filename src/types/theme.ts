import type { RuleSet } from 'styled-components';

export type ThemeVariant = 'light' | 'dark';

export type CSSColorValue = `#${string}` | 'white' | 'black' | 'transparent';

export type ColorIntensity = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export type ColorName = 'grey' | 'blue' | 'purple' | 'lightBlue' | 'green' | 'red' | 'yellow';

export type PaletteColor = `${ColorName}.${ColorIntensity}`;

export type ColorPalette = Record<ColorName, Record<ColorIntensity, CSSColorValue>>;

export type ColorResolver = (c: CSSColorValue | PaletteColor) => CSSColorValue;

export type FontSizeKey = 'xs' | 'sm' | 'tiny' | 'base' | 'lg' | 'xl' | 'xxl' | 'xxxl';

export type FontWeightKey = 'lighter' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold';

export type FontShorthandResolver = (arg?: {
  size?: FontSizeKey | string;
  weight?: FontWeightKey | number;
  lineHeight?: string | number;
}) => RuleSet<object>;

export type ButtonType = 'primary' | 'secondary' | 'tertiary';

export type ButtonColorKey = 'color' | 'active' | 'text';

export type BorderRadiusKey = 'small' | 'medium' | 'large';

export type SizeMetricKeys = 'horizontal' | 'vertical';

export type Theme = {
  variant: ThemeVariant;

  palette: ColorPalette;

  color: {
    background: CSSColorValue;
    paper: CSSColorValue;

    text: {
      normal: CSSColorValue;
      emphasized: CSSColorValue;
      control: CSSColorValue;
      active: CSSColorValue;
    };

    button: Record<ButtonType, Record<ButtonColorKey, CSSColorValue>>;

    border: CSSColorValue;

    value: ColorResolver;
  };

  font: {
    family: string;

    size: Record<FontSizeKey, string>;

    weight: Record<FontWeightKey, number>;

    short: FontShorthandResolver;
  };

  radius: Record<BorderRadiusKey, string>;

  spacing: Record<SizeMetricKeys, string>;

  padding: Record<SizeMetricKeys, string>;
};
