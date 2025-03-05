export type CSSColorValue = `#${string}` | 'white' | 'black' | 'transparent';

export type ColorIntensity = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export type ColorName = 'grey' | 'blue' | 'purple' | 'lightBlue' | 'green' | 'red' | 'yellow';

export type PaletteColor = `${ColorName}.${ColorIntensity}`;

export type ColorPalette = Record<ColorName, Record<ColorIntensity, CSSColorValue>>;

export type Theme = {
  // TBD
  font: {
    family: string;
  };
};
