import { type ReactNode, type RefObject } from 'react';
import {
  type SRT_Cell,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';

const allowedTypes = ['string', 'number'];

export interface SRT_TableBodyCellValueProps<TData extends SRT_RowData> {
  cell: SRT_Cell<TData>;
  rowRef?: RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex?: number;
  table: SRT_TableInstance<TData>;
}

/**
 * Splits `text` into match / non-match chunks against `query`.
 *
 * Replaces material-react-table's `highlight-words` dependency with a small
 * local implementation so behavior is preserved without pulling in the
 * package. When `matchExactly` is true the full query is matched as one term;
 * otherwise each character of the query is matched independently (fuzzy).
 */
const highlightWords = ({
  matchExactly,
  query,
  text,
}: {
  matchExactly: boolean;
  query: string;
  text: string;
}): Array<{ key: number; match: boolean; text: string }> => {
  const terms = matchExactly
    ? [query.trim()].filter(Boolean)
    : Array.from(new Set(query.replace(/\s/g, '').split('')));

  if (!terms.length) {
    return [{ key: 0, match: false, text }];
  }

  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');

  const chunks: Array<{ key: number; match: boolean; text: string }> = [];
  let key = 0;
  let lastIndex = 0;
  let result: RegExpExecArray | null;

  while ((result = regex.exec(text)) !== null) {
    if (result.index > lastIndex) {
      chunks.push({
        key: key++,
        match: false,
        text: text.slice(lastIndex, result.index),
      });
    }
    chunks.push({ key: key++, match: true, text: result[0] });
    lastIndex = result.index + result[0].length;
    if (result[0].length === 0) regex.lastIndex++;
  }

  if (lastIndex < text.length) {
    chunks.push({ key: key++, match: false, text: text.slice(lastIndex) });
  }

  return chunks;
};

/**
 * Table body cell value - resolves the value rendered inside a body cell.
 *
 * Ports material-react-table's MRT_TableBodyCellValue 1:1:
 * - Aggregated cells render `columnDef.AggregatedCell`
 * - Grouped parent rows render `columnDef.GroupedCell` (and blank for
 *   non-grouped cells in a grouped row)
 * - Otherwise renders `cell.renderValue()`
 * - Filter match highlighting (global filter + column text/autocomplete
 *   filters) using a local `highlightWords` implementation
 * - Custom `columnDef.Cell` rendering for non-grouped values
 */
export const SRT_TableBodyCellValue = <TData extends SRT_RowData>({
  cell,
  rowRef,
  staticColumnIndex,
  staticRowIndex,
  table,
}: SRT_TableBodyCellValueProps<TData>) => {
  const {
    getState,
    options: { enableFilterMatchHighlighting },
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { globalFilter, globalFilterFn } = getState();
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
    const chunks = highlightWords({
      matchExactly:
        (filterValue ? columnDef._filterFn : globalFilterFn) !== 'fuzzy',
      query: (filterValue ?? globalFilter ?? '').toString(),
      text: renderedCellValue?.toString() as string,
    });
    if (chunks?.length > 1 || chunks?.[0]?.match) {
      renderedCellValue = (
        <span aria-label={renderedCellValue as string} role="note">
          {chunks?.map(({ key, match, text }) => (
            <span
              aria-hidden="true"
              key={key}
              className={cn(
                match &&
                  'rounded-[2px] bg-yellow-200 px-[1px] py-[2px] text-black dark:bg-yellow-500 dark:text-white',
              )}
            >
              {text}
            </span>
          )) ?? renderedCellValue}
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
