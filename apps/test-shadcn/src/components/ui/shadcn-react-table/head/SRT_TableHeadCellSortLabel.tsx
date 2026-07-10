import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_TableHeadCellSortLabelProps<TData extends SRT_RowData>
  extends ButtonProps {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

// Base folds MUI ButtonBase reset defaults (transparent bg, no border, pointer)
// per the "MUI defaults count as spec" convention, plus the mapped sx object.
const sortLabelVariants = cva(
  'inline-flex w-[3ch] shrink-0 cursor-pointer appearance-none select-none items-center justify-center border-0 bg-transparent p-0 align-middle outline-none transition-all duration-150',
  {
    variants: {
      sorted: {
        true: 'opacity-100',
        false: 'opacity-30',
      },
    },
    defaultVariants: {
      sorted: false,
    },
  },
);

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
        <button
          type="button"
          aria-label={sortTooltip}
          onClick={(e) => {
            e.stopPropagation();
            header.column.getToggleSortingHandler()?.(e);
          }}
          {...rest}
          className={cn(
            sortLabelVariants({ sorted: isSorted, className: rest.className }),
          )}
        >
          {!isSorted ? (
            <SyncAltIcon
              className="text-muted-foreground"
              size={16}
              style={{
                transform: 'rotate(-90deg) scaleX(0.9) translateX(-1px)',
              }}
            />
          ) : (
            <ArrowDownwardIcon
              className={cn(
                'text-muted-foreground transition-transform',
                direction === 'asc' && 'rotate-180',
              )}
              size={16}
            />
          )}
        </button>
        {sorting.length > 1 && column.getSortIndex() >= 0 && (
          <span className="absolute -right-1.5 -top-1 text-[0.65rem] text-muted-foreground">
            {column.getSortIndex() + 1}
          </span>
        )}
      </span>
    </SRT_Tooltip>
  );
};
