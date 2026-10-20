import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import {
  type SliderProps,
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';

export interface ST_FilterRangeSliderProps<TData extends ST_RowData>
  extends SliderProps {
  header: ST_Header<TData>;
  table: ST_TableInstance<TData>;
}

const filterRangeSliderVariants = cva('m-auto w-[calc(100%-8px)] px-1', {
  variants: {
    showChangeModeButton: {
      false: 'mt-2.5',
      true: 'mt-1.5',
    },
  },
  defaultVariants: {
    showChangeModeButton: false,
  },
});

export const ST_FilterRangeSlider = <TData extends ST_RowData>({
  header,
  table,
  ...rest
}: ST_FilterRangeSliderProps<TData>) => {
  const {
    options: {
      enableColumnFilterModes,
      enableFacetedValues,
      localization,
      stFilterSliderProps,
    },
    refs: { filterInputRefs },
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const currentFilterOption = columnDef._filterFn;

  const showChangeModeButton =
    enableColumnFilterModes && columnDef.enableColumnFilterModes !== false;

  const sliderProps = {
    ...parseFromValuesOrFunc(stFilterSliderProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.stFilterSliderProps, { column, table }),
    ...rest,
  };

  let [min, max] =
    sliderProps.min !== undefined && sliderProps.max !== undefined
      ? [sliderProps.min, sliderProps.max]
      : ((enableFacetedValues
          ? column.getFacetedMinMaxValues()
          : undefined) ?? [0, 1]);

  //fix potential TanStack Table bugs where min or max is an array
  if (Array.isArray(min)) min = min[0];
  if (Array.isArray(max)) max = max[0];
  if (min === null) min = 0;
  if (max === null) max = 1;

  const [filterValues, setFilterValues] = useState([min, max]);
  const columnFilterValue = column.getFilterValue();

  const isMounted = useRef(false);

  // Base UI reports a bare number for a single-thumb slider; the range filter
  // always works on one value per thumb.
  const toArray = (value: number | readonly number[]) =>
    typeof value === 'number' ? [value] : [...value];

  // prevent moving the focus to the next/prev cell when using the arrow keys
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.stopPropagation();
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      if (columnFilterValue === undefined) {
        setFilterValues([min, max]);
      } else if (Array.isArray(columnFilterValue)) {
        setFilterValues(columnFilterValue);
      }
    }
    isMounted.current = true;
  }, [columnFilterValue, min, max]);

  return (
    <div className="flex flex-col">
      <Slider
        // disableSwap
        // Note: Base UI Slider defaults thumbCollisionBehavior="push", so thumbs never cross (= MUI disableSwap).
        max={max}
        min={min}
        onValueChange={(values) => {
          setFilterValues(toArray(values));
        }}
        // Base UI fires onValueCommitted once per interaction, on release, and
        // not when the value did not change.
        onValueCommitted={(committed) => {
          const value = toArray(committed);
          if (value.length === 2) {
            if (value[0] <= min && value[1] >= max) {
              //if the user has selected the entire range, remove the filter
              column.setFilterValue(undefined);
            } else {
              column.setFilterValue(value as [number, number]);
            }
          }
        }}
        onKeyDown={handleKeyDown}
        value={filterValues}
        // valueLabelDisplay="auto"
        // Note: Base UI has a Slider.Value part, but the shadcn slider does not render it.
        {...sliderProps}
        ref={(node) => {
          if (node) {
            // Base UI Thumb renders a div with a nested <input type="range">;
            // the input is the focus target.
            filterInputRefs.current![`${column.id}-0`] =
              node.querySelector<HTMLInputElement>(
                '[data-slot="slider-thumb"] input',
              )!;
            if (sliderProps?.ref) {
              // @ts-expect-error MRT no-op: node onto the ref prop (Base UI exposes no input slot; root div ref)
              sliderProps.ref = node;
            }
          }
        }}
        className={cn(
          filterRangeSliderVariants({ showChangeModeButton }),
          sliderProps?.className,
        )}
        style={{
          minWidth: `${column.getSize() - 50}px`,
          ...sliderProps?.style,
        }}
      />
      {showChangeModeButton ? (
        <p className="m-[-3px_-6px] text-xs leading-[0.8rem] whitespace-nowrap text-muted-foreground">
          {localization.filterMode.replace(
            '{filterType}',
            localization[
              `filter${
                currentFilterOption?.charAt(0)?.toUpperCase() +
                currentFilterOption?.slice(1)
              }` as keyof typeof localization
            ],
          )}
        </p>
      ) : null}
    </div>
  );
};
