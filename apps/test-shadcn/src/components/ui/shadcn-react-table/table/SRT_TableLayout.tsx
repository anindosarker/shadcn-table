import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import SRT_TableContainer from './SRT_TableContainer';

export interface SRT_TableLayoutProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
}

export const SRT_TableLayout = <TData extends SRT_RowData>({
  table,
}: SRT_TableLayoutProps<TData>) => {
  return (
    <div>
      <SRT_TableContainer table={table} />
    </div>
  );
};

export default SRT_TableLayout;
