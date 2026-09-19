import {
  type ComponentProps,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  type SpanProps,
  parseFromValuesOrFunc,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

export interface SRT_FilterRangeSliderProps<TData extends SRT_RowData>
  extends SpanProps {
  max?: number;
  min?: number;
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

const filterRangeSliderVariants = cva('mx-auto w-[calc(100%-8px)]', {
  variants: {
    hasModeButton: {
      false: 'mt-2.5',
      true: 'mt-1.5',
    },
  },
  defaultVariants: {
    hasModeButton: false,
  },
});

export const SRT_FilterRangeSlider = <TData extends SRT_RowData>({
  header,
  table,
  ...rest
}: SRT_FilterRangeSliderProps<TData>) => {
  const {
    options: { enableColumnFilterModes, localization, srtFilterSliderProps },
    refs: { filterInputRefs },
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const currentFilterOption = columnDef._filterFn;

  const showChangeModeButton =
    enableColumnFilterModes && columnDef.enableColumnFilterModes !== false;

  const sliderProps = {
    ...parseFromValuesOrFunc(srtFilterSliderProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.srtFilterSliderProps, { column, table }),
    ...rest,
  };

  const { max: maxProp, min: minProp } = sliderProps;

  let [min, max] =
    minProp !== undefined && maxProp !== undefined
      ? [minProp, maxProp]
      : (column.getFacetedMinMaxValues() ?? [0, 1]);

  //fix potential TanStack Table bugs where min or max is an array
  if (Array.isArray(min)) min = min[0];
  if (Array.isArray(max)) max = max[0];
  if (min === null) min = 0;
  if (max === null) max = 1;

  const [filterValues, setFilterValues] = useState<number[]>([min, max]);
  const columnFilterValue = column.getFilterValue();

  const isMounted = useRef(false);

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
        setFilterValues(columnFilterValue as number[]);
      }
    }
    isMounted.current = true;
  }, [columnFilterValue, min, max]);

  return (
    <div className="flex flex-col">
      <Slider
        // disableSwap  // Note: radix prevents thumb swap natively; MUI disableSwap dropped.
        max={max}
        min={min}
        onValueChange={(values) => {
          setFilterValues(values);
        }}
        onValueCommit={(value) => {
          if (Array.isArray(value)) {
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
        // valueLabelDisplay="auto"  // Note: radix has no value labels; June parity.
        {...(sliderProps as ComponentProps<typeof Slider>)}
        ref={(node) => {
          if (node && filterInputRefs.current) {
            const thumb = node.querySelector(
              '[data-slot="slider-thumb"]',
            ) as HTMLElement | null;
            filterInputRefs.current[`${column.id}-0`] = (thumb ??
              node) as unknown as HTMLInputElement;
          }
          const userRef = (sliderProps as ComponentProps<typeof Slider>).ref;
          if (typeof userRef === 'function') {
            userRef(node);
          } else if (userRef) {
            userRef.current = node;
          }
        }}
        className={cn(
          filterRangeSliderVariants({ hasModeButton: showChangeModeButton }),
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
