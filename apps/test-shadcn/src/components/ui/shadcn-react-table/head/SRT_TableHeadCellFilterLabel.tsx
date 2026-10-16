import { type MouseEvent, useState } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_TableHeadCellFilterContainer } from './SRT_TableHeadCellFilterContainer';
import {
  type ButtonProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import { getColumnFilterInfo, useDropdownOptions } from '../utils/column.utils';
import { getValueAndLabel } from '../utils/utils';

// Note: base maps MRT's sx (16px box + 8px padding = icon-sm, ml 4px, scale .75, transition all 150ms ease-in-out); active toggles opacity 1 / .3.
const tableHeadCellFilterLabelVariants = cva(
  'ml-1 scale-75 transition-all duration-150 ease-in-out',
  {
    variants: {
      active: {
        true: 'opacity-100',
        false: 'opacity-30',
      },
    },
  },
);

export interface SRT_TableHeadCellFilterLabelProps<TData extends SRT_RowData>
  extends ButtonProps {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

export const SRT_TableHeadCellFilterLabel = <TData extends SRT_RowData>({
  header,
  table,
  ...rest
}: SRT_TableHeadCellFilterLabelProps<TData>) => {
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
      {/* <Grow in={...} unmountOnExit> — Note: MUI Grow dropped; its `in` expression gates the render (= unmountOnExit). */}
      {(columnFilterDisplayMode === 'popover' ||
        (!!filterValue && !isRangeFilter) ||
        (isRangeFilter && (!!filterValue?.[0] || !!filterValue?.[1]))) && (
        <span className="flex-none">
          <SRT_Tooltip side="top" title={filterTooltip}>
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
              <FilterAltIcon />
            </Button>
          </SRT_Tooltip>
        </span>
      )}
      {columnFilterDisplayMode === 'popover' && (
        <Popover
          onOpenChange={(open) => {
            // event.stopPropagation(); — Note: radix has no backdrop click to stop.
            if (!open) setAnchorEl(null);
          }}
          open={!!anchorEl}
        >
          {anchorEl && <PopoverAnchor virtualRef={{ current: anchorEl }} />}
          {/* disableScrollLock — Note: radix Popover is non-modal, no scroll lock. */}
          {/* slotProps={{ paper: { sx: { overflow: 'visible' } } }} — Note: PopoverContent has no overflow clip. */}
          <PopoverContent
            align="center"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.key === 'Enter' && setAnchorEl(null)}
            side="top"
          >
            {/* <Box sx={{ p: '1rem' }}> — Note: PopoverContent already pads p-4. */}
            <SRT_TableHeadCellFilterContainer header={header} table={table} />
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};
