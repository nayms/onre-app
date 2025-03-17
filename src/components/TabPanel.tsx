import React from 'react';
import styled from 'styled-components';
import { PanelContainer, PanelContent, PanelTitle } from '@/components/Panel.tsx';

export const Tabs = styled.div<{ $padding?: string; $margin?: string }>`
  display: flex;
  justify-content: flex-start;
  column-gap: 20px;
  padding: ${props => (props.$padding ? props.$padding : '0 24px')};
  margin: ${props => (props.$margin ? props.$margin : '0 -24px -16px')};
`;

export const TabButton = styled.div<{ $active?: boolean }>`
  color: ${props => (props.$active ? '#000' : '#6B7381')};
  border-bottom: 2px solid ${props => (props.$active ? '#1B37F2' : 'transparent')};
  font-weight: 500;
  padding: 0 0 10px;
  cursor: pointer;
`;

type TabPanelProps = {
  tabs: React.ReactNode[];
  current: number;
  onChange: (n: number) => void;
};
export const TabPanel: React.FC<React.PropsWithChildren<TabPanelProps>> = ({ tabs, current, onChange, children }) => (
  <PanelContainer>
    <PanelTitle>
      <Tabs>
        {tabs.map((label, i) => (
          <TabButton key={`tab-${i}`} $active={current === i} onClick={() => onChange(i)}>
            {label}
          </TabButton>
        ))}
      </Tabs>
    </PanelTitle>
    <PanelContent>{children}</PanelContent>
  </PanelContainer>
);
