import { type ReactNode, type RefObject } from 'react';
import {
  type SRT_Cell,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_TableBodyCellValueProps<TData extends SRT_RowData> {
  cell: SRT_Cell<TData>;
  rowRef?: RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex?: number;
  table: SRT_TableInstance<TData>;
}

/**
 * Table body cell value renderer - handles aggregation, grouping, and custom cell rendering
 *
 * Barebones implementation:
 * - Renders basic cell value with cell.renderValue()
 * - Supports custom Cell component from columnDef
 *
 * TODO (Future enhancements):
 * - Add filter match highlighting
 * - Support AggregatedCell rendering
 * - Support GroupedCell rendering
 * - Add highlight-words package integration
 * - Add configurable highlight colors
 */

export const SRT_TableBodyCellValue = <TData extends SRT_RowData>({
  cell,
  rowRef,
  staticColumnIndex,
  staticRowIndex,
  table,
}: SRT_TableBodyCellValueProps<TData>) => {
  const { column, row } = cell;
  const { columnDef } = column;

  // TODO: Add support for AggregatedCell
  // TODO: Add support for GroupedCell
  // TODO: Add filter match highlighting

  // Render basic cell value
  let renderedCellValue = cell.renderValue() as ReactNode | number | string;

  // Apply custom Cell component if defined
  if (columnDef.Cell) {
    renderedCellValue = columnDef.Cell({
      cell,
      column,
      renderedCellValue,
      row,
      rowRef,
      staticColumnIndex,
      staticRowIndex,
      table,
    });
  }

  return renderedCellValue;
};
