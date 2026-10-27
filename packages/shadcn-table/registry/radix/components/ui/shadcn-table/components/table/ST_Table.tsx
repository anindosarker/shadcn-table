import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import { useST_ColumnVirtualizer } from '@/components/ui/shadcn-table/hooks/useST_ColumnVirtualizer';
import { type TableProps } from '@/components/ui/shadcn-table/types';
import { parseCSSVarId } from '@/components/ui/shadcn-table/shared/utils/style.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import {
  Memo_ST_TableBody,
  ST_TableBody,
} from '@/components/ui/shadcn-table/components/body/ST_TableBody';
import { ST_TableFooter } from '@/components/ui/shadcn-table/components/footer/ST_TableFooter';
import { ST_TableHead } from '@/components/ui/shadcn-table/components/head/ST_TableHead';
import {
  useST_Atom,
  useSTContext,
} from '@/components/ui/shadcn-table/hooks/stTableHook';

export type ST_TableProps = TableProps;

const tableVariants = cva(
  'relative w-full caption-bottom border-separate border-spacing-0',
  {
    variants: {
      layoutMode: { grid: 'grid', 'grid-no-grow': 'grid', semantic: '' },
    },
    defaultVariants: { layoutMode: 'semantic' },
  },
);

export const ST_Table = ({ ...rest }: ST_TableProps) => {
  const table = useSTContext();
  const {
    getFlatHeaders,
    options: {
      columns,
      /**
       * MUI `stickyHeader` Table prop dropped (no native `<table>` attr); sticky th
        styles live in `ST_TableHeadCell` (+ thead-level grid-mode sticky in
        `ST_TableHead`), derived from `enableStickyHeader || isFullScreen` off
        `table`, same as ST_TableHead does.
      enableStickyHeader,
       */
      enableTableFooter,
      enableTableHead,
      layoutMode,
      stTableProps,
      renderCaption,
    },
  } = table;
  /**
   * Stickyheader dropped, so gotta drop isFullScreen from deps too, since it only affects stickyheader.
   */
  // These feed the column size memo, so they are hook subscriptions.
  const columnSizing = useST_Atom(table.atoms.columnSizing);
  const columnResizing = useST_Atom(table.atoms.columnResizing);
  const columnVisibility = useST_Atom(table.atoms.columnVisibility);
  // Pinning, reordering and grouping split or merge header groups, which changes the parent header ids.
  const columnOrder = useST_Atom(table.atoms.columnOrder);
  const columnPinning = useST_Atom(table.atoms.columnPinning);
  const grouping = useST_Atom(table.atoms.grouping);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- getFlatHeaders is a stable table method; the header set follows columns, columnSizing, columnResizing, columnVisibility, columnOrder, columnPinning and grouping
  }, [
    columns,
    columnSizing,
    columnResizing,
    columnVisibility,
    columnOrder,
    columnPinning,
    grouping,
  ]);

  const columnVirtualizer = useST_ColumnVirtualizer(table);

  const commonTableGroupProps = {
    columnVirtualizer,
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
      {columnResizing.isResizingColumn ? (
        <Memo_ST_TableBody {...commonTableGroupProps} />
      ) : (
        <ST_TableBody {...commonTableGroupProps} />
      )}
      {enableTableFooter && <ST_TableFooter {...commonTableGroupProps} />}
    </table>
  );
};
