import { type RankingInfo, compareItems } from '@tanstack/match-sorter-utils';
import { constructSortFn, sortFns } from '@tanstack/react-table';
import {
  type ST_Row,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';

const fuzzy = constructSortFn({
  sort: (_dataValueA, _dataValueB, rowA, rowB, columnId) => {
    let dir = 0;
    if (rowA.columnFiltersMeta[columnId]) {
      dir = compareItems(
        rowA.columnFiltersMeta[columnId] as RankingInfo,
        rowB.columnFiltersMeta[columnId] as RankingInfo,
      );
    }
    // Provide a fallback for when the item ranks are equal
    return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir;
  },
});

export const ST_SortFns = {
  ...sortFns,
  fuzzy,
};

export const rankGlobalFuzzy = <TData extends ST_RowData>(
  rowA: ST_Row<TData>,
  rowB: ST_Row<TData>,
) =>
  Math.max(...Object.values(rowB.columnFiltersMeta).map((v: any) => v.rank)) -
  Math.max(...Object.values(rowA.columnFiltersMeta).map((v: any) => v.rank));
