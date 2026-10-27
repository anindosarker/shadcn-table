import { type MouseEvent, useState } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { ST_TableHeadCellFilterContainer } from '@/components/ui/shadcn-table/components/head/ST_TableHeadCellFilterContainer';
import {
  type ButtonProps,
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import {
  getColumnFilterInfo,
  useDropdownOptions,
} from '@/components/ui/shadcn-table/shared/utils/column.utils';
import { getValueAndLabel } from '@/components/ui/shadcn-table/shared/utils/utils';
import { useST_Atom } from '@/components/ui/shadcn-table/hooks/stTableHook';

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
}

export const ST_TableHeadCellFilterLabel = <TData extends ST_RowData>({
  header,
  ...rest
}: ST_TableHeadCellFilterLabelProps<TData>) => {
  // The core table behind the header; the ST wrapper types re-type its
  // getters, so TypeScript cannot relate the two without the cast.
  const table = header.table as unknown as ST_TableInstance<TData>;
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
  useST_Atom(table.atoms.columnFilters);
  useST_Atom(table.atoms.globalFilter);

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
            className="w-auto"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.key === 'Enter' && setAnchorEl(null)}
            side="top"
          >
            {/* <Box sx={{ p: '1rem' }}> — Note: PopoverContent already pads p-4. */}
            <ST_TableHeadCellFilterContainer header={header} />
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};
