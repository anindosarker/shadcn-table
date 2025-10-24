import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_ColumnActionMenuProps<TData extends SRT_RowData> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  className?: string;
}

/**
 * Column action menu - menu for column-level actions
 * TODO: Full implementation needed
 */

export const SRT_ColumnActionMenu = <TData extends SRT_RowData>({
  header,
  table,
  anchorEl,
  setAnchorEl,
  className,
}: SRT_ColumnActionMenuProps<TData>) => {
  return <div className={className}>TODO: SRT_ColumnActionMenu</div>;
};
