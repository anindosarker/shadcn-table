import {
  type SRT_Cell,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_CellActionMenuProps<TData extends SRT_RowData> {
  cell: SRT_Cell<TData>;
  table: SRT_TableInstance<TData>;
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  className?: string;
}

/**
 * Cell action menu - right-click context menu for cells
 * TODO: Full implementation needed
 */

export const SRT_CellActionMenu = <TData extends SRT_RowData>({
  cell,
  table,
  anchorEl,
  setAnchorEl,
  className,
}: SRT_CellActionMenuProps<TData>) => {
  return <div className={className}>TODO: SRT_CellActionMenu</div>;
};
