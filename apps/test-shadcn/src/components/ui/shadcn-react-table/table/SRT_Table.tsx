import { useMemo } from 'react';
import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import {
  parseCSSVarId,
  parseFromValuesOrFunc,
  parseSRT_HtmlProps,
  useSRT_ColumnVirtualizer,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_TableHead } from '../head/SRT_TableHead';
import { SRT_TableBody, Memo_SRT_TableBody } from '../body/SRT_TableBody';
import { SRT_TableFooter } from '../footer/SRT_TableFooter';

export interface SRT_TableProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
}

/**
 * Main table component - renders the HTML table with head, body, and footer.
 *
 * Ports material-react-table's MRT_Table:
 * - instantiates the column virtualizer and feeds it to head/body/footer
 * - exposes the `--header-*-size` / `--col-*-size` CSS vars on the `<table>`
 *   so grid layout + column resizing can read live sizes
 * - dispatches to the memoized body when `memoMode === 'table-body'` or a
 *   column is mid-resize
 * - renders `renderCaption` into a `<caption>`
 * - switches to `display: grid` in grid layout modes
 */

export const SRT_Table = <TData extends SRT_RowData>({
  table,
}: SRT_TableProps<TData>) => {
  const {
    getFlatHeaders,
    getState,
    options: {
      columns,
      enableTableFooter,
      enableTableHead,
      layoutMode,
      memoMode,
      renderCaption,
      srtTableProps,
    },
  } = table;
  const { columnSizing, columnSizingInfo, columnVisibility } = getState();

  const Caption = parseFromValuesOrFunc(renderCaption, { table });

  const columnSizeVars = useMemo(() => {
    const headers = getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const colSize = header.getSize();
      colSizes[`--header-${parseCSSVarId(header.id)}-size`] = colSize;
      colSizes[`--col-${parseCSSVarId(header.column.id)}-size`] = colSize;
    }
    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, columnSizing, columnSizingInfo, columnVisibility]);

  const columnVirtualizer = useSRT_ColumnVirtualizer(table);

  const commonTableGroupProps = {
    columnVirtualizer,
    table,
  };

  const tableProps = parseSRT_HtmlProps(srtTableProps, { table });

  return (
    <table
      {...tableProps}
      className={cn('w-full border-collapse text-sm', tableProps?.className)}
      style={{
        display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
        ...columnSizeVars,
        ...tableProps?.style,
      }}
    >
      {!!Caption && <caption>{Caption}</caption>}
      {enableTableHead && <SRT_TableHead {...commonTableGroupProps} />}
      {memoMode === 'table-body' || columnSizingInfo.isResizingColumn ? (
        <Memo_SRT_TableBody {...commonTableGroupProps} />
      ) : (
        <SRT_TableBody {...commonTableGroupProps} />
      )}
      {enableTableFooter && <SRT_TableFooter {...commonTableGroupProps} />}
    </table>
  );
};
