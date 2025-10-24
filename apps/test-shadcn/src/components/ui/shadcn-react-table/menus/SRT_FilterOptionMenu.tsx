import {
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_FilterOptionMenuProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  onSelect?: () => void;
  className?: string;
}

/**
 * Filter option menu - menu for selecting filter mode
 * TODO: Full implementation needed
 */

export const SRT_FilterOptionMenu = <TData extends SRT_RowData>({
  table,
  anchorEl,
  setAnchorEl,
  onSelect,
  className,
}: SRT_FilterOptionMenuProps<TData>) => {
  return <div className={className}>TODO: SRT_FilterOptionMenu</div>;
};
