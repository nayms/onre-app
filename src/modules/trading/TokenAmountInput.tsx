import React from 'react';
import styled from 'styled-components';

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

const Input = styled.input<{ $invalid?: boolean }>`
  font-family: ${props => props.theme.font.family};
  font-size: 28px;
  font-weight: 500;
  flex: 0 1 100%;
  max-width: 80%;
  width: 100%;

  border: none;
  color: ${props => (props.$invalid ? props.theme.palette.red['600'] : '#949ca9')};
  background: transparent;

  &:focus {
    color: #1a1c24;
    outline: none;
  }
`;

const Symbol = styled.div`
  flex: 1 1 20%;
  font-size: 28px;
  font-weight: 400;
  text-align: right;
  white-space: nowrap;
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
  disabled?: boolean;
  invalid?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export const TokenAmountInput: React.FC<TokenAmountProps> = ({
  className,
  label,
  controls,
  symbol,
  summary,
  value,
  disabled,
  invalid,
  onChange,
}) => (
  <InputContainer className={className}>
    <SuperLine>
      <Label>{label}</Label>
      {controls && <Controls>{controls}</Controls>}
    </SuperLine>

    <InputLine>
      <Input $invalid={invalid} placeholder="0" value={value} onChange={onChange} disabled={disabled} />
      {symbol && <Symbol>{symbol}</Symbol>}
    </InputLine>

    <SubLine>{summary}</SubLine>
  </InputContainer>
);
