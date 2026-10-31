import { type ComponentPropsWithRef, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_FilterOption,
  type ST_Header,
  type ST_InternalFilterOption,
  type ST_Localization,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { getColumnFilterFnName } from '@/components/ui/shadcn-table/shared/utils/column.utils';
import { ST_ActionMenuItem } from '@/components/ui/shadcn-table/components/menus/ST_ActionMenuItem';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';
import { useST_MenuAnchor } from '@/components/ui/shadcn-table/hooks/useST_MenuAnchor';

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
  /** Rendered as the submenu of a `DropdownMenuSub` instead of its own menu. */
  isSubMenu?: boolean;
  onSelect?: () => void;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  setFilterValue?: (filterValue: string | string[]) => void;
}

export const ST_FilterOptionMenu = <TData extends ST_RowData>({
  className,
  anchorEl,
  header,
  isSubMenu,
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
      setColumnFilterFns((prev) => ({
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
          (currentFilterValue as ArrayLike<unknown> | undefined)?.length
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
          (!currentFilterValue.every((v) => v === '') &&
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

  const { anchorRef, onOpenChange, rect, spanProps } = useST_MenuAnchor({
    anchorEl,
    setAnchorEl,
  });

  const menuItems = (
    <>
      {/* The column mode name is written onto the column def from
        `columnFilterFns` in the root render, so that slice is selected. */}
      <table.Subscribe
        selector={(state) => ({
          columnFilterFns: state.columnFilterFns,
          globalFilterFn: state.globalFilterFn,
        })}
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
      </table.Subscribe>
    </>
  );

  if (isSubMenu) {
    return (
      <DropdownMenuSubContent className={cn('w-max', className)} {...rest}>
        {menuItems}
      </DropdownMenuSubContent>
    );
  }

  return (
    <DropdownMenu open={!!anchorEl} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        nativeButton={false}
        render={<span {...spanProps} />}
      />
      <DropdownMenuContent
        align="start"
        alignOffset={(rect?.height ?? 0) / 2}
        side="right"
        finalFocus={anchorRef}
        className={cn('w-max', className)}
        {...rest}
      >
        {menuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
