import { type MouseEvent, useState } from 'react';
import {
  type ButtonProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  getColumnFilterInfo,
  getValueAndLabel,
  useDropdownOptions,
} from 'shadcn-react-table-core';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_TableHeadCellFilterContainer } from './SRT_TableHeadCellFilterContainer';

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

  const rect = anchorEl?.getBoundingClientRect();

  return (
    <>
      {/* Note: MUI Grow transition dropped — conditional render keeps unmountOnExit semantics */}
      {(columnFilterDisplayMode === 'popover' ||
        (!!filterValue && !isRangeFilter) ||
        (isRangeFilter && (!!filterValue?.[0] || !!filterValue?.[1]))) && (
        <span className="shrink-0">
          <SRT_Tooltip side="top" title={filterTooltip}>
            {/* disableRipple + size="small" dropped — no shadcn ripple */}
            {/* Note: MUI IconButton sx dropped (16px box, p:8px, scale(0.75),
                opacity 1/0.3 active, transition 150ms) — shadcn ghost + icon-sm
                (MUI small) wins; only ml-1 layout margin (MUI ml:4px) kept. */}
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              aria-label={filterTooltip}
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
              {...rest}
              className={cn('ml-1', rest.className)}
            >
              <FilterAltIcon />
            </Button>
          </SRT_Tooltip>
        </span>
      )}
      {columnFilterDisplayMode === 'popover' && (
        <Popover
          open={!!anchorEl}
          onOpenChange={(open) => {
            if (!open) setAnchorEl(null);
          }}
        >
          <PopoverAnchor asChild>
            <span
              aria-hidden
              style={{
                position: 'fixed',
                left: rect?.left ?? 0,
                top: rect?.top ?? 0,
                width: rect?.width ?? 0,
                height: rect?.height ?? 0,
                pointerEvents: 'none',
              }}
            />
          </PopoverAnchor>
          {/* disableScrollLock + slotProps.paper overflow:visible dropped — Radix Popover doesn't scroll-lock; overflow handled by content */}
          <PopoverContent
            align="center"
            side="top"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.key === 'Enter' && setAnchorEl(null)}
          >
            <div className="p-4">
              <SRT_TableHeadCellFilterContainer header={header} table={table} />
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};
