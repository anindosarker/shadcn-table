import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import {
  parseCSSVarId,
  parseFromValuesOrFunc,
  useSRT_ColumnVirtualizer,
  type SRT_RowData,
  type SRT_TableInstance,
  type TableProps,
} from 'shadcn-react-table-core';
import { Memo_SRT_TableBody, SRT_TableBody } from '../body/SRT_TableBody';
import { SRT_TableFooter } from '../footer/SRT_TableFooter';
import { SRT_TableHead } from '../head/SRT_TableHead';

export interface SRT_TableProps<TData extends SRT_RowData> extends TableProps {
  table: SRT_TableInstance<TData>;
}

const tableVariants = cva('relative w-full border-separate border-spacing-0', {
  variants: {
    layoutMode: { grid: 'grid', 'grid-no-grow': 'grid', semantic: '' },
  },
  defaultVariants: { layoutMode: 'semantic' },
});

export const SRT_Table = <TData extends SRT_RowData>({
  table,
  ...rest
}: SRT_TableProps<TData>) => {
  const {
    getFlatHeaders,
    getState,
    options: {
      columns,
      /**
       * MUI `stickyHeader` Table prop dropped (no native `<table>` attr) — sticky th
        styles live in `SRT_TableHeadCell` (+ thead-level grid-mode sticky in
        `SRT_TableHead`), derived from `enableStickyHeader || isFullScreen` off
        `table`, same as MRT_TableHead does.
      enableStickyHeader,
       */
      enableTableFooter,
      enableTableHead,
      layoutMode,
      memoMode,
      srtTableProps,
      renderCaption,
    },
  } = table;
  /**
   * Stickyheader dropped, so gotta drop isFullScreen from deps too, since it only affects stickyheader.
   */
  const { columnSizing, columnSizingInfo, columnVisibility } = getState();

  const tableProps = {
    ...parseFromValuesOrFunc(srtTableProps, { table }),
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

  const columnVirtualizer = useSRT_ColumnVirtualizer(table);

  const commonTableGroupProps = {
    columnVirtualizer,
    table,
  };

  return (
    <table
      // stickyHeader={enableStickyHeader || isFullScreen}
      // Note: no native <table> attr; sticky th styles live in SRT_TableHeadCell
      // (+ thead grid-mode sticky in SRT_TableHead), derived from table options.
      {...tableProps}
      style={{ ...columnSizeVars, ...tableProps?.style }}
      className={cn(
        tableVariants({ layoutMode, className: tableProps.className }),
      )}
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
