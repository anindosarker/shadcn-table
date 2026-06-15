import { type ComponentProps, useEffect, useRef, useState } from 'react';
import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

export interface SRT_FilterRangeSliderProps<TData extends SRT_RowData>
  extends Omit<ComponentProps<typeof Slider>, 'value' | 'onValueChange'> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Filter range slider - dual-thumb slider for numeric range filtering.
 *
 * Ports MRT_FilterRangeSlider. min/max come from explicit props or the
 * column's faceted min/max values. Committing the full range clears the
 * filter (matches MRT behavior).
 */
export const SRT_FilterRangeSlider = <TData extends SRT_RowData>({
  header,
  table,
  className,
  min: minProp,
  max: maxProp,
  ...rest
}: SRT_FilterRangeSliderProps<TData>) => {
  const {
    options: { enableColumnFilterModes, localization },
    refs: { filterInputRefs },
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const currentFilterOption = columnDef._filterFn;

  const showChangeModeButton =
    enableColumnFilterModes && columnDef.enableColumnFilterModes !== false;

  let [min, max] =
    minProp !== undefined && maxProp !== undefined
      ? [minProp, maxProp]
      : (column.getFacetedMinMaxValues() ?? [0, 1]);

  // fix potential TanStack Table bugs where min or max is an array
  if (Array.isArray(min)) min = min[0];
  if (Array.isArray(max)) max = max[0];
  if (min === null || min === undefined) min = 0;
  if (max === null || max === undefined) max = 1;

  const [filterValues, setFilterValues] = useState<number[]>([min, max]);
  const columnFilterValue = column.getFilterValue();

  const isMounted = useRef(false);

  // prevent moving focus to the next/prev cell when using the arrow keys
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.stopPropagation();
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      if (columnFilterValue === undefined) {
        setFilterValues([min, max]);
      } else if (Array.isArray(columnFilterValue)) {
        setFilterValues(columnFilterValue as number[]);
      }
    }
    isMounted.current = true;
  }, [columnFilterValue, min, max]);

  const commitValue = (value: number[]) => {
    if (Array.isArray(value)) {
      if (value[0] <= min && value[1] >= max) {
        // if the user has selected the entire range, remove the filter
        column.setFilterValue(undefined);
      } else {
        column.setFilterValue(value as [number, number]);
      }
    }
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <Slider
        min={min}
        max={max}
        value={filterValues}
        onValueChange={(values) => setFilterValues(values)}
        onValueCommit={commitValue}
        onKeyDown={handleKeyDown}
        ref={(node) => {
          if (node && filterInputRefs.current) {
            filterInputRefs.current[`${column.id}-0`] =
              node as unknown as HTMLInputElement;
          }
        }}
        className={cn(
          'mx-auto px-1',
          showChangeModeButton ? 'mt-1.5' : 'mt-2.5',
        )}
        style={{
          minWidth: `${column.getSize() - 50}px`,
          width: 'calc(100% - 8px)',
        }}
        {...rest}
      />
      {showChangeModeButton ? (
        <p className="-mx-1.5 -my-0.5 text-xs leading-tight whitespace-nowrap text-muted-foreground">
          {localization.filterMode.replace(
            '{filterType}',
            localization[
              `filter${
                (currentFilterOption?.charAt(0)?.toUpperCase() ?? '') +
                (currentFilterOption?.slice(1) ?? '')
              }` as keyof typeof localization
            ],
          )}
        </p>
      ) : null}
    </div>
  );
};
