import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { PanelContainer, PanelTitle } from '@/components/Panel.tsx';
// import CaretDownIcon from '@/assets/caret-down-sharp.svg';

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
    p.expanded ?
      css`
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

const toggle = (v: boolean) => !v;

export const AccordionSection: React.FC<React.PropsWithChildren<{ title: React.ReactNode }>> = ({
  title,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(toggle);

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
