import {
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';

export interface SRT_EditRowModalProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  open: boolean;
  onClose: () => void;
  className?: string;
}

/**
 * Edit row modal - modal dialog for editing row data
 * TODO: Full implementation needed
 */

export const SRT_EditRowModal = <TData extends SRT_RowData>({
  table,
  open,
  onClose,
  className,
}: SRT_EditRowModalProps<TData>) => {
  return open ? <div className={className}>TODO: SRT_EditRowModal</div> : null;
};
