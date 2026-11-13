import { useSelector } from '@tanstack/react-store';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import {
  type ST_Column,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { getColumnFilterFnName } from '@/components/ui/shadcn-table/shared/utils/column.utils';
import { ST_COLUMN_ACTIONS_ATTR } from '@/components/ui/shadcn-table/shared/utils/drag.utils';
import { ST_FilterEditor } from '@/components/ui/shadcn-table/components/toolbar/ST_FilterEditor';
import { useST_MenuAnchor } from '@/components/ui/shadcn-table/hooks/useST_MenuAnchor';

/**
 * The chips mode value editor's width: 260 px, or 308 px for a range of two
 * date, datetime or time fields, which keep a 140 px minimum each (126 px of
 * native placeholder), so both fit beside the 8 px gap and the 10 px padding.
 */
export const filterEditorClassName = <TData extends ST_RowData>(
  column: ST_Column<TData>,
) => {
  const { columnDef } = column;
  const { filterVariant } = columnDef;
  const isDateLike = !!(
    filterVariant?.startsWith('date') || filterVariant?.startsWith('time')
  );
  const isRange =
    !!filterVariant?.includes('range') ||
    ['between', 'betweenInclusive', 'inNumberRange'].includes(
      getColumnFilterFnName(columnDef),
    );
  return isDateLike && isRange ? 'w-77 max-w-[calc(100vw-1rem)]' : 'w-65';
};

/** Focuses the column's first filter input; false when it is not mounted. */
export const focusFilterInput = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
  columnId: string,
) => {
  const input = table.refs.filterInputRefs.current?.[`${columnId}-0`];
  if (!input) return false;
  input.focus();
  return true;
};

/** Closes the open chips mode editor, wherever it was opened. */
export const closeFilterEditor = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
) =>
  table.setFilterChips((old) => ({
    ...old,
    openAnchor: null,
    openColumnId: null,
  }));

/**
 * The chips mode value editor the column menu opens, anchored to the column's
 * header cell; closing it returns focus to the header's menu button. The
 * table layout mounts it beside the top toolbar, so it works with a custom
 * `renderTopToolbar` too.
 */
export const ST_HeaderFilterEditor = <TData extends ST_RowData>({
  table,
}: {
  table: ST_TableInstance<TData>;
}) => {
  const { openAnchor, openColumnId } = useSelector(table.atoms.filterChips);
  // A mode change to or from a between mode changes the editor's width.
  useSelector(table.atoms.columnFilterFns);
  const column =
    table.options.columnFilterDisplayMode === 'chips' &&
    openAnchor === 'header' &&
    openColumnId
      ? table.getAllLeafColumns().find((leaf) => leaf.id === openColumnId)
      : undefined;
  const cell = column
    ? (table.refs.tableHeadCellRefs.current?.[column.id] ?? null)
    : null;
  const { spanProps } = useST_MenuAnchor({
    anchorEl: cell,
    setAnchorEl: () => closeFilterEditor(table),
  });
  const open = !!column && !!cell;

  return (
    <Popover
      onOpenChange={(next) => {
        if (!next) closeFilterEditor(table);
      }}
      open={open}
    >
      <PopoverAnchor asChild>
        <span {...spanProps} />
      </PopoverAnchor>
      {column && (
        <PopoverContent
          align="start"
          className={filterEditorClassName(column)}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            cell
              ?.querySelector<HTMLElement>(`[${ST_COLUMN_ACTIONS_ATTR}]`)
              ?.focus();
          }}
          // The closing column menu hands focus back to the header first.
          onFocusOutside={(event) => event.preventDefault()}
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
      )}
    </Popover>
  );
};
