import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { Theme, ThemeVariant } from '@/types/theme';
import { activateThemeVariant, getActiveTheme } from '@/utils/theme.ts';

const theme = getActiveTheme();

type SwitchableThemeContextProps = { onThemeChange: (variant: ThemeVariant) => void };
const SwitchableThemeContext = createContext<SwitchableThemeContextProps>({ onThemeChange: () => null });

export const SwitchableThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(theme);

  const handleThemeChange = (variant: ThemeVariant) => {
    const theme = activateThemeVariant(variant);
    setCurrentTheme(theme);
  };

  return (
    <SwitchableThemeContext.Provider
      value={{
        onThemeChange: handleThemeChange,
      }}
    >
      <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
    </SwitchableThemeContext.Provider>
  );
};

export const useThemeSwitcher = () => useContext(SwitchableThemeContext).onThemeChange;
