import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_SelectCheckboxProps<TData extends SRT_RowData> {
  row?: SRT_Row<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Select checkbox - checkbox for row selection
 * TODO: Full implementation needed
 */

export const SRT_SelectCheckbox = <TData extends SRT_RowData>({
  row,
  table,
  className,
}: SRT_SelectCheckboxProps<TData>) => {
  return <div className={className}>TODO: SRT_SelectCheckbox</div>;
};
