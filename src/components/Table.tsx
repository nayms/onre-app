import React from 'react';
import styled, { css } from 'styled-components';
import { PanelContent } from './Panel';

export const TablePanelContainer = styled(PanelContent)`
  padding: 0;
`;

const TableContainer = styled.div`
  position: relative;
  overflow-x: auto;
  scrollbar-color: lightgrey white;
  scrollbar-width: thin;
`;

const TableRoot = styled.table`
  min-width: 100%;
  height: 0; // HACK: A horrible hack in 2024
  border-collapse: collapse;
`;

export const TableRow = styled.tr`
  height: 32px;
  padding: 8px 0;

  background-color: transparent;
  will-change: background-color;
  transition: background-color 0.2s;

  &.selected {
    background-color: ${({ theme }) => theme.palette.blue['50']};
  }
`;

export const TableHeader = styled.thead`
  color: ${({ theme }) => theme.palette.grey['400']};
  text-align: left;

  ${TableRow}:last-child {
    border-bottom: 1px solid #f0f0f0;
  }
`;

export const TableBody = styled.tbody`
  ${TableRow}:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

export const TableCellBaseStyle = css`
  &:first-child {
    padding-left: 24px;
  }

  &:last-child {
    padding-right: 24px;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 8px 16px;
  background-color: #fafcff;

  font-weight: 500;

  ${TableCellBaseStyle}
`;

export const TableCell = styled.td`
  position: relative;
  padding: 8px 16px;
  white-space: nowrap;

  ${TableCellBaseStyle}
`;

export type TableCellProps<T extends {} = {}, K extends keyof T = any> = {
  value: T[K];
  index: number;
  row: T;
  rowIndex: number;
  onCellClick?: (cell: TableCellProps<T>) => any;
};

export type TableCellConfig<T extends {} = {}, K extends keyof T = any> = {
  key?: K;
  header?: React.ReactNode;
  HeaderCell?: React.ComponentType;
  Cell?: React.ComponentType;
  Value?: React.ComponentType<TableCellProps<T, K> & React.TdHTMLAttributes<HTMLTableCellElement>>;
  align?: 'left' | 'center' | 'right' | 'justify' | 'char';
  width?: number | string;
  onCellClick?: (cell: TableCellProps<T>) => any;
};

type TableProps<T extends {}> = {
  cells: TableCellConfig<T>[];
  data: T[];
  rowClassName?: (args: { row: T; rowIndex: number }) => string;
  onCellClick?: (cell: TableCellProps<T>) => any;
} & Omit<React.HTMLProps<HTMLTableElement>, 'data' | 'onClick'>;

const DefaultValue = ({ value }: TableCellProps) => `${value}`;

export const Table = <T extends {}>({
  cells,
  data,
  rowClassName,
  onCellClick,
  ...props
}: TableProps<T>): React.ReactNode => (
  <TableContainer>
    <TableRoot {...props}>
      <TableHeader>
        <TableRow>
          {cells.map(({ header, align, width, HeaderCell = TableHeaderCell }, i) =>
            header === null ? null : (
              <HeaderCell key={i} align={align} {...{ width }}>
                {header}
              </HeaderCell>
            ),
          )}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={`row-${rowIndex}`} className={rowClassName?.({ row, rowIndex })}>
            {cells.map(({ Value = DefaultValue, align, width, key, Cell = TableCell }, index) => {
              // @ts-ignore - :shrug:
              const value = key !== undefined ? row[key] : undefined;
              return (
                <Cell
                  key={`cell-${rowIndex}-${index}`}
                  align={align}
                  width={width}
                  onClick={() =>
                    onCellClick?.({
                      value,
                      index,
                      row,
                      rowIndex,
                    })
                  }
                >
                  <Value
                    value={value}
                    index={index}
                    row={row}
                    rowIndex={rowIndex}
                    // @ts-ignore
                    onCellClick={onCellClick}
                  />
                </Cell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  </TableContainer>
);
