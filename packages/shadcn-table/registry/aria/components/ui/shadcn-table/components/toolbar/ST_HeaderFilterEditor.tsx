import { type KeyboardEvent, useCallback, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { useSelector } from '@tanstack/react-store';
import { Popover } from '@/components/ui/popover';
import {
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_COLUMN_ACTIONS_ATTR } from '@/components/ui/shadcn-table/shared/utils/drag.utils';
import { ST_FilterEditor } from '@/components/ui/shadcn-table/components/toolbar/ST_FilterEditor';

export const filterEditorClassName = 'w-65';

export const focusFilterInput = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
  columnId: string,
) => table.refs.filterInputRefs.current?.[`${columnId}-0`]?.focus();

/**
 * A ref callback that focuses the column's filter input once, when the aria
 * Popover, which has no initial-focus option, mounts its content.
 */
export const useFocusFilterInputOnMount = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
  columnId: string | undefined,
) =>
  useCallback(
    (node: HTMLDivElement | null) => {
      if (node && columnId) focusFilterInput(table, columnId);
    },
    [columnId, table],
  );

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
  const cellRef = useMemo(() => ({ current: cell }), [cell]);
  const focusOnMount = useFocusFilterInputOnMount(table, column?.id);
  // The popover's focus scope contains focus while it is mounted, so the
  // editor unmounts first and the chevron takes focus before the scope's
  // restore runs.
  const close = () => {
    flushSync(() => closeFilterEditor(table));
    cell?.querySelector<HTMLElement>(`[${ST_COLUMN_ACTIONS_ATTR}]`)?.focus();
  };

  if (!column || !cell) return null;

  return (
    <Popover
      className={filterEditorClassName}
      isOpen
      offset={8}
      onOpenChange={(next) => {
        if (!next) close();
      }}
      placement="bottom start"
      triggerRef={cellRef}
    >
      <div
        className="contents"
        onKeyDownCapture={closeOnEscape(close)}
        ref={focusOnMount}
      >
        <ST_FilterEditor column={column} onRemoved={close} table={table} />
      </div>
    </Popover>
  );
};
