import { type MouseEvent } from 'react';
import { type FocusableElement } from 'react-aria-components';
import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ST_Checkbox } from '@/components/ui/shadcn-table/ST_Checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  type CheckboxProps,
  type RadioProps,
  type ST_Row,
  type ST_RowData,
  type ST_TableOptions,
  type ST_TableState,
} from '@/components/ui/shadcn-table/types';
import {
  getIsRowSelected,
  getST_RowSelectionHandler,
  getST_SelectAllHandler,
} from '@/components/ui/shadcn-table/shared/utils/row.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

const selectCheckboxVariants = cva('z-0', {
  variants: {
    density: {
      comfortable: 'size-5',
      compact: 'size-4',
      spacious: 'size-5',
    },
  },
  defaultVariants: {
    density: 'comfortable',
  },
});

export interface ST_SelectCheckboxProps<TData extends ST_RowData>
  extends CheckboxProps {
  row?: ST_Row<TData>;
  staticRowIndex?: number;
}

export const ST_SelectCheckbox = <TData extends ST_RowData>({
  row,
  staticRowIndex,
  ...rest
}: ST_SelectCheckboxProps<TData>) => {
  // Context for both forms: the select-all checkbox has no instance, and one
  // source keeps a single hook order whether or not `row` is given.
  const table = useSTContext<TData>();
  const {
    options: { enableMultiRowSelection, localization, selectAllMode },
  } = table;
  // table.options holds the part props tree-neutral (ST_NeutralPartPropTypes);
  // the options as written (ST_TableOptions) type them for this tree's Checkbox and RadioGroupItem.
  const {
    stSelectAllCheckboxProps,
    stSelectCheckboxProps,
  }: Pick<
    ST_TableOptions<TData>,
    'stSelectAllCheckboxProps' | 'stSelectCheckboxProps'
  > = table.options;

  const selectAll = !row;

  const getAllRowsSelected = () =>
    selectAllMode === 'page'
      ? table.getIsAllPageRowsSelected()
      : table.getIsAllRowsSelected();

  const getIsChecked = () =>
    selectAll ? getAllRowsSelected() : getIsRowSelected({ row, table });

  const checkboxProps = {
    ...(selectAll
      ? parseFromValuesOrFunc(stSelectAllCheckboxProps, { table })
      : parseFromValuesOrFunc(stSelectCheckboxProps, {
          row,
          staticRowIndex,
          table,
        })),
    ...rest,
  };

  const onSelectionChange = row
    ? getST_RowSelectionHandler({
        row,
        staticRowIndex,
        table,
      })
    : undefined;

  const onSelectAllChange = getST_SelectAllHandler({ table });

  const getCommonProps = ({
    density,
    isChecked,
    isLoading,
  }: Pick<ST_TableState<TData>, 'density' | 'isLoading'> & {
    isChecked: boolean | undefined;
  }) =>
    ({
      'aria-label': selectAll
        ? localization.toggleSelectAll
        : localization.toggleSelectRow,
      isSelected: isChecked,
      isDisabled:
        isLoading ||
        (row && !row.getCanSelect()) ||
        row?.id === 'st-row-create',
      // React Aria change callbacks carry no DOM event (shiftKey), so selection
      // runs in onClick.
      ...checkboxProps,
      onClick: (e: MouseEvent<FocusableElement>) => {
        e.stopPropagation();
        // A checked radio stays checked on click, as a native radio does.
        if (!(enableMultiRowSelection === false && getIsChecked())) {
          // The handlers read only target, shiftKey and nativeEvent.
          if (selectAll) onSelectAllChange(e as MouseEvent<HTMLButtonElement>);
          else onSelectionChange!(e as MouseEvent<HTMLTableRowElement>);
        }
        checkboxProps?.onClick?.(e);
      },
      className: cn(
        selectCheckboxVariants({ density }),
        checkboxProps?.className,
      ),
    }) satisfies CheckboxProps | RadioProps;

  return (
    <Subscribe
      selector={(state) => ({
        density: state.density,
        isLoading: state.isLoading,
        // A row checkbox follows its own row only; the select-all checkbox
        // follows the selection and every slice of the row models it counts.
        ...(selectAll
          ? {
              columnFilterFns: state.columnFilterFns,
              columnFilters: state.columnFilters,
              expanded: state.expanded,
              globalFilter: state.globalFilter,
              globalFilterFn: state.globalFilterFn,
              grouping: state.grouping,
              pagination: state.pagination,
              rowSelection: state.rowSelection,
              sorting: state.sorting,
            }
          : {
              isAllSubRowsSelected: row.getIsAllSubRowsSelected(),
              isRowSelected: getIsRowSelected({ row, table }),
              isSomeSelected: row.getIsSomeSelected(),
            }),
      })}
      source={table.store}
    >
      {({ density, isLoading }) => {
        const allRowsSelected = selectAll ? getAllRowsSelected() : undefined;
        const isChecked = getIsChecked();
        const commonProps = getCommonProps({ density, isChecked, isLoading });
        return (
          <ST_Tooltip
            title={
              selectAll
                ? localization.toggleSelectAll
                : localization.toggleSelectRow
            }
          >
            <span className="inline-flex">
              {enableMultiRowSelection === false ? (
                // RadioGroupItem needs a RadioGroup: one group per row.
                <RadioGroup
                  aria-label={commonProps['aria-label']}
                  value={isChecked ? 'on' : null}
                >
                  <RadioGroupItem {...(commonProps as RadioProps)} value="on" />
                </RadioGroup>
              ) : (
                <ST_Checkbox
                  {...commonProps}
                  // React Aria keeps `isIndeterminate` as its own flag beside
                  // `isSelected`, so it goes after the spread.
                  // getIsSomeRowsSelected and getIsSomeSelected include the
                  // all-selected case, so that case is gated out.
                  isIndeterminate={
                    !isChecked && selectAll
                      ? table.getIsSomeRowsSelected() && !allRowsSelected
                      : row?.getIsSomeSelected() &&
                        !row.getIsAllSubRowsSelected() &&
                        row.getCanSelectSubRows()
                  }
                />
              )}
            </span>
          </ST_Tooltip>
        );
      }}
    </Subscribe>
  );
};
