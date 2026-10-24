import { type MouseEvent, useState } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { Popover } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { ST_TableHeadCellFilterContainer } from '@/components/ui/shadcn-table/head/ST_TableHeadCellFilterContainer';
import {
  type ButtonProps,
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import {
  getColumnFilterInfo,
  useDropdownOptions,
} from '@/components/ui/shadcn-table/utils/column.utils';
import { getValueAndLabel } from '@/components/ui/shadcn-table/utils/utils';

// Note: base maps MRT's sx (size-4 p-2 = MRT 16px border-box + 8px padding, ml 4px, scale .75, transition all 150ms ease-in-out); active toggles opacity 1 / .3.
const tableHeadCellFilterLabelVariants = cva(
  'ml-1 size-4 p-2 scale-75 align-middle transition-all duration-150 ease-in-out',
  {
    variants: {
      active: {
        true: 'opacity-100',
        false: 'opacity-30',
      },
    },
  },
);

export interface ST_TableHeadCellFilterLabelProps<TData extends ST_RowData>
  extends ButtonProps {
  header: ST_Header<TData>;
  table: ST_TableInstance<TData>;
}

export const ST_TableHeadCellFilterLabel = <TData extends ST_RowData>({
  header,
  table,
  ...rest
}: ST_TableHeadCellFilterLabelProps<TData>) => {
  const {
    options: {
      columnFilterDisplayMode,
      icons: { FilterAltIcon },
      localization,
    },
    refs: { filterInputRefs },
    setShowColumnFilters,
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const filterValue = column.getFilterValue() as [string, string] | string;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const {
    currentFilterOption,
    isMultiSelectFilter,
    isRangeFilter,
    isSelectFilter,
  } = getColumnFilterInfo({ header, table });

  const dropdownOptions = useDropdownOptions({ header, table });

  const getSelectLabel = (index?: number) =>
    getValueAndLabel(
      dropdownOptions?.find(
        (option) =>
          getValueAndLabel(option).value ===
          (index !== undefined ? filterValue[index] : filterValue),
      ),
    ).label;

  const isFilterActive =
    (Array.isArray(filterValue) && filterValue.some(Boolean)) ||
    (!!filterValue && !Array.isArray(filterValue));

  const filterTooltip =
    columnFilterDisplayMode === 'popover' && !isFilterActive
      ? localization.filterByColumn?.replace(
          '{column}',
          String(columnDef.header),
        )
      : localization.filteringByColumn
          .replace('{column}', String(columnDef.header))
          .replace(
            '{filterType}',
            currentFilterOption
              ? localization[
                  `filter${
                    currentFilterOption.charAt(0).toUpperCase() +
                    currentFilterOption.slice(1)
                  }` as keyof typeof localization
                ]
              : '',
          )
          .replace(
            '{filterValue}',
            `"${
              Array.isArray(filterValue)
                ? (filterValue as [string, string])
                    .map((value, index) =>
                      isMultiSelectFilter ? getSelectLabel(index) : value,
                    )
                    .join(
                      `" ${isRangeFilter ? localization.and : localization.or} "`,
                    )
                : isSelectFilter
                  ? getSelectLabel()
                  : (filterValue as string)
            }"`,
          )
          .replace('" "', '');

  return (
    <>
      {/* <Grow in={...} unmountOnExit> — Note: MUI Grow dropped; its `in` expression gates the render (= unmountOnExit); the span carries its enter (fade + zoom-in-75, 150ms), exit is instant. */}
      {(columnFilterDisplayMode === 'popover' ||
        (!!filterValue && !isRangeFilter) ||
        (isRangeFilter && (!!filterValue?.[0] || !!filterValue?.[1]))) && (
        <span className="flex-none animate-in fade-in zoom-in-75 duration-150">
          <ST_Tooltip side="top" title={filterTooltip}>
            {/* disableRipple — Note: shadcn Button has no ripple. */}
            <Button
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                if (columnFilterDisplayMode === 'popover') {
                  setAnchorEl(event.currentTarget);
                } else {
                  setShowColumnFilters(true);
                }
                queueMicrotask(() => {
                  filterInputRefs.current?.[`${column.id}-0`]?.focus?.();
                  filterInputRefs.current?.[`${column.id}-0`]?.select?.();
                });
                event.stopPropagation();
              }}
              size="icon-sm"
              type="button"
              variant="ghost"
              {...rest}
              className={cn(
                tableHeadCellFilterLabelVariants({ active: isFilterActive }),
                rest.className,
              )}
            >
              <FilterAltIcon className="size-6" />
            </Button>
          </ST_Tooltip>
        </span>
      )}
      {columnFilterDisplayMode === 'popover' && (
        <Popover
          onOpenChange={(open) => {
            // event.stopPropagation(); — Note: Base UI has no backdrop click to stop.
            if (!open) setAnchorEl(null);
          }}
          open={!!anchorEl}
        >
          {/* Base UI has no PopoverAnchor part: the anchor is a Positioner prop. The shadcn
              PopoverContent owns its Positioner and does not forward `anchor`, so the
              Portal, Positioner and Popup are composed here with the same classes. */}
          {/* disableScrollLock — Note: Base UI Popover is non-modal by default, no scroll lock. */}
          {/* slotProps={{ paper: { sx: { overflow: 'visible' } } }} — Note: the popup has no overflow clip. */}
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Positioner
              align="center"
              anchor={anchorEl}
              className="isolate z-50"
              side="top"
              sideOffset={4}
            >
              <PopoverPrimitive.Popup
                data-slot="popover-content"
                className={cn(
                  'z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
                  'w-auto',
                )}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) =>
                  event.key === 'Enter' && setAnchorEl(null)
                }
              >
                {/* <Box sx={{ p: '1rem' }}> — Note: the popup already pads p-2.5. */}
                <ST_TableHeadCellFilterContainer
                  header={header}
                  table={table}
                />
              </PopoverPrimitive.Popup>
            </PopoverPrimitive.Positioner>
          </PopoverPrimitive.Portal>
        </Popover>
      )}
    </>
  );
};
