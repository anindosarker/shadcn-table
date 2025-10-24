import {
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_ShowHideColumnsMenuProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  className?: string;
}

/**
 * Show/Hide columns menu - menu for toggling column visibility
 * TODO: Full implementation needed
 */

export const SRT_ShowHideColumnsMenu = <TData extends SRT_RowData>({
  table,
  anchorEl,
  setAnchorEl,
  className,
}: SRT_ShowHideColumnsMenuProps<TData>) => {
  return <div className={className}>TODO: SRT_ShowHideColumnsMenu</div>;
};
