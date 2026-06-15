import { type ComponentProps, type MouseEvent } from 'react';
import {
  mergeSRT_HtmlProps,
  parseSRT_HtmlProps,
  type SRT_Column,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SRT_Tooltip } from '../SRT_Tooltip';

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
    options: { localization, srtFilterCheckboxProps },
  } = table;
  const { density } = getState();
  const { columnDef } = column;

  // Resolve the slot props: table-level defaults overridable per-column.
  const slotProps = mergeSRT_HtmlProps(
    parseSRT_HtmlProps(srtFilterCheckboxProps, { column, table }),
    parseSRT_HtmlProps(columnDef.srtFilterCheckboxProps, { column, table }),
  );

  const filterValue = column.getFilterValue();

  const filterLabel = localization.filterByColumn?.replace(
    '{column}',
    columnDef.header,
  );

  const checkedState: boolean | 'indeterminate' =
    filterValue === undefined ? 'indeterminate' : filterValue === 'true';

  // Mirror MRT: a `title` slot prop overrides the default filter label.
  const tooltipTitle = (slotProps?.title as string) ?? filterLabel;

  return (
    <SRT_Tooltip title={tooltipTitle} asChild>
      <div
        className={cn(
          'mt-[-4px] flex items-center gap-2 font-normal text-muted-foreground',
          className,
        )}
      >
        <Checkbox
          checked={checkedState}
          {...slotProps}
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
            // Compose the user's slot-prop onClick after the component's logic.
            slotProps?.onClick?.(e);
          }}
          className={cn(
            density === 'compact' ? 'size-4' : 'size-5',
            slotProps?.className,
          )}
          {...rest}
        />
        <Label className="cursor-pointer font-normal text-muted-foreground">
          {tooltipTitle}
        </Label>
      </div>
    </SRT_Tooltip>
  );
};
