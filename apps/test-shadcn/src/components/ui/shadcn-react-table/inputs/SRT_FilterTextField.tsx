import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_FilterTextFieldProps<TData extends SRT_RowData> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Filter text field - text input for column filtering
 * TODO: Full implementation needed
 */

export const SRT_FilterTextField = <TData extends SRT_RowData>({
  header,
  table,
  className,
}: SRT_FilterTextFieldProps<TData>) => {
  return <div className={className}>TODO: SRT_FilterTextField</div>;
};
