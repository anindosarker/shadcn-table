import { compareItems } from '@tanstack/match-sorter-utils';
import {
  constructSortFn,
  sortFn_alphanumeric,
  sortFn_alphanumericCaseSensitive,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  sortFn_textCaseSensitive,
} from '@tanstack/react-table';
import {
  type ST_Row,
  type ST_RowData,
} from '@/components/ui-base/shadcn-table/types';
import type { ST_Features } from '@/components/ui-base/shadcn-table/features/stFeatures';

const fuzzy = constructSortFn<ST_Features, ST_RowData>({
  sort: (_dataValueA, _dataValueB, rowA, rowB, columnId) => {
    let dir = 0;
    if (rowA.columnFiltersMeta[columnId]) {
      dir = compareItems(
        rowA.columnFiltersMeta[columnId],
        rowB.columnFiltersMeta[columnId],
      );
    }
    return dir === 0 ? sortFn_alphanumeric(rowA, rowB, columnId) : dir;
  },
});

export const ST_SortFns = {
  alphanumeric: sortFn_alphanumeric,
  alphanumericCaseSensitive: sortFn_alphanumericCaseSensitive,
  basic: sortFn_basic,
  datetime: sortFn_datetime,
  text: sortFn_text,
  textCaseSensitive: sortFn_textCaseSensitive,
  fuzzy,
};

export const rankGlobalFuzzy = <TData extends ST_RowData>(
  rowA: ST_Row<TData>,
  rowB: ST_Row<TData>,
) =>
  Math.max(...Object.values(rowB.columnFiltersMeta).map((v) => v.rank)) -
  Math.max(...Object.values(rowA.columnFiltersMeta).map((v) => v.rank));
