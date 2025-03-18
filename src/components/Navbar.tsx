import React from 'react';
import styled, { useTheme } from 'styled-components';
import { useThemeSwitcher } from '@/data/ThemeProvider.tsx';
import { WalletButton } from '@/data/SolanaProvider.tsx';

const NavbarContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  gap: 20px;
  border-bottom: 1px solid ${props => props.theme.color.border};
  background-color: transparent;
  font-family: ${props => props.theme.font.family};
`;

const ThemeButton = styled.button<{ $active?: boolean }>`
  background-color: ${props => (props.$active ? 'red' : 'white')};
`;

// @ts-ignore
const ThemeToggle = () => {
  const theme = useTheme();
  const onThemeChange = useThemeSwitcher();

  return (
    <div style={{ display: 'block', marginLeft: 'auto' }}>
      <ThemeButton $active={theme.variant === 'light'} onClick={() => onThemeChange('light')}>
        Light
      </ThemeButton>
      <ThemeButton $active={theme.variant === 'dark'} onClick={() => onThemeChange('dark')}>
        Dark
      </ThemeButton>
    </div>
  );
};

const Logo = styled.img.attrs({ src: './favicon.svg' })``;

export const Navbar: React.FC = () => (
  <NavbarContainer>
    <Logo />

    <WalletButton />

    {/*<ThemeToggle />*/}
  </NavbarContainer>
);
