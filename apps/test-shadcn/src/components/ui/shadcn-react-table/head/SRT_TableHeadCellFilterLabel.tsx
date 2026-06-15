import { type MouseEvent, useState } from 'react';
import { FilterIcon } from 'lucide-react';
import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  getColumnFilterInfo,
  getValueAndLabel,
  useDropdownOptions,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SRT_TableHeadCellFilterContainer } from './SRT_TableHeadCellFilterContainer';

export interface SRT_TableHeadCellFilterLabelProps<TData extends SRT_RowData> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Filter label - active-filter indicator chip in the column header.
 *
 * Ported 1:1 from MRT_TableHeadCellFilterLabel:
 * - Shows the filter icon when the display mode is 'popover' or a filter is
 *   active (MUI Grow -> conditional render with zoom-in animation).
 * - Tooltip describes the active filter, including select labels and range
 *   ("and"/"or") joins, exactly as MRT builds the string.
 * - Click: in popover mode opens a popover containing the filter container;
 *   otherwise reveals the subheader filters. Either way it focuses + selects the
 *   first filter input on the next microtask.
 */

export const SRT_TableHeadCellFilterLabel = <TData extends SRT_RowData>({
  header,
  table,
  className,
}: SRT_TableHeadCellFilterLabelProps<TData>) => {
  const {
    options: { columnFilterDisplayMode, localization },
    refs: { filterInputRefs },
    setShowColumnFilters,
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const filterValue = column.getFilterValue() as [string, string] | string;

  const [open, setOpen] = useState(false);

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

  const shouldShow =
    columnFilterDisplayMode === 'popover' ||
    (!!filterValue && !isRangeFilter) ||
    (isRangeFilter && (!!filterValue?.[0] || !!filterValue?.[1]));

  if (!shouldShow) return null;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (columnFilterDisplayMode === 'popover') {
      setOpen(true);
    } else {
      setShowColumnFilters(true);
    }
    queueMicrotask(() => {
      filterInputRefs.current?.[`${column.id}-0`]?.focus?.();
      filterInputRefs.current?.[`${column.id}-0`]?.select?.();
    });
    event.stopPropagation();
  };

  const button = (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={filterTooltip}
          onClick={handleClick}
          className={cn(
            'ml-1 h-4 w-4 flex-none scale-75 p-2 transition-all',
            'animate-in zoom-in-50 duration-200',
            isFilterActive
              ? 'opacity-100'
              : 'opacity-30 group-hover:opacity-100',
            className,
          )}
        >
          <FilterIcon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      {filterTooltip ? (
        <TooltipContent side="top">{filterTooltip}</TooltipContent>
      ) : null}
    </Tooltip>
  );

  if (columnFilterDisplayMode === 'popover') {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>{button}</PopoverAnchor>
        <PopoverContent
          align="center"
          side="bottom"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.key === 'Enter' && setOpen(false)}
          className="overflow-visible"
        >
          <div className="p-4">
            <SRT_TableHeadCellFilterContainer header={header} table={table} />
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return button;
};
