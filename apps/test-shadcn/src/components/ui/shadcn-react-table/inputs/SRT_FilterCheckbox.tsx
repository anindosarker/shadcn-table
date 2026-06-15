import { type ComponentProps, type MouseEvent } from 'react';
import {
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface SRT_FilterCheckboxProps<TData extends SRT_RowData>
  extends Omit<ComponentProps<typeof Checkbox>, 'checked' | 'onCheckedChange'> {
  column: SRT_Column<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Filter checkbox - tri-state checkbox input for column filtering.
 *
 * Ports MRT_FilterCheckbox. The filter value cycles
 * undefined -> 'true' -> 'false' -> undefined, and renders as
 * indeterminate while undefined (no filter applied).
 */
export const SRT_FilterCheckbox = <TData extends SRT_RowData>({
  column,
  table,
  className,
  ...rest
}: SRT_FilterCheckboxProps<TData>) => {
  const {
    getState,
    options: { localization },
  } = table;
  const { density } = getState();
  const { columnDef } = column;

  const filterValue = column.getFilterValue();

  const filterLabel = localization.filterByColumn?.replace(
    '{column}',
    columnDef.header,
  );

  const checkedState: boolean | 'indeterminate' =
    filterValue === undefined ? 'indeterminate' : filterValue === 'true';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'mt-[-4px] flex items-center gap-2 font-normal text-muted-foreground',
            className,
          )}
        >
          <Checkbox
            checked={checkedState}
            onCheckedChange={() => {
              column.setFilterValue(
                filterValue === undefined
                  ? 'true'
                  : filterValue === 'true'
                    ? 'false'
                    : undefined,
              );
            }}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
            }}
            className={cn(density === 'compact' ? 'size-4' : 'size-5')}
            {...rest}
          />
          <Label className="cursor-pointer font-normal text-muted-foreground">
            {filterLabel}
          </Label>
        </div>
      </TooltipTrigger>
      <TooltipContent>{filterLabel}</TooltipContent>
    </Tooltip>
  );
};
