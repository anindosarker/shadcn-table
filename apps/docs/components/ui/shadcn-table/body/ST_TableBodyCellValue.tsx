import { type ReactNode, type RefObject } from 'react';
import {
  type ST_Cell,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import highlightWords from 'highlight-words';

const allowedTypes = ['string', 'number'];

export interface ST_TableBodyCellValueProps<TData extends ST_RowData> {
  cell: ST_Cell<TData>;
  rowRef?: RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex?: number;
  table: ST_TableInstance<TData>;
}

export const ST_TableBodyCellValue = <TData extends ST_RowData>({
  cell,
  rowRef,
  staticColumnIndex,
  staticRowIndex,
  table,
}: ST_TableBodyCellValueProps<TData>) => {
  const {
    options: {
      enableFilterMatchHighlighting,
      // mrtTheme: { matchHighlightColor },
      // Note: mrtTheme dropped project-wide; matchHighlightColor → destructive/20 (dark /30), override via [data-slot="st-match-highlight"].
    },
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { globalFilter, globalFilterFn } = table.state;
  const filterValue = column.getFilterValue();

  let renderedCellValue =
    cell.getIsAggregated() && columnDef.AggregatedCell
      ? columnDef.AggregatedCell({
          cell,
          column,
          row,
          table,
          staticColumnIndex,
          staticRowIndex,
        })
      : row.getIsGrouped() && !cell.getIsGrouped()
        ? null
        : cell.getIsGrouped() && columnDef.GroupedCell
          ? columnDef.GroupedCell({
              cell,
              column,
              row,
              table,
              staticColumnIndex,
              staticRowIndex,
            })
          : undefined;

  const isGroupedValue = renderedCellValue !== undefined;

  if (!isGroupedValue) {
    renderedCellValue = cell.renderValue() as ReactNode | number | string;
  }

  if (
    enableFilterMatchHighlighting &&
    columnDef.enableFilterMatchHighlighting !== false &&
    String(renderedCellValue) &&
    allowedTypes.includes(typeof renderedCellValue) &&
    ((filterValue &&
      allowedTypes.includes(typeof filterValue) &&
      ['autocomplete', 'text'].includes(columnDef.filterVariant!)) ||
      (globalFilter &&
        allowedTypes.includes(typeof globalFilter) &&
        column.getCanGlobalFilter()))
  ) {
    const chunks = highlightWords?.({
      matchExactly:
        (filterValue ? columnDef._filterFn : globalFilterFn) !== 'fuzzy',
      query: (filterValue ?? globalFilter ?? '').toString(),
      text: renderedCellValue?.toString() as string,
    });
    if (chunks?.length > 1 || chunks?.[0]?.match) {
      renderedCellValue = (
        <span aria-label={renderedCellValue as string} role="note">
          {chunks?.map(({ key, match, text }) =>
            match ? (
              <mark
                aria-hidden="true"
                data-slot="st-match-highlight"
                key={key}
                className="rounded-xs bg-destructive/20 px-px py-0.5 text-foreground dark:bg-destructive/30"
              >
                {text}
              </mark>
            ) : (
              <span aria-hidden="true" key={key}>
                {text}
              </span>
            ),
          ) ?? renderedCellValue}
        </span>
      );
    }
  }

  if (columnDef.Cell && !isGroupedValue) {
    renderedCellValue = columnDef.Cell({
      cell,
      column,
      renderedCellValue,
      row,
      rowRef,
      staticColumnIndex,
      staticRowIndex,
      table,
    });
  }

  return renderedCellValue;
};
