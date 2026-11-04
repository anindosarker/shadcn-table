import { useSelector } from '@tanstack/react-store';
import { Button } from '@/components/ui-aria/button';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui-aria/dropdown-menu';
import {
  type ST_Column,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-aria/shadcn-table/types';
import { getColumnFilterFnName } from '@/components/ui-aria/shadcn-table/shared/utils/column.utils';
import {
  getColumnLabel,
  getFilterModeOptions,
  isEmptyFilterMode,
  resetFilterMode,
  setFilterMode,
} from '@/components/ui-aria/shadcn-table/shared/utils/filterSummary.utils';
import { ST_TableHeadCellFilterContainer } from '@/components/ui-aria/shadcn-table/components/head/ST_TableHeadCellFilterContainer';

export interface ST_FilterEditorProps<TData extends ST_RowData> {
  column: ST_Column<TData>;
  /** Shows a back button to the column list. */
  onBack?: () => void;
  /** Called after "Remove filter" dropped the value and the chip. */
  onRemoved?: () => void;
  table: ST_TableInstance<TData>;
}

/** Clears a column's filter value and mode and removes its chip. */
export const removeFilterChip = <TData extends ST_RowData>(
  column: ST_Column<TData>,
) => {
  column.setFilterValue(undefined);
  resetFilterMode(column);
  column.table.setFilterChips((old) => ({
    columnIds: old.columnIds.filter((id) => id !== column.id),
    openAnchor: old.openColumnId === column.id ? null : old.openAnchor,
    openColumnId: old.openColumnId === column.id ? null : old.openColumnId,
  }));
};

const ST_FilterModeMenu = <TData extends ST_RowData>({
  column,
}: {
  column: ST_Column<TData>;
}) => {
  const {
    icons: { ExpandMoreIcon },
    localization,
  } = column.table.options;
  const options = getFilterModeOptions(column);
  const current = getColumnFilterFnName(column.columnDef);
  const currentLabel = options.find(
    (option) => option.option === current,
  )?.label;

  return (
    <DropdownMenuTrigger>
      <Button
        aria-label={localization.changeFilterMode}
        className="gap-0.5 px-1.5 font-normal"
        size="xs"
        type="button"
        variant="ghost"
      >
        {(currentLabel ?? current).toLowerCase()}
        <ExpandMoreIcon />
      </Button>
      <DropdownMenu className="w-max" placement="bottom start">
        <DropdownMenuGroup
          aria-label={localization.changeFilterMode}
          onSelectionChange={(keys) => {
            const [mode] = keys === 'all' ? [] : [...keys];
            if (typeof mode === 'string') setFilterMode(column, mode);
          }}
          selectedKeys={[current]}
          selectionMode="single"
        >
          {options.map((option) => (
            <DropdownMenuItem
              id={option.option}
              key={option.option}
              textValue={option.label}
            >
              <span className="w-4 text-center text-muted-foreground">
                {option.symbol}
              </span>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
};

/**
 * The value editor every filter entry point shows: the column name with the
 * filter mode picker, the column's filter input and "Remove filter".
 */
export const ST_FilterEditor = <TData extends ST_RowData>({
  column,
  onBack,
  onRemoved,
  table,
}: ST_FilterEditorProps<TData>) => {
  const {
    options: {
      icons: { ChevronLeftIcon, DeleteIcon },
      localization,
    },
  } = table;
  useSelector(table.atoms.columnFilterFns);
  useSelector(table.atoms.columnVisibility);
  const header = table
    .getFlatHeaders()
    .find((candidate) => candidate.column.id === column.id);
  const hasModes = getFilterModeOptions(column).length > 0;

  return (
    <>
      <div className="flex min-h-6 items-center gap-1 px-0.5 text-xs text-muted-foreground">
        {onBack && (
          <Button
            aria-label={localization.backToColumns}
            onClick={onBack}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <ChevronLeftIcon className="rtl:rotate-180" />
          </Button>
        )}
        <span>{getColumnLabel(column)}</span>
        {hasModes && <ST_FilterModeMenu column={column} />}
      </div>
      {hasModes && isEmptyFilterMode(column) ? null : header ? (
        <ST_TableHeadCellFilterContainer header={header} open />
      ) : (
        <p className="px-0.5 text-xs text-muted-foreground">
          {localization.showColumnToEditFilter}
        </p>
      )}
      <Button
        className="justify-start"
        onClick={() => {
          removeFilterChip(column);
          onRemoved?.();
        }}
        size="sm"
        type="button"
        variant="ghost"
      >
        <DeleteIcon />
        {localization.removeFilter}
      </Button>
    </>
  );
};
