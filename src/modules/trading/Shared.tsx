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

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #f8f9fc;
  border: 1px solid #f0f1fe;
  padding: 12px;

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const SuperLine = styled.div`
  display: flex;
  justify-content: space-between;
  height: 24px;
  color: #5c6175;
  font-weight: 400;
`;

const Label = styled.div``;
const Controls = styled.div``;
const InputLine = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  font-family: ${props => props.theme.font.family};
  font-size: 28px;
  font-weight: 500;
  field-sizing: content;

  border: none;
  color: #949ca9;
  background: transparent;

  &:focus {
    color: #1a1c24;
    outline: none;
  }
`;

const Symbol = styled.div`
  font-size: 28px;
  font-weight: 400;
  color: #949ca9;
`;

const SubLine = styled.div`
  display: flex;
`;

type TokenAmountProps = {
  label?: React.ReactNode;
  controls?: React.ReactNode;
  symbol?: string;
  summary?: React.ReactNode;
  value?: string | number;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export const TokenAmountInput: React.FC<TokenAmountProps> = ({
  className,
  label,
  controls,
  symbol,
  summary,
  value,
  onChange,
}) => (
  <InputContainer className={className}>
    <SuperLine>
      <Label>{label}</Label>
      {controls && <Controls>{controls}</Controls>}
    </SuperLine>

    <InputLine>
      <Input placeholder="0" value={value} onChange={onChange} />
      {symbol && <Symbol>{symbol}</Symbol>}
    </InputLine>

    <SubLine>{summary}</SubLine>
  </InputContainer>
);

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border: none;
  border-radius: 8px;

  cursor: pointer;

  width: 100%;
  color: white;
  background-color: #1b37f2;

  &:focus {
    outline: none;
    box-shadow: 0 0 8px #293bba80;
  }

  &:hover {
    background-color: #293bba;
  }

  &:disabled {
    background-color: #d8dbf9;
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
