import {
  type ComponentProps,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  type DivProps,
  parseFromValuesOrFunc,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

export interface SRT_FilterRangeSliderProps<TData extends SRT_RowData>
  extends DivProps {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

// Note: base maps MRT's sx (m:auto, width:'calc(100% - 8px)', px:'4px'); the
// hasModeButton variant maps mt 6px (mode button present) / 10px (absent).
const filterRangeSliderVariants = cva('mx-auto w-[calc(100%-8px)] px-1', {
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

  // Note: DivProps carries no min/max; MRT reads them off the slider slot, so
  // reach the same optional numerics through a cast.
  const { max: maxProp, min: minProp } = sliderProps as DivProps & {
    max?: number;
    min?: number;
  };

  let [min, max] =
    minProp !== undefined && maxProp !== undefined
      ? [minProp, maxProp]
      : (column.getFacetedMinMaxValues() ?? [0, 1]);

  //fix potential TanStack Table bugs where min or max is an array
  if (Array.isArray(min)) min = min[0];
  if (Array.isArray(max)) max = max[0];
  if (min === null || min === undefined) min = 0;
  if (max === null || max === undefined) max = 1;

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
            filterInputRefs.current[`${column.id}-0`] =
              node as unknown as HTMLInputElement;
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
