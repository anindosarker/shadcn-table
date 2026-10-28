import { type ComponentPropsWithRef, useMemo, useRef } from 'react';
import { Subscribe } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui-base/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_FilterOption,
  type ST_Header,
  type ST_InternalFilterOption,
  type ST_Localization,
  type ST_RowData,
} from '@/components/ui-base/shadcn-table/types';
import { getColumnFilterFnName } from '@/components/ui-base/shadcn-table/shared/utils/column.utils';
import { ST_ActionMenuItem } from '@/components/ui-base/shadcn-table/components/menus/ST_ActionMenuItem';
import { useSTContext } from '@/components/ui-base/shadcn-table/hooks/stTableHook';

export const stFilterOptions = (
  localization: ST_Localization,
): ST_InternalFilterOption[] => [
  {
    divider: false,
    label: localization.filterFuzzy,
    option: 'fuzzy',
    symbol: '≈',
  },
  {
    divider: false,
    label: localization.filterContains,
    option: 'contains',
    symbol: '*',
  },
  {
    divider: false,
    label: localization.filterStartsWith,
    option: 'startsWith',
    symbol: 'a',
  },
  {
    divider: true,
    label: localization.filterEndsWith,
    option: 'endsWith',
    symbol: 'z',
  },
  {
    divider: false,
    label: localization.filterEquals,
    option: 'equals',
    symbol: '=',
  },
  {
    divider: true,
    label: localization.filterNotEquals,
    option: 'notEquals',
    symbol: '≠',
  },
  {
    divider: false,
    label: localization.filterBetween,
    option: 'between',
    symbol: '⇿',
  },
  {
    divider: true,
    label: localization.filterBetweenInclusive,
    option: 'betweenInclusive',
    symbol: '⬌',
  },
  {
    divider: false,
    label: localization.filterGreaterThan,
    option: 'greaterThan',
    symbol: '>',
  },
  {
    divider: false,
    label: localization.filterGreaterThanOrEqualTo,
    option: 'greaterThanOrEqualTo',
    symbol: '≥',
  },
  {
    divider: false,
    label: localization.filterLessThan,
    option: 'lessThan',
    symbol: '<',
  },
  {
    divider: true,
    label: localization.filterLessThanOrEqualTo,
    option: 'lessThanOrEqualTo',
    symbol: '≤',
  },
  {
    divider: false,
    label: localization.filterEmpty,
    option: 'empty',
    symbol: '∅',
  },
  {
    divider: false,
    label: localization.filterNotEmpty,
    option: 'notEmpty',
    symbol: '!∅',
  },
];

const rangeModes = ['between', 'betweenInclusive', 'inNumberRange'];
const emptyModes = ['empty', 'notEmpty'];
const arrModes = ['arrIncludesSome', 'arrIncludesAll', 'arrIncludes'];
const rangeVariants = ['range-slider', 'date-range', 'datetime-range', 'range'];

export interface ST_FilterOptionMenuProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuContent> {
  anchorEl: HTMLElement | null;
  header?: ST_Header<TData>;
  onSelect?: () => void;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFilterValue?: (filterValue: any) => void;
}

