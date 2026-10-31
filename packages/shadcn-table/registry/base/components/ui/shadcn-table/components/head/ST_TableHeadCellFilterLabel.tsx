import { type MouseEvent, useState } from 'react';
import { useSelector } from '@tanstack/react-store';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { Popover } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { ST_TableHeadCellFilterContainer } from '@/components/ui/shadcn-table/components/head/ST_TableHeadCellFilterContainer';
import {
  type ButtonProps,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import {
  getColumnFilterInfo,
  useDropdownOptions,
} from '@/components/ui/shadcn-table/shared/utils/column.utils';
import { getValueAndLabel } from '@/components/ui/shadcn-table/shared/utils/utils';

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
}

export const ST_TableHeadCellFilterLabel = <TData extends ST_RowData>({
  header,
  ...rest
}: ST_TableHeadCellFilterLabelProps<TData>) => {
  const table = header.table;
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

  // The filter value and the faceted values behind the dropdown options memo
  // follow the column and global filters, so both are hook subscriptions.
  useSelector(table.atoms.columnFilters);
  useSelector(table.atoms.globalFilter);

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
      {(columnFilterDisplayMode === 'popover' ||
        (!!filterValue && !isRangeFilter) ||
        (isRangeFilter && (!!filterValue?.[0] || !!filterValue?.[1]))) && (
        <span className="flex-none animate-in fade-in zoom-in-75 duration-150">
          <ST_Tooltip side="top" title={filterTooltip}>
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
            if (!open) setAnchorEl(null);
          }}
          open={!!anchorEl}
        >
          {/* Base UI has no PopoverAnchor part: the anchor is a Positioner prop. The shadcn
              PopoverContent owns its Positioner and does not forward `anchor`, so the
              Portal, Positioner and Popup are composed here with the same classes. */}
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
                <ST_TableHeadCellFilterContainer header={header} />
              </PopoverPrimitive.Popup>
            </PopoverPrimitive.Positioner>
          </PopoverPrimitive.Portal>
        </Popover>
      )}
    </>
  );
};
