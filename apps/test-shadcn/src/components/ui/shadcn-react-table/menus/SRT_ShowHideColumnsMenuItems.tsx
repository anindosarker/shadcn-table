import {
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_ShowHideColumnsMenuItemsProps<TData extends SRT_RowData> {
  allColumns: SRT_Column<TData>[];
  column: SRT_Column<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Show/Hide columns menu items - recursive menu items for column visibility
 * TODO: Full implementation needed
 */

export const SRT_ShowHideColumnsMenuItems = <TData extends SRT_RowData>({
  allColumns,
  column,
  table,
  className,
}: SRT_ShowHideColumnsMenuItemsProps<TData>) => {
  return <div className={className}>TODO: SRT_ShowHideColumnsMenuItems</div>;
};
