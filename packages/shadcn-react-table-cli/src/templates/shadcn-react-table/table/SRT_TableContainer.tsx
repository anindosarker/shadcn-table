import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { SRT_Table } from './SRT_Table';

export interface SRT_TableContainerProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
}

export const SRT_TableContainer = <TData extends SRT_RowData>({
  table,
}: SRT_TableContainerProps<TData>) => {
  return (
    <div>
      <SRT_Table table={table} />
    </div>
  );
};

export default SRT_TableContainer;
