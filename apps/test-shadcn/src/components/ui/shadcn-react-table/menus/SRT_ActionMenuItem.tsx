import {
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_ActionMenuItemProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Action menu item - generic menu item component
 * TODO: Full implementation needed
 */

export const SRT_ActionMenuItem = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ActionMenuItemProps<TData>) => {
  return <div className={className}>TODO: SRT_ActionMenuItem</div>;
};
