import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button, ValueGroup } from './Shared.tsx';
import { Table, TableCell, TableCellConfig, TableHeaderCell, TablePanelContainer } from '@/components/Table.tsx';
import { formatNumber } from '@/utils/number-formatting.ts';
import { Checkbox, Label, Toggle } from '@/components/Input.tsx';

import type { TradeRedemptionModel } from '@/modules/trading/types.ts';

type CollectFormProps = { data: TradeRedemptionModel[] };
type SelectableItem<T> = T & { selected: boolean };
type SelectableRedemptionModel = SelectableItem<TradeRedemptionModel>;

const ValueHeaderCell = styled(TableHeaderCell).attrs({ colSpan: 2 })`
  text-align: center;
  padding-right: 2px;
  text-indent: -20px;
  width: 50%;
`;

const ValueCell = styled(TableCell)`
  padding-right: 2px;
`;

const SymbolCell = styled(TableCell)`
  padding-left: 2px;
`;

const amountToCollectValueCell: TableCellConfig<SelectableRedemptionModel, 'amountToCollect'> = {
  key: 'amountToCollect',
  header: 'Send',
  align: 'right',
  Cell: ValueCell,
  HeaderCell: ValueHeaderCell,
  Value: ({ value: { value } }) => `${formatNumber(value, 0)}`,
};

const amountToCollectSymbolCell: TableCellConfig<SelectableRedemptionModel, 'amountToCollect'> = {
  key: 'amountToCollect',
  header: null, // allow for cell span
  Cell: SymbolCell,
  Value: ({ value: { symbol } }) => symbol,
};

const amountToReceiveValueCell: TableCellConfig<SelectableRedemptionModel, 'amountToReceive'> = {
  key: 'amountToReceive',
  header: 'Receive',
  align: 'right',
  Cell: ValueCell,
  HeaderCell: ValueHeaderCell,
  Value: ({ value: { value } }) => `${formatNumber(value, 0)}`,
};

const amountToReceiveSymbolCell: TableCellConfig<SelectableRedemptionModel, 'amountToReceive'> = {
  key: 'amountToReceive',
  header: null,
  Cell: SymbolCell,
  Value: ({ value: { symbol } }) => symbol,
};

const selectCell: TableCellConfig<SelectableRedemptionModel, 'selected'> = {
  key: 'selected',
  width: 30,
  align: 'right',
  Value: ({ value }) => <Toggle checked={value} />,
};

const ThisTablePanelContainer = styled(TablePanelContainer)`
  width: auto;
  border-bottom: 1px solid #ccc;
  &:not(:last-child) {
    margin-bottom: 16px;
  }
`;

export const RedemptionForm: React.FC<CollectFormProps> = ({ data }) => {
  const [accepted, setAccepted] = useState(false);
  const [items, setItems] = useState<SelectableRedemptionModel[]>([]);

  useEffect(() => {
    setItems(data.map(item => ({ ...item, selected: false })));
  }, [data.length]);

  const handleCollectItemToggle = (index: number) => {
    setItems(items => items.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item)));
  };

  const anySelected = items.some(({ selected }) => selected);

  if (!data.length) return <>No redemptions were scheduled.</>;

  return (
    <>
      <ThisTablePanelContainer>
        <Table
          cells={[
            amountToCollectValueCell,
            amountToCollectSymbolCell,
            amountToReceiveValueCell,
            amountToReceiveSymbolCell,
            selectCell,
          ]}
          data={items}
          rowClassName={({ row: { selected } }) => (selected ? 'selected' : '')}
          onCellClick={({ rowIndex }) => handleCollectItemToggle(rowIndex)}
        />
      </ThisTablePanelContainer>

      <ValueGroup>
        <Label>
          <Checkbox checked={accepted} onChange={() => setAccepted(accepted => !accepted)} />I understand that the
          collection is performed as a series of separate transactions.
        </Label>
      </ValueGroup>
      <Button disabled={!(anySelected && accepted)}>Collect</Button>
    </>
  );
};
