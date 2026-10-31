import { type KeyboardEvent, useState } from 'react';
import { Subscribe } from '@tanstack/react-table';
import { useSelector } from '@tanstack/react-store';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import {
  type SliderProps,
  type ST_ColumnDef,
  type ST_Header,
  type ST_RowData,
  type ST_TableOptions,
} from '@/components/ui/shadcn-table/types';
import { getColumnFilterFnName } from '@/components/ui/shadcn-table/shared/utils/column.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';

export interface ST_FilterRangeSliderProps<TData extends ST_RowData>
  extends SliderProps {
  header: ST_Header<TData>;
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
  ...rest
}: ST_FilterRangeSliderProps<TData>) => {
  const table = header.table;
  const {
    options: { enableColumnFilterModes, enableFacetedValues, localization },
    refs: { filterInputRefs },
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const {
    stFilterSliderProps,
  }: Pick<ST_TableOptions<TData>, 'stFilterSliderProps'> = table.options;
  const {
    stFilterSliderProps: columnFilterSliderProps,
  }: Pick<ST_ColumnDef<TData>, 'stFilterSliderProps'> = columnDef;
  useSelector(table.atoms.columnFilters);
  useSelector(table.atoms.globalFilter);

  const currentFilterOption = getColumnFilterFnName(columnDef);

  const showChangeModeButton =
    enableColumnFilterModes && columnDef.enableColumnFilterModes !== false;

  const sliderProps = {
    ...parseFromValuesOrFunc(stFilterSliderProps, { column, table }),
    ...parseFromValuesOrFunc(columnFilterSliderProps, { column, table }),
    ...rest,
  };

  let [min, max] =
    sliderProps.minValue !== undefined && sliderProps.maxValue !== undefined
      ? [sliderProps.minValue, sliderProps.maxValue]
      : ((enableFacetedValues
          ? column.getFacetedMinMaxValues()
          : undefined) ?? [0, 1]);

  if (Array.isArray(min)) min = min[0];
  if (Array.isArray(max)) max = max[0];
  if (min === null) min = 0;
  if (max === null) max = 1;

  const [filterValues, setFilterValues] = useState([min, max]);
  const columnFilterValue = column.getFilterValue();

  // prevent moving the focus to the next/prev cell when using the arrow keys
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.stopPropagation();
    }
  };

  // React Aria reports a bare number for a single-thumb slider; the range
  // filter always works on one value per thumb.
  const toArray = (value: number | readonly number[]) =>
    typeof value === 'number' ? [value] : [...value];

  // An outside filter change or a new facet range resets the thumbs.
  const [prevSync, setPrevSync] = useState({ columnFilterValue, max, min });
  if (
    prevSync.columnFilterValue !== columnFilterValue ||
    prevSync.max !== max ||
    prevSync.min !== min
  ) {
    setPrevSync({ columnFilterValue, max, min });
    if (columnFilterValue === undefined) {
      setFilterValues([min, max]);
    } else if (Array.isArray(columnFilterValue)) {
      setFilterValues(columnFilterValue);
    }
  }

  return (
    <Subscribe source={table.atoms.columnSizing}>
      {() => (
        // The aria Slider takes no ref and no onKeyDown: both sit on the wrapper.
        <div
          className="flex flex-col"
          onKeyDown={handleKeyDown}
          ref={(node) => {
            if (node) {
              // React Aria SliderThumb renders a div with a nested
              // <input type="range">; the input is the focus target.
              filterInputRefs.current[`${column.id}-0`] =
                node.querySelector<HTMLInputElement>(
                  '[data-slot="slider-thumb"] input',
                )!;
            }
          }}
        >
          <Slider
            maxValue={max}
            minValue={min}
            onChange={(values) => {
              setFilterValues(toArray(values));
            }}
            onChangeEnd={(committed) => {
              const value = toArray(committed);
              if (value.length === 2) {
                if (value[0] <= min && value[1] >= max) {
                  column.setFilterValue(undefined);
                } else {
                  column.setFilterValue(value as [number, number]);
                }
              }
            }}
            value={filterValues}
            {...sliderProps}
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
      )}
    </Subscribe>
  );
};
