import { useEffect, useState } from 'react';
import { useSelector } from '@tanstack/react-store';
import { Button } from '@/components/ui-radix/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui-radix/popover';
import {
  type ST_Column,
  type ST_ColumnFiltersState,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-radix/shadcn-table/types';
import {
  describeFilterMode,
  getColumnLabel,
  isEmptyFilterMode,
  resetFilterMode,
  summarizeFilterValue,
} from '@/components/ui-radix/shadcn-table/shared/utils/filterSummary.utils';
import { ST_Tooltip } from '@/components/ui-radix/shadcn-table/components/buttons/ST_Tooltip';
import {
  ST_ColumnIcon,
  ST_ColumnPicker,
} from '@/components/ui-radix/shadcn-table/components/toolbar/ST_ColumnPicker';
import { ST_FilterEditor } from '@/components/ui-radix/shadcn-table/components/toolbar/ST_FilterEditor';
import {
  closeFilterEditor,
  filterEditorClassName,
  focusFilterInput,
} from '@/components/ui-radix/shadcn-table/components/toolbar/ST_HeaderFilterEditor';
import { flashST_Highlight } from '@/components/ui-radix/shadcn-table/hooks/useST_ColumnFlip';
import { useST_PopupResize } from '@/components/ui-radix/shadcn-table/hooks/useST_PopupResize';

const pickerClassName =
  'max-h-[min(24rem,var(--radix-popover-content-available-height))] w-65 gap-0 overflow-hidden p-0';

/**
 * The columns that show a chip: the slice's ids in the order added, then any
 * column with a filter value the slice does not list yet.
 */
export const getFilterChipIds = (
  columnIds: readonly string[],
  columnFilters: ST_ColumnFiltersState,
): string[] => [
  ...columnIds,
  ...columnFilters
    .map((filter) => filter.id)
    .filter((id) => !columnIds.includes(id)),
];

const useFilterChipColumns = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
) => {
  const filterChips = useSelector(table.atoms.filterChips);
  const columnFilters = useSelector(table.atoms.columnFilters);
  useSelector(table.atoms.columnFilterFns);
  const chipIds = getFilterChipIds(filterChips.columnIds, columnFilters);
  const leafColumns = table.getAllLeafColumns();
  const chips = chipIds.flatMap(
    (id) => leafColumns.find((column) => column.id === id) ?? [],
  );
  return { chipIds, chips, columnFilters, filterChips, leafColumns };
};

const ST_FilterChip = <TData extends ST_RowData>({
  column,
  open,
  table,
}: {
  column: ST_Column<TData>;
  open: boolean;
  table: ST_TableInstance<TData>;
}) => {
  const {
    icons: { ExpandMoreIcon },
  } = table.options;
  const mode = describeFilterMode(column);
  const emptyMode = !!mode && isEmptyFilterMode(column);
  const summary = summarizeFilterValue(column);

  return (
    <Popover
      onOpenChange={(next) =>
        table.setFilterChips((old) => ({
          ...old,
          openAnchor: next ? 'chip' : null,
          openColumnId: next ? column.id : null,
        }))
      }
      open={open}
    >
      <PopoverTrigger asChild>
        <Button
          data-filter-chip={column.id}
          size="sm"
          type="button"
          variant="secondary"
        >
          <ST_ColumnIcon className="text-current" column={column} />
          <span className="max-w-45 truncate">
            {getColumnLabel(column)}
            {mode && (emptyMode || summary) && (
              <span className="font-normal"> {mode}</span>
            )}
            {summary && <span className="font-normal">: {summary}</span>}
          </span>
          <ExpandMoreIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={filterEditorClassName}
        onOpenAutoFocus={(event) => {
          if (focusFilterInput(table, column.id)) event.preventDefault();
        }}
        sideOffset={8}
      >
        <ST_FilterEditor
          column={column}
          onRemoved={() => closeFilterEditor(table)}
          table={table}
        />
      </PopoverContent>
    </Popover>
  );
};

/**
 * The "Filter by..." column list behind "+ Filter" and the toolbar filter
 * button. Picking a column adds its chip and swaps the popover to the
 * column's value editor in place.
 */
