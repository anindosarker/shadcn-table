import {
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_FilterCheckboxProps<TData extends SRT_RowData> {
  column: SRT_Column<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Filter checkbox - checkbox input for column filtering
 * TODO: Full implementation needed
 */

export const SRT_FilterCheckbox = <TData extends SRT_RowData>({
  column,
  table,
  className,
}: SRT_FilterCheckboxProps<TData>) => {
  return <div className={className}>TODO: SRT_FilterCheckbox</div>;
};
