import { createGlobalStyle, withTheme } from 'styled-components';
import { Theme } from '@/types';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

export const GlobalStyles = withTheme(createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    text-size-adjust: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${props => props.theme.font.family};
    font-weight: 400;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body, html, #root {
    height: 100%;
  }

  i {
    /* NOTE: At the moment, we don't support italics
    font-variation-settings: "slnt" -10; */
    font-style: normal;
  }

  p, h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }
`);
