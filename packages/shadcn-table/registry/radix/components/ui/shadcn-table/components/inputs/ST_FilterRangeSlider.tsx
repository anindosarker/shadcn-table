import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
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
  type ST_TableInstance,
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
  // The header carries the core table; the ST wrapper types re-type its getters.
  const table = header.table as unknown as ST_TableInstance<TData>;
  const {
    options: { enableColumnFilterModes, enableFacetedValues, localization },
    refs: { filterInputRefs },
  } = table;
  const { column } = header;
  const { columnDef } = column;
  // table.options and the column def hold the part props tree-neutral
  // (ST_NeutralPartPropTypes); the options as written (ST_TableOptions,
  // ST_ColumnDef) type them for this tree's Slider.
  const {
    stFilterSliderProps,
  }: Pick<ST_TableOptions<TData>, 'stFilterSliderProps'> = table.options;
  const {
    stFilterSliderProps: columnFilterSliderProps,
  }: Pick<ST_ColumnDef<TData>, 'stFilterSliderProps'> = columnDef;
  // The filter value and the faceted range feed the sync effect, so they are
  // hook subscriptions: the facets follow the other columns' filters and the
  // global filter.
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
    <Subscribe source={table.atoms.columnSizing}>
      {() => (
        <div className="flex flex-col">
          <Slider
            // disableSwap
            // Note: radix Slider has no disableSwap; thumbs sort on cross.
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
            // valueLabelDisplay="auto"
            // Note: radix Slider has no value label.
            {...sliderProps}
            ref={(node) => {
              if (node) {
                filterInputRefs.current![`${column.id}-0`] =
                  node.querySelector<HTMLInputElement>(
                    '[data-slot="slider-thumb"]',
                  )!;
                if (sliderProps?.ref) {
                  // @ts-expect-error MRT no-op: node onto the ref prop (radix has no input slot; root ref)
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
      )}
    </Subscribe>
  );
};
