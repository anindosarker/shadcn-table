import { type MouseEvent, useState } from 'react';
import { flushSync } from 'react-dom';
import { useSelector } from '@tanstack/react-store';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  'ms-1 size-4 p-2 scale-75 align-middle transition-all duration-150 ease-in-out',
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

  useSelector(table.atoms.columnFilters);
  useSelector(table.atoms.globalFilter);

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

  const filterInput = () => filterInputRefs.current?.[`${column.id}-0`];

  // Shows the column filters and focuses the column's input once it renders.
  const handleShowColumnFilters = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    flushSync(() => setShowColumnFilters(true));
    filterInput()?.focus();
    filterInput()?.select();
  };

  const buttonProps = {
    size: 'icon-sm',
    type: 'button',
    variant: 'ghost',
    ...rest,
    className: cn(
      tableHeadCellFilterLabelVariants({ active: isFilterActive }),
      rest.className,
    ),
  } as const;

  return (
    <>
      {(columnFilterDisplayMode === 'popover' ||
        (!!filterValue && !isRangeFilter) ||
        (isRangeFilter && (!!filterValue?.[0] || !!filterValue?.[1]))) && (
        <span className="flex-none animate-in fade-in zoom-in-75 duration-150">
          {columnFilterDisplayMode === 'popover' ? (
            <Popover onOpenChange={setOpen} open={open}>
              <ST_Tooltip side="top" title={filterTooltip}>
                <PopoverTrigger
                  render={
                    <Button
                      onClick={(event: MouseEvent<HTMLButtonElement>) =>
                        event.stopPropagation()
                      }
                      {...buttonProps}
                    />
                  }
                >
                  <FilterAltIcon className="size-6" />
                </PopoverTrigger>
              </ST_Tooltip>
              <PopoverContent
                className="w-auto"
                initialFocus={() => filterInput() ?? true}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.key === 'Enter' && setOpen(false)}
                side="top"
              >
                <ST_TableHeadCellFilterContainer header={header} />
              </PopoverContent>
            </Popover>
          ) : (
            <ST_Tooltip side="top" title={filterTooltip}>
              <Button onClick={handleShowColumnFilters} {...buttonProps}>
                <FilterAltIcon className="size-6" />
              </Button>
            </ST_Tooltip>
          )}
        </span>
      )}
    </>
  );
};
