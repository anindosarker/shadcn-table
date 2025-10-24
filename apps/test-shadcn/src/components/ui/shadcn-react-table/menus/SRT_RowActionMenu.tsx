import { type MouseEvent } from 'react';
import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_RowActionMenuProps<TData extends SRT_RowData> {
  row: SRT_Row<TData>;
  table: SRT_TableInstance<TData>;
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  handleEdit: (event: MouseEvent) => void;
  staticRowIndex?: number;
  className?: string;
}

/**
 * Row action menu - menu for row-level actions
 * TODO: Full implementation needed
 */

export const SRT_RowActionMenu = <TData extends SRT_RowData>({
  row,
  table,
  anchorEl,
  setAnchorEl,
  handleEdit,
  staticRowIndex,
  className,
}: SRT_RowActionMenuProps<TData>) => {
  return <div className={className}>TODO: SRT_RowActionMenu</div>;
};
