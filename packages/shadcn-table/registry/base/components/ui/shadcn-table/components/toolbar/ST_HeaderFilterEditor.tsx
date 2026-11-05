import { type KeyboardEvent } from 'react';
import { useSelector } from '@tanstack/react-store';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_COLUMN_ACTIONS_ATTR } from '@/components/ui/shadcn-table/shared/utils/drag.utils';
import { ST_FilterEditor } from '@/components/ui/shadcn-table/components/toolbar/ST_FilterEditor';
import { useST_MenuAnchor } from '@/components/ui/shadcn-table/hooks/useST_MenuAnchor';

export const filterEditorClassName = 'w-65';

/** The column's first filter input, or null when it is not mounted. */
export const getFilterInput = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
  columnId: string,
) => table.refs.filterInputRefs.current?.[`${columnId}-0`] ?? null;

export const focusFilterInput = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
  columnId: string,
) => getFilterInput(table, columnId)?.focus();

/**
 * The filter inputs stop Escape from bubbling to the popover's dismiss
 * handler, so an Escape in an input closes the editor in the capture phase.
 */
export const closeOnEscape =
  (close: () => void) => (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && event.target instanceof HTMLInputElement) {
      close();
    }
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
      <PopoverTrigger nativeButton={false} render={<span {...spanProps} />} />
      {column && (
        <PopoverContent
          align="start"
          className={filterEditorClassName}
          finalFocus={() =>
            cell?.querySelector<HTMLElement>(`[${ST_COLUMN_ACTIONS_ATTR}]`) ??
            true
          }
          initialFocus={() => getFilterInput(table, column.id) ?? true}
          onKeyDownCapture={closeOnEscape(() => closeFilterEditor(table))}
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
