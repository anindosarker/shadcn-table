import {
  type SRT_Cell,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_EditCellTextFieldProps<TData extends SRT_RowData> {
  cell: SRT_Cell<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Edit cell text field - inline text editor for cells
 * TODO: Full implementation needed
 */

export const SRT_EditCellTextField = <TData extends SRT_RowData>({
  cell,
  table,
  className,
}: SRT_EditCellTextFieldProps<TData>) => {
  return <div className={className}>TODO: SRT_EditCellTextField</div>;
};
