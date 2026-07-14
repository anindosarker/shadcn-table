import {
  type ButtonProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_TableHeadCellSortLabelProps<TData extends SRT_RowData>
  extends ButtonProps {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

export const SRT_TableHeadCellSortLabel = <TData extends SRT_RowData>({
  header,
  table,
  ...rest
}: SRT_TableHeadCellSortLabelProps<TData>) => {
  const {
    getState,
    options: {
      icons: { ArrowDownwardIcon, SyncAltIcon },
      localization,
    },
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { isLoading, showSkeletons, sorting } = getState();

  const isSorted = !!column.getIsSorted();

  const sortTooltip =
    isLoading || showSkeletons
      ? ''
      : column.getIsSorted()
        ? column.getIsSorted() === 'desc'
          ? localization.sortedByColumnDesc.replace(
              '{column}',
              columnDef.header,
            )
          : localization.sortedByColumnAsc.replace('{column}', columnDef.header)
        : column.getNextSortingOrder() === 'desc'
          ? localization.sortByColumnDesc.replace('{column}', columnDef.header)
          : localization.sortByColumnAsc.replace('{column}', columnDef.header);

  const direction = isSorted
    ? (column.getIsSorted() as 'asc' | 'desc')
    : undefined;

  return (
    <SRT_Tooltip side="top" title={sortTooltip}>
      <span className="relative">
        {/* MUI TableSortLabel `active` — always true in MRT here; no native <button> equivalent. */}
        {/* Note: MUI sx dropped (flex '0 0', width 3ch, transition 150ms,
            opacity 1/0.3) — shadcn ghost/icon default wins; active-opacity
            moved onto the SRT-owned icons (never the Button). */}
        <Button
          variant="ghost"
          size="icon"
          type="button"
          aria-label={sortTooltip}
          onClick={(e) => {
            e.stopPropagation();
            header.column.getToggleSortingHandler()?.(e);
          }}
          {...rest}
        >
          {!isSorted ? (
            <SyncAltIcon className="-translate-x-px -rotate-90 scale-x-90 text-muted-foreground opacity-30" />
          ) : (
            <ArrowDownwardIcon
              className={cn(
                'text-muted-foreground opacity-100 transition-transform',
                direction === 'asc' && 'rotate-180',
              )}
            />
          )}
        </Button>
        {sorting.length > 1 && column.getSortIndex() >= 0 && (
          <span className="absolute -right-1.5 -top-1 text-[0.65rem] text-muted-foreground">
            {column.getSortIndex() + 1}
          </span>
        )}
      </span>
    </SRT_Tooltip>
  );
};
