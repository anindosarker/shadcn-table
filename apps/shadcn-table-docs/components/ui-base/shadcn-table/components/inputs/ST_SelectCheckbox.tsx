import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui-base/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui-base/radio-group';
import {
  type CheckboxProps,
  type RadioProps,
  type ST_Row,
  type ST_RowData,
  type ST_TableOptions,
  type ST_TableState,
} from '@/components/ui-base/shadcn-table/types';
import {
  getIsRowSelected,
  getST_RowSelectionHandler,
  getST_SelectAllHandler,
} from '@/components/ui-base/shadcn-table/shared/utils/row.utils';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui-base/shadcn-table/ST_Tooltip';
import { useSTContext } from '@/components/ui-base/shadcn-table/hooks/stTableHook';

// Base UI's BaseUIEvent<MouseEvent<HTMLSpanElement>>, read off the part instead
// of '@base-ui/react/types': under verbatimModuleSyntax an inline `type`
// import keeps a side-effect import that Vite's dep scanner misses, and the
// late re-optimization reloads Storybook mid-run.
type SelectClickEvent = Parameters<NonNullable<CheckboxProps['onClick']>>[0];

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
      checked: isChecked,
      disabled:
        isLoading ||
        (row && !row.getCanSelect()) ||
        row?.id === 'st-row-create',
      // inputProps: { 'aria-label': ... },
      // Note: Base UI renders a span with role="checkbox" plus a hidden input; `aria-label` above lands on the root span.
      // onChange: (event) => { event.stopPropagation(); selectAll ? onSelectAllChange(event) : onSelectionChange!(event); },
      // Note: Base UI change callbacks carry the DOM event only inside eventDetails; selection runs in onClick below, where shiftKey is read directly.
      // size: (density === 'compact' ? 'small' : 'medium') as 'medium' | 'small',
      // Note: the density variant on className below.
      ...checkboxProps,
      onClick: (e: SelectClickEvent) => {
        e.stopPropagation();
        // Note: MUI Radio fires no change once checked; same guard here.
        if (!(enableMultiRowSelection === false && getIsChecked())) {
          // Base UI roots are spans; the handlers read only target and shiftKey.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const event = e as any;
          if (selectAll) onSelectAllChange(event);
          else onSelectionChange!(event);
        }
        checkboxProps?.onClick?.(e);
      },
      // sx: (theme) => ({ height, m, width, zIndex: 0, ...parseFromValuesOrFunc(checkboxProps?.sx, theme) }),
      // Note: MUI sized the padded hit area; the density variant sizes the visible box.
      className: cn(
        selectCheckboxVariants({ density }),
        checkboxProps?.className,
      ),
      title: undefined,
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
              checkboxProps?.title ??
              (selectAll
                ? localization.toggleSelectAll
                : localization.toggleSelectRow)
            }
          >
            <span className="inline-flex">
              {enableMultiRowSelection === false ? (
                // <Radio {...(commonProps as any)} />
                // Note: shadcn RadioGroupItem needs its RadioGroup; one group per row stands in for MUI's standalone Radio.
                <RadioGroup value={isChecked ? 'on' : null}>
                  <RadioGroupItem
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    {...(commonProps as any)}
                    value="on"
                  />
                </RadioGroup>
              ) : (
                <Checkbox
                  {...commonProps}
                  // Note: Base UI keeps MUI `indeterminate` as its own flag beside `checked`; it lands after the spread.
                  // v9: getIsSomeRowsSelected / getIsSomeSelected mean "at least one"
                  // (the all-selected case included), so the all-selected check gates
                  // the indeterminate state.
                  indeterminate={
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
