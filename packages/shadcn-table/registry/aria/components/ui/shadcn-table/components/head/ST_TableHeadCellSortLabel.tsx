import { cn } from '@/lib/utils';
import {
  type ButtonProps,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';

export interface ST_TableHeadCellSortLabelProps<TData extends ST_RowData>
  extends ButtonProps {
  header: ST_Header<TData>;
}

/**
 * The static sort arrow of a sorted header; renders nothing while the column
 * is unsorted. Sorting happens from the column menu or the sort editor.
 */
export const ST_TableHeadCellSortLabel = <TData extends ST_RowData>({
  className,
  header,
}: ST_TableHeadCellSortLabelProps<TData>) => {
  const table = header.table;
  const {
    options: {
      icons: { ArrowDownwardIcon, ArrowUpwardIcon },
      localization,
      showSortIndex,
    },
  } = table;
  const { column } = header;

  return (
    <table.Subscribe selector={(state) => ({ sorting: state.sorting })}>
      {({ sorting }) => {
        const sorted = column.getIsSorted();
        if (!sorted) return null;
        const Icon = sorted === 'asc' ? ArrowUpwardIcon : ArrowDownwardIcon;
        const sortIndex = column.getSortIndex();

        return (
          <span
            aria-label={
              sorted === 'asc'
                ? localization.sortedAscending
                : localization.sortedDescending
            }
            className={cn(
              'flex shrink-0 items-center gap-0.5 text-muted-foreground/80',
              className,
            )}
          >
            <Icon aria-hidden className="size-3" />
            {showSortIndex && sorting.length > 1 && sortIndex >= 0 && (
              <span className="text-xs leading-none font-medium tabular-nums">
                {sortIndex + 1}
              </span>
            )}
          </span>
        );
      }}
    </table.Subscribe>
  );
};
