import React, { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { Column, Row } from '@/components/Layout.tsx';

const TextColumn = styled(Column)`
  color: #5c6175;
  font-weight: 400;
  em {
    font-style: normal;
    font-weight: 600;
    color: #1a1c23;
  }
`;

const LeftColumn = styled(TextColumn)`
  text-align: left;
`;

const RightColumn = styled(TextColumn)`
  text-align: right;
  margin-left: auto;
`;

const ValueRow = styled(Row)<{ $border?: boolean }>`
  &:not(:first-child) {
    padding-top: 8px;
  }

  &:not(:last-child) {
    ${({ $border }) =>
      $border
      && css`
        border-bottom: 1px solid #e5e7f6;
      `}
    padding-bottom: 8px;
  }
`;

type ValueDisplayProps = {
  label: React.ReactNode;
  value: React.ReactNode;
};

export const ValueGroup = styled.div`
  padding: 12px 0;

  &:not(:last-child) {
    margin-bottom: 12px;
  }
`;

export const ValueDisplay: React.FC<ValueDisplayProps> = ({ label, value }) => (
  <ValueRow>
    <LeftColumn>{label}</LeftColumn>
    <RightColumn>{value}</RightColumn>
  </ValueRow>
);

export const TokenAmountGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  &:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const ControlLink = styled.a`
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  color: #1b37f2;
  &:hover {
    text-decoration: underline;
    color: #293bba;
  }
`;

type LinkControlProps = HTMLAttributes<HTMLAnchorElement>;
export const LinkControl: React.FC<React.PropsWithChildren<LinkControlProps>> = ({ onClick, children }) => (
  <ControlLink onClick={onClick}>{children}</ControlLink>
);

const Summary = styled.div`
  margin-left: auto;
  height: 24px;
  align-content: end;

  color: #5c6175;
  font-weight: 400;
  em {
    font-style: normal;
    font-weight: 400;
    color: #1a1c23;
  }
`;

type BalanceSummaryProps = { value?: string | number };
export const BalanceSummary: React.FC<BalanceSummaryProps> = ({ value }) => (
  <Summary>
    Balance: <em>{value}</em>
  </Summary>
);
