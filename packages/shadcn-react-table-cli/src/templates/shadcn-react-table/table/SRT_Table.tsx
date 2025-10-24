import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { SRT_TableHead } from '../head/SRT_TableHead';
import { SRT_TableBody } from '../body/SRT_TableBody';

export interface SRT_TableProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
}

/**
 * Main table component - renders the HTML table with head and body
 *
 * TODO (Future enhancements):
 * - cva for className overrides
 * - MRT_TableFooter
 * - useMRT_ColumnVirtualizer (column virtualization)
 * - Custom table wrapper props
 */

export const SRT_Table = <TData extends SRT_RowData>({
  table,
}: SRT_TableProps<TData>) => {
  const {
    // getFlatHeaders,
    // getState,
    options: {
      // columns,
      // enableStickyHeader,
      // enableTableFooter,
      enableTableHead,
      // layoutMode,
      // memoMode,
      // muiTableProps,
      // renderCaption,
    },
  } = table;

  // const columnVirtualizer = useMRT_ColumnVirtualizer(table);

  const commonTableGroupProps = {
    // columnVirtualizer,
    table,
  };
  return (
    <table className="w-full border-collapse text-sm">
      {enableTableHead && <SRT_TableHead {...commonTableGroupProps} />}
      <SRT_TableBody {...commonTableGroupProps} />
    </table>
  );
};
