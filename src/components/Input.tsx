import styled from 'styled-components';

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  position: relative;
  appearance: none;
  outline-color: ${({ theme }) => theme.color.text.active};
  width: 16px;
  height: 16px;
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 3px;

  &:disabled {
    opacity: 0.5;
  }

  will-change: background-color, border-color;
  transition:
    background-color 0.2s,
    border-color 0.2s;

  border: 2px solid #949ca9;

  &:not(:disabled) {
    cursor: pointer;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.palette.grey['500']};
  }

  &:checked {
    border-color: ${({ theme }) => theme.palette.blue['600']};
    background-color: ${({ theme }) => theme.palette.blue['600']};
    &:after {
      content: '';
    }
  }

  &:checked:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.color.text.active};
    background-color: ${({ theme }) => theme.color.text.active};
  }

  &:after {
    position: absolute;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2IiBmaWxsPSJub25lIj48cGF0aCBkPSJNMTIgNi4yMzUyOUwxMC43MjczIDVMNy4wOTA5MSA4LjUyOTQxTDUuMjcyNzMgNi43NjQ3MUw0IDhMNy4wOTA5MSAxMUwxMiA2LjIzNTI5WiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=');
    background-repeat: no-repeat;
    background-size: 16px;
    width: 16px;
    height: 16px;
    top: -2px;
    left: -2px;
  }
`;

export const Toggle = styled.input.attrs({ type: 'checkbox' })`
  position: relative;
  appearance: none;
  outline-color: ${({ theme }) => theme.color.text.active};
  width: 32px;
  height: 20px;
  border-radius: 10px;

  &:disabled {
    opacity: 0.5;
  }

  &:not(:disabled) {
    cursor: pointer;
  }

  will-change: background-color;
  transition: background-color 0.2s;
  background-color: ${({ theme }) => theme.palette.blue['100']};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.color.text.control};
  }

  &:checked {
    background-color: ${({ theme }) => theme.color.text.control};
  }

  &:checked:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.color.text.active};
  }

  &:after {
    position: absolute;
    content: '';
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    will-change: left;
    transition: left 0.2s;
    top: 2px;
    left: 2px;
  }

  &:checked:after {
    left: 14px;
  }
`;

export const Label = styled.label`
  display: inline-block;
  padding-left: 23px;

  // Leading checkbox with the label text following it
  &:has(${Checkbox}:first-child) {
    text-indent: -23px;
    cursor: pointer;
  }

  ${Checkbox} {
    &:first-child {
      margin-left: 0;
      margin-right: 0.5em;
    }
    vertical-align: -3px;
  }
`;
