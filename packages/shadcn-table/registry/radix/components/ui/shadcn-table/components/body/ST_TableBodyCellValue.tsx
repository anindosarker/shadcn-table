import { type ReactNode, type RefObject } from 'react';
import { Subscribe } from '@tanstack/react-table';
import {
  type ST_Cell,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { getColumnFilterFnName } from '@/components/ui/shadcn-table/shared/utils/column.utils';
import highlightWords from 'highlight-words';

const allowedTypes = ['string', 'number'];

export interface ST_TableBodyCellValueProps<TData extends ST_RowData> {
  cell: ST_Cell<TData>;
  rowRef?: RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex?: number;
}

export const ST_TableBodyCellValue = <TData extends ST_RowData>({
  cell,
  rowRef,
  staticColumnIndex,
  staticRowIndex,
}: ST_TableBodyCellValueProps<TData>) => {
  // The cell carries the core table; the ST wrapper types re-type its getters.
  const table = cell.table;
  const {
    options: {
      enableFilterMatchHighlighting,
      // mrtTheme: { matchHighlightColor },
      // Note: mrtTheme dropped project-wide; matchHighlightColor → destructive/20 (dark /30), override via [data-slot="st-match-highlight"].
    },
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;

  return (
    <Subscribe
      selector={(state) => ({
        filterValue: column.getFilterValue(),
        globalFilter: state.globalFilter,
        globalFilterFn: state.globalFilterFn,
        columnFilterFns: state.columnFilterFns,
        grouping: state.grouping,
      })}
      source={table.store}
    >
      {({ filterValue, globalFilter, globalFilterFn }) => {
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
              (filterValue
                ? getColumnFilterFnName(columnDef)
                : globalFilterFn) !== 'fuzzy',
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
      }}
    </Subscribe>
  );
};
