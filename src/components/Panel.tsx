import React from 'react';
import styled from 'styled-components';

export const PanelContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 12px;
  border: 1px solid #e5e7f6;
  overflow: hidden;
  background-color: white;
  color: #000;
  width: 100%;

  &:not(:first-child) {
    margin-top: 20px;
  }
`;

export const PanelTitle = styled.div`
  position: relative;
  padding: 16px 24px;
  width: 100%;
  border-bottom: 1px solid #e5e7f6;
  font-weight: 500;
`;

export const PanelContent = styled.div`
  width: 100%;
  padding: 20px 24px;
`;

export const Panel: React.FC<React.PropsWithChildren<{ title: React.ReactNode }>> = ({ title, children }) => (
  <PanelContainer>
    <PanelTitle>{title}</PanelTitle>
    <PanelContent>{children}</PanelContent>
  </PanelContainer>
);
