import { createGlobalStyle, css, withTheme } from 'styled-components';
import { Theme } from '@/types';

export const GlobalStyles = withTheme(createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :root {
    --tblr-font-sans-serif: "Inter";
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
    line-height: 1.35;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body, html, #root {
    height: 100%;
  }

  i {
   font-style: normal;
  }

  p, h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  a {
    ${({
      theme: {
        color: {
          button: { primary },
        },
      },
    }) => css`
      text-decoration: none;
      color: ${primary.color};

      &:hover {
        color: ${primary.active};
        text-decoration: underline;
      }
    `};
  }
`);

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
