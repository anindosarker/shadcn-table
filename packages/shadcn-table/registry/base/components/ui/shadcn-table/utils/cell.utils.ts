import {
  type ST_Header,
  type ST_Cell,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import {
  getST_RowSelectionHandler,
  getST_SelectAllHandler,
} from '@/components/ui/shadcn-table/utils/row.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';

const isWinCtrlMacMeta = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
  return (
    (event.ctrlKey && navigator.platform.toLowerCase().includes('win')) ||
    (event.metaKey && navigator.platform.toLowerCase().includes('mac'))
  );
};

export const isCellEditable = <TData extends ST_RowData>({
  cell,
  table,
}: {
  cell: ST_Cell<TData>;
  table: ST_TableInstance<TData>;
}) => {
  const { enableEditing } = table.options;
  const {
    column: { columnDef },
    row,
  } = cell;
  return (
    !cell.getIsPlaceholder() &&
    parseFromValuesOrFunc(enableEditing, row) &&
    parseFromValuesOrFunc(columnDef.enableEditing, row) !== false
  );
};

export const openEditingCell = <TData extends ST_RowData>({
  cell,
  table,
}: {
  cell: ST_Cell<TData>;
  table: ST_TableInstance<TData>;
}) => {
  const {
    options: { editDisplayMode },
    refs: { editInputRefs },
  } = table;
  const { column } = cell;

  if (isCellEditable({ cell, table }) && editDisplayMode === 'cell') {
    table.setEditingCell(cell);
    queueMicrotask(() => {
      const textField = editInputRefs.current?.[column.id];
      if (textField) {
        textField.focus();
        textField.select?.();
      }
    });
  }
};

export const cellKeyboardShortcuts = <TData extends ST_RowData = ST_RowData>({
  cell,
  cellElements,
  cellValue,
  containerElement,
  event,
  header,
  parentElement,
  table,
}: {
  cell?: ST_Cell<TData>;
  header?: ST_Header<TData>;
  cellElements?: Array<HTMLTableCellElement>;
  cellValue?: string;
  containerElement?: HTMLTableElement;
  event: React.KeyboardEvent<HTMLTableCellElement>;
  parentElement?: HTMLTableRowElement;
  table: ST_TableInstance<TData>;
}) => {
  if (!table.options.enableKeyboardShortcuts) return;
  if (event.isPropagationStopped()) return;
  const currentCell = event.currentTarget;

  if (cellValue && isWinCtrlMacMeta(event) && event.key === 'c') {
    navigator.clipboard.writeText(cellValue);
  } else if (['Enter', ' '].includes(event.key)) {
    if (cell?.column?.id === 'st-row-select') {
      event.preventDefault();
      getST_RowSelectionHandler({
        row: cell.row,
        table,
        // @ts-expect-error event.target is typed EventTarget, not Element
        staticRowIndex: +event.target.getAttribute('data-index'),
      })(event as any);
    } else if (
      header?.column?.id === 'st-row-select' &&
      table.options.enableSelectAll
    ) {
      event.preventDefault();
      getST_SelectAllHandler({
        table,
      })(event as any);
    } else if (
      cell?.column?.id === 'st-row-expand' &&
      (cell.row.getCanExpand() ||
        table.options.renderDetailPanel?.({ row: cell.row, table }))
    ) {
      event.preventDefault();
      cell.row.toggleExpanded();
    } else if (
      header?.column?.id === 'st-row-expand' &&
      table.options.enableExpandAll
    ) {
      event.preventDefault();
      table.toggleAllRowsExpanded();
    } else if (cell?.column.id === 'st-row-pin') {
      event.preventDefault();
      cell.row.getIsPinned()
        ? cell.row.pin(false)
        : cell.row.pin(
            table.options.rowPinningDisplayMode?.includes('bottom')
              ? 'bottom'
              : 'top',
          );
    } else if (header && isWinCtrlMacMeta(event)) {
      const actionsButton = currentCell.querySelector(
        `button[aria-label="${table.options.localization.columnActions}"]`,
      );
      if (actionsButton) {
        (actionsButton as HTMLButtonElement).click();
      }
    } else if (header?.column?.getCanSort()) {
      event.preventDefault();
      header.column.toggleSorting();
    }
  } else if (
    [
      'ArrowRight',
      'ArrowLeft',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'PageUp',
      'PageDown',
    ].includes(event.key)
  ) {
    event.preventDefault();

    const currentRow = parentElement || currentCell.closest('tr');
    const tableElement = containerElement || currentCell.closest('table');
    const allCells =
      cellElements ||
      Array.from(tableElement?.querySelectorAll('th, td') || []);
    const currentCellIndex = allCells.indexOf(currentCell);

    const currentIndex = parseInt(
      currentCell.getAttribute('data-index') || '0',
    );
    let nextCell: HTMLElement | undefined = undefined;

    //home/end first or last cell in row
    const findEdgeCell = (rowIndex: 'c' | 'f' | 'l', edge: 'f' | 'l') => {
      const row =
        rowIndex === 'c'
          ? currentRow
          : rowIndex === 'f'
            ? tableElement?.querySelector('tr')
            : tableElement?.lastElementChild?.lastElementChild;
      const rowCells = Array.from(row?.children || []);
      const targetCell =
        edge === 'f' ? rowCells[0] : rowCells[rowCells.length - 1];
      return targetCell as HTMLElement;
    };

    //page up/down first or last cell in column
    const findBottomTopCell = (columnIndex: number, edge: 'b' | 't') => {
      const row =
        edge === 't'
          ? tableElement?.querySelector('tr')
          : tableElement?.lastElementChild?.lastElementChild;
      const rowCells = Array.from(row?.children || []);
      const targetCell = rowCells[columnIndex];
      return targetCell as HTMLElement;
    };

    const findAdjacentCell = (
      columnIndex: number,
      searchDirection: 'f' | 'b',
    ) => {
      const searchArray =
        searchDirection === 'f'
          ? allCells.slice(currentCellIndex + 1)
          : allCells.slice(0, currentCellIndex).reverse();
      return searchArray.find((cell) =>
        cell.matches(`[data-index="${columnIndex}"]`),
      ) as HTMLElement | undefined;
    };

    switch (event.key) {
      case 'ArrowRight':
        nextCell = findAdjacentCell(currentIndex + 1, 'f');
        break;
      case 'ArrowLeft':
        nextCell = findAdjacentCell(currentIndex - 1, 'b');
        break;
      case 'ArrowUp':
        nextCell = findAdjacentCell(currentIndex, 'b');
        break;
      case 'ArrowDown':
        nextCell = findAdjacentCell(currentIndex, 'f');
        break;
      case 'Home':
        nextCell = findEdgeCell(isWinCtrlMacMeta(event) ? 'f' : 'c', 'f');
        break;
      case 'End':
        nextCell = findEdgeCell(isWinCtrlMacMeta(event) ? 'l' : 'c', 'l');
        break;
      case 'PageUp':
        nextCell = findBottomTopCell(currentIndex, 't');
        break;
      case 'PageDown':
        nextCell = findBottomTopCell(currentIndex, 'b');
        break;
    }

    if (nextCell) {
      nextCell.focus();
    }
  }
};
