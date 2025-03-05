import React, { useState } from 'react';
import styled, { css } from 'styled-components';
// import CaretDownIcon from '@/assets/caret-down-sharp.svg';

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

export const AccordionPanel = styled(PanelContainer)``;

export const AccordionTitle = styled(PanelTitle)``;

const CaretDownIcon = '';
const AccordionToggleButton = styled.button<{ expanded: boolean }>`
  position: absolute;
  right: 24px;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 8px;
  // background: #f0f1fd url(${CaretDownIcon}) no-repeat center center;
  background-size: 12px;
  cursor: pointer;
  will-change: transform;
  transform: rotate(${p => (p.expanded ? '180deg' : '0deg')});
  transition: transform 0.2s linear;
`;

const AccordionContent = styled.div<{ expanded: boolean }>`
  width: 100%;
  overflow: hidden;
  color: #676c7a;
  ${p =>
    p.expanded
      ? css`
          height: auto;
          padding: 18px 24px;
          border-bottom: 1px solid #f0f0f0;
        `
      : css`
          height: 0;
          padding: 0 24px;
          border-bottom: none;
        `};
`;

export const AccordionSection: React.FC<React.PropsWithChildren<{ title: React.ReactNode }>> = ({
  title,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(!expanded);

  return (
    <>
      <AccordionTitle onClick={handleToggle}>
        {title}
        <AccordionToggleButton expanded={expanded} />
      </AccordionTitle>
      <AccordionContent expanded={expanded}>{children}</AccordionContent>
    </>
  );
};

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
