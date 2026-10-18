import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import { useST_ColumnVirtualizer } from '../hooks/useST_ColumnVirtualizer';
import {
  type ST_RowData,
  type ST_TableInstance,
  type TableProps,
} from '../types';
import { parseCSSVarId } from '../utils/style.utils';
import { parseFromValuesOrFunc } from '../utils/utils';
import { Memo_ST_TableBody, ST_TableBody } from '../body/ST_TableBody';
import { ST_TableFooter } from '../footer/ST_TableFooter';
import { ST_TableHead } from '../head/ST_TableHead';

export interface ST_TableProps<TData extends ST_RowData> extends TableProps {
  table: ST_TableInstance<TData>;
}

const tableVariants = cva('relative w-full border-separate border-spacing-0', {
  variants: {
    layoutMode: { grid: 'grid', 'grid-no-grow': 'grid', semantic: '' },
  },
  defaultVariants: { layoutMode: 'semantic' },
});

export const ST_Table = <TData extends ST_RowData>({
  table,
  ...rest
}: ST_TableProps<TData>) => {
  const {
    getFlatHeaders,
    getState,
    options: {
      columns,
      /**
       * MUI `stickyHeader` Table prop dropped (no native `<table>` attr) — sticky th
        styles live in `ST_TableHeadCell` (+ thead-level grid-mode sticky in
        `ST_TableHead`), derived from `enableStickyHeader || isFullScreen` off
        `table`, same as MRT_TableHead does.
      enableStickyHeader,
       */
      enableTableFooter,
      enableTableHead,
      layoutMode,
      memoMode,
      stTableProps,
      renderCaption,
    },
  } = table;
  /**
   * Stickyheader dropped, so gotta drop isFullScreen from deps too, since it only affects stickyheader.
   */
  const { columnSizing, columnSizingInfo, columnVisibility } = getState();

  const tableProps = {
    ...parseFromValuesOrFunc(stTableProps, { table }),
    ...rest,
  };

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

  const columnVirtualizer = useST_ColumnVirtualizer(table);

  const commonTableGroupProps = {
    columnVirtualizer,
    table,
  };

  return (
    <table
      // stickyHeader={enableStickyHeader || isFullScreen}
      // Note: no native <table> attr; sticky th styles live in ST_TableHeadCell
      // (+ thead grid-mode sticky in ST_TableHead), derived from table options.
      {...tableProps}
      style={{ ...columnSizeVars, ...tableProps?.style }}
      className={cn(
        tableVariants({ layoutMode, className: tableProps.className }),
      )}
    >
      {!!Caption && <caption>{Caption}</caption>}
      {enableTableHead && <ST_TableHead {...commonTableGroupProps} />}
      {memoMode === 'table-body' || columnSizingInfo.isResizingColumn ? (
        <Memo_ST_TableBody {...commonTableGroupProps} />
      ) : (
        <ST_TableBody {...commonTableGroupProps} />
      )}
      {enableTableFooter && <ST_TableFooter {...commonTableGroupProps} />}
    </table>
  );
};