export const ST_FilterOptionMenu = <TData extends ST_RowData>({
  className,
  anchorEl,
  header,
  onSelect,
  setAnchorEl,
  setFilterValue,
  ...rest
}: ST_FilterOptionMenuProps<TData>) => {
  // Context, not `header.table`: the global filter menu has no header, and a
  // hook cannot be called conditionally.
  const table = useSTContext<TData>();
  const {
    options: {
      columnFilterModeOptions,
      globalFilterModeOptions,
      localization,
      renderColumnFilterModeMenuItems,
      renderGlobalFilterModeMenuItems,
    },
    setColumnFilterFns,
    setGlobalFilterFn,
  } = table;
  const { column } = header ?? {};
  const { columnDef } = column ?? {};

  let allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;

  if (rangeVariants.includes(columnDef?.filterVariant as string)) {
    allowedColumnFilterOptions = [
      ...rangeModes,
      ...(allowedColumnFilterOptions ?? []),
    ].filter((option) => rangeModes.includes(option));
  }

  const internalFilterOptions = useMemo(
    () =>
      stFilterOptions(localization).filter((filterOption) =>
        columnDef
          ? allowedColumnFilterOptions === undefined ||
            allowedColumnFilterOptions?.includes(filterOption.option)
          : (!globalFilterModeOptions ||
              globalFilterModeOptions.includes(filterOption.option)) &&
            ['contains', 'fuzzy', 'startsWith'].includes(filterOption.option),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options are read once per mount
    [],
  );

  const handleSelectFilterMode = (option: ST_FilterOption) => {
    const prevFilterMode = columnDef ? getColumnFilterFnName(columnDef) : '';
    if (!header || !column) {
      setGlobalFilterFn(option);
    } else if (option !== prevFilterMode) {
      const currentFilterValue = column.getFilterValue();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setColumnFilterFns((prev: { [key: string]: any }) => ({
        ...prev,
        [header.id]: option,
      }));

      if (emptyModes.includes(option)) {
        // Core drops an empty filter value, so the empty modes hold a space.
        if (
          currentFilterValue !== ' ' &&
          !emptyModes.includes(prevFilterMode)
        ) {
          column.setFilterValue(' ');
        }
      } else if (
        columnDef?.filterVariant === 'multi-select' ||
        arrModes.includes(option as string)
      ) {
        if (
          currentFilterValue instanceof String ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (currentFilterValue as Array<any>)?.length
        ) {
          column.setFilterValue([]);
          setFilterValue?.([]);
        }
      } else if (
        columnDef?.filterVariant?.includes('range') ||
        rangeModes.includes(option as ST_FilterOption)
      ) {
        if (
          !Array.isArray(currentFilterValue) ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (!(currentFilterValue as Array<any>)?.every((v) => v === '') &&
            !rangeModes.includes(prevFilterMode))
        ) {
          column.setFilterValue(['', '']);
          setFilterValue?.('');
        }
      } else {
        if (Array.isArray(currentFilterValue)) {
          column.setFilterValue('');
          setFilterValue?.('');
        } else if (
          currentFilterValue === ' ' &&
          emptyModes.includes(prevFilterMode)
        ) {
          column.setFilterValue(undefined);
        }
      }
    }
    setAnchorEl(null);
    onSelect?.();
  };

  // Base UI reads the popup's finalFocus when the menu closes, after this
  // component re-rendered with anchorEl cleared; the ref keeps the element
  // from the last open render.
  const anchorRef = useRef<HTMLElement | null>(null);
  if (anchorEl) anchorRef.current = anchorEl;

  const rect = anchorEl?.getBoundingClientRect();

  return (
    <DropdownMenu
      open={!!anchorEl}
      onOpenChange={(open) => {
        if (!open) setAnchorEl(null);
      }}
    >
      <DropdownMenuTrigger
        // The library anchors its menus to an invisible span, not a button.
        nativeButton={false}
        render={
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
        }
      />
      <DropdownMenuContent
        align="start"
        alignOffset={(rect?.height ?? 0) / 2}
        side="right"
        // Focus goes back to the real anchor; returning false keeps Base UI
        // off the invisible trigger.
        finalFocus={() => {
          anchorRef.current?.focus();
          return false;
        }}
        className={cn('w-max', className)}
        {...rest}
      >
        {/* The column mode name is written onto the column def from
            `columnFilterFns` in the root render, so that slice is selected. */}
        <Subscribe
          selector={(state) => ({
            columnFilterFns: state.columnFilterFns,
            globalFilterFn: state.globalFilterFn,
          })}
          source={table.store}
        >
          {({ globalFilterFn }) => {
            const filterOption =
              !!header && columnDef
                ? getColumnFilterFnName(columnDef)
                : globalFilterFn;

            return (
              <>
                {(header && column && columnDef
                  ? (columnDef.renderColumnFilterModeMenuItems?.({
                      column,
                      internalFilterOptions,
                      onSelectFilterMode: handleSelectFilterMode,
                      table,
                    }) ??
                    renderColumnFilterModeMenuItems?.({
                      column,
                      internalFilterOptions,
                      onSelectFilterMode: handleSelectFilterMode,
                      table,
                    }))
                  : renderGlobalFilterModeMenuItems?.({
                      internalFilterOptions,
                      onSelectFilterMode: handleSelectFilterMode,
                      table,
                    })) ??
                  internalFilterOptions.map(
                    ({ divider, label, option, symbol }, index) => (
                      <ST_ActionMenuItem
                        className={
                          option === filterOption ? 'bg-accent' : undefined
                        }
                        divider={divider}
                        icon={symbol}
                        key={index}
                        label={label}
                        onClick={() =>
                          handleSelectFilterMode(option as ST_FilterOption)
                        }
                      />
                    ),
                  )}
              </>
            );
          }}
        </Subscribe>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
