import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ButtonProps,
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';

export interface ST_TableHeadCellSortLabelProps<TData extends ST_RowData>
  extends ButtonProps {
  header: ST_Header<TData>;
  table: ST_TableInstance<TData>;
}

const tableHeadCellSortLabelVariants = cva(
  'inline-flex w-[3ch] flex-[0_0] cursor-pointer items-center justify-start [flex-direction:inherit] outline-none transition-all duration-150 ease-in-out focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:mx-1 [&_svg]:size-[18px] [&_svg]:text-muted-foreground [&_svg]:transition-[opacity,transform,rotate] [&_svg]:duration-200 [&_svg]:select-none dark:[&_svg]:text-foreground',
  {
    variants: {
      direction: {
        asc: '[&_svg]:rotate-180',
        desc: '[&_svg]:rotate-0',
      },
      isSorted: {
        true: 'opacity-100',
        false: 'opacity-30',
      },
    },
  },
);

export const ST_TableHeadCellSortLabel = <TData extends ST_RowData>({
  header,
  table,
  ...rest
}: ST_TableHeadCellSortLabelProps<TData>) => {
  const {
    options: {
      icons: { ArrowDownwardIcon, SyncAltIcon },
      localization,
    },
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { isLoading, showSkeletons, sorting } = table.state;

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
    <ST_Tooltip side="top" title={sortTooltip}>
      <span className="relative inline-flex shrink-0 align-middle">
        <button
          type="button"
          /* active dropped. Note: MUI TableSortLabel `active` is always true here; its styles are baked into the cva. */
          aria-label={sortTooltip}
          onClick={(e) => {
            e.stopPropagation();
            header.column.getToggleSortingHandler()?.(e);
          }}
          {...rest}
          className={cn(
            tableHeadCellSortLabelVariants({
              direction,
              isSorted,
              className: rest.className,
            }),
          )}
        >
          {!isSorted ? (
            <SyncAltIcon
              style={{
                transform: 'rotate(-90deg) scaleX(0.9) translateX(-1px)',
              }}
            />
          ) : (
            <ArrowDownwardIcon />
          )}
        </button>
        {/* badgeContent={sorting.length > 1 ? column.getSortIndex() + 1 : 0} dropped. Note: MUI Badge showZero=false hides 0 (column outside the multi-sort). */}
        {sorting.length > 1 && column.getSortIndex() >= 0 && (
          <span className="absolute top-[14%] right-[14%] z-[1] flex h-5 min-w-5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-1.5 text-xs leading-none font-medium">
            {column.getSortIndex() + 1}
          </span>
        )}
      </span>
    </ST_Tooltip>
  );
};
