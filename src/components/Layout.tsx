import styled, { css } from 'styled-components';

export const Row = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  gap: ${({ theme: { spacing } }) => spacing.large};
  width: 100%;
  padding: 0;
`;
//
// spacing: {
//    horizontal: '24px',
//    vertical: '16px',
//  },
//
//  padding: {
//    vertical: '8px',
//    horizontal: '16px',
//  },

type ColumnProps = {
  align?: 'left' | 'center' | 'right';
  alignSelf?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'center' | 'bottom';
};
export const Column = styled.div<ColumnProps>`
  // Refactor - this is maybe not needed
  ${props =>
    props.alignSelf === 'right' ?
      css`
        margin-left: auto;
      `
    : props.alignSelf === 'center' ?
      css`
        margin-left: auto;
        margin-right: auto;
      `
    : ``}

  ${props =>
    props.align === 'right' ?
      css`
        text-align: right;
      `
    : props.align === 'center' ?
      css`
        text-align: center;
      `
    : ``}

  ${props =>
    props.verticalAlign === 'center' ?
      css`
        align-content: center;
      `
    : props.verticalAlign === 'bottom' ?
      css`
        align-content: flex-end;
      `
    : ``}
`;