const ST_FilterPickerPopover = <TData extends ST_RowData>({
  table,
  variant,
}: {
  table: ST_TableInstance<TData>;
  variant: 'icon' | 'pill';
}) => {
  const {
    icons: { AddIcon, DeleteIcon, FilterListIcon },
    localization,
  } = table.options;
  const { chipIds, chips, leafColumns } = useFilterChipColumns(table);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const popupRef = useST_PopupResize(editingId ?? '');
  const editingColumn = editingId
    ? leafColumns.find((column) => column.id === editingId)
    : undefined;
  const columns = leafColumns.filter(
    (column) => column.getCanFilter() && !chipIds.includes(column.id),
  );

  useEffect(() => {
    if (editingId) focusFilterInput(table, editingId);
  }, [editingId, table]);

  const handleOpenChange = (next: boolean) => {
    // Reset on open, not on close, so the editor does not swap back to the
    // list while the popover fades out.
    if (next) setEditingId(null);
    setOpen(next);
    if (!next && table.atoms.filterChips.get().openAnchor === 'toolbar') {
      closeFilterEditor(table);
    }
  };

  const trigger =
    variant === 'pill' ? (
      <PopoverTrigger asChild>
        <Button size="sm" type="button" variant="ghost">
          <AddIcon />
          {localization.addFilter}
        </Button>
      </PopoverTrigger>
    ) : (
      <ST_Tooltip title={localization.filter}>
        <PopoverTrigger asChild>
          <Button
            aria-label={localization.filter}
            size="icon"
            type="button"
            variant={chips.length > 0 ? 'secondary' : 'ghost'}
          >
            <FilterListIcon />
          </Button>
        </PopoverTrigger>
      </ST_Tooltip>
    );

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      {trigger}
      <PopoverContent
        align={variant === 'icon' ? 'end' : 'start'}
        className={editingColumn ? filterEditorClassName : pickerClassName}
        ref={popupRef}
        sideOffset={8}
      >
        {editingColumn ? (
          <ST_FilterEditor
            column={editingColumn}
            onBack={() => {
              setEditingId(null);
              closeFilterEditor(table);
            }}
            onRemoved={() => handleOpenChange(false)}
            table={table}
          />
        ) : (
          <ST_ColumnPicker
            columns={columns}
            onPick={(column) => {
              table.setFilterChips((old) => ({
                columnIds: old.columnIds.includes(column.id)
                  ? old.columnIds
                  : [...old.columnIds, column.id],
                openAnchor: 'toolbar',
                openColumnId: column.id,
              }));
              setEditingId(column.id);
            }}
            placeholder={localization.filterBy}
            table={table}
            trailing={
              chips.length > 0 && (
                <div className="shrink-0 border-t p-1">
                  <Button
                    className="w-full justify-start"
                    onClick={() => {
                      handleOpenChange(false);
                      clearFilterChips(table);
                    }}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    <DeleteIcon />
                    {localization.deleteAllFilters}
                  </Button>
                </div>
              )
            }
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

/** The toolbar filter button: opens the column picker of the chips mode. */
export const ST_FilterPickerButton = <TData extends ST_RowData>({
  table,
}: {
  table: ST_TableInstance<TData>;
}) => <ST_FilterPickerPopover table={table} variant="icon" />;

/** Clears every column filter value and mode and removes every chip. */
export const clearFilterChips = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
) => {
  const { columnIds } = table.atoms.filterChips.get();
  const ids = getFilterChipIds(columnIds, table.atoms.columnFilters.get());
  table
    .getAllLeafColumns()
    .filter((column) => ids.includes(column.id))
    .forEach((column) => resetFilterMode(column));
  table.resetColumnFilters(true);
  table.setFilterChips({ columnIds: [], openAnchor: null, openColumnId: null });
};

/**
 * The chips mode filter row: one chip per filtered column, "+ Filter" and
 * "Clear filters". A custom `renderTopToolbar` can render it; the editor the
 * column menu opens on a header is `ST_HeaderFilterEditor`.
 */
export const ST_FilterChips = <TData extends ST_RowData>({
  table,
}: {
  table: ST_TableInstance<TData>;
}) => {
  const {
    options: {
      enableSortPopover,
      icons: { CloseIcon },
      localization,
    },
    refs: { topToolbarRef },
  } = table;
  const { chipIds, chips, filterChips } = useFilterChipColumns(table);
  const hasSort = useSelector(
    table.atoms.sorting,
    (sorting) => sorting.length > 0,
  );
  const { openAnchor, openColumnId } = filterChips;

  // A value set from initialState, controlled state or the header joins the
  // slice, so its chip keeps its place once the value is cleared.
  const missingIds = chipIds.filter(
    (id) => !filterChips.columnIds.includes(id),
  );
  const missingKey = missingIds.join('\n');
  useEffect(() => {
    if (!missingKey) return;
    const ids = missingKey.split('\n');
    table.setFilterChips((old) => ({
      ...old,
      columnIds: [
        ...old.columnIds,
        ...ids.filter((id) => !old.columnIds.includes(id)),
      ],
    }));
  }, [missingKey, table]);

  // Every entry point but a chip click flashes the chip it opened.
  useEffect(() => {
    if (!openColumnId || (openAnchor !== 'toolbar' && openAnchor !== 'header'))
      return;
    const chip = topToolbarRef.current?.querySelector<HTMLElement>(
      `[data-filter-chip="${CSS.escape(openColumnId)}"]`,
    );
    if (chip) flashST_Highlight(chip);
  }, [openAnchor, openColumnId, topToolbarRef]);

  return (
    <>
      {chips.map((column) => (
        <ST_FilterChip
          column={column}
          key={column.id}
          open={openAnchor === 'chip' && openColumnId === column.id}
          table={table}
        />
      ))}
      {(chips.length > 0 || (enableSortPopover && hasSort)) && (
        <ST_FilterPickerPopover table={table} variant="pill" />
      )}
      {chips.length > 0 && (
        <Button
          onClick={() => clearFilterChips(table)}
          size="sm"
          type="button"
          variant="ghost"
        >
          <CloseIcon />
          {localization.clearFilters}
        </Button>
      )}
    </>
  );
};
