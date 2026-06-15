import {
  type CSSProperties,
  type DragEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  isCellEditable,
  cellKeyboardShortcuts,
  mergeSRT_HtmlProps,
  openEditingCell,
  parseFromValuesOrFunc,
  parseSRT_HtmlProps,
  type SRT_Cell,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SRT_TableBodyCellValue } from './SRT_TableBodyCellValue';
import { SRT_TableBodyRowGrabHandle } from './SRT_TableBodyRowGrabHandle';
import { SRT_TableBodyRowPinButton } from './SRT_TableBodyRowPinButton';
import { SRT_CopyButton } from '../buttons/SRT_CopyButton';
import { SRT_ExpandButton } from '../buttons/SRT_ExpandButton';
import { SRT_ToggleRowActionMenuButton } from '../buttons/SRT_ToggleRowActionMenuButton';
import { SRT_SelectCheckbox } from '../inputs/SRT_SelectCheckbox';
import { SRT_EditCellTextField } from '../inputs/SRT_EditCellTextField';
import { SRT_CellActionMenu } from '../menus/SRT_CellActionMenu';

export interface SRT_TableBodyCellProps<TData extends SRT_RowData> {
  cell: SRT_Cell<TData>;
  numRows?: number;
  rowRef: RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex: number;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Table body cell - renders a single data cell.
 *
 * Ports material-react-table's MRT_TableBodyCell:
 * - Density-based padding (display columns padded tighter)
 * - Skeleton loading state with randomized width
 * - Placeholder cells (columnDef.PlaceholderCell)
 * - Display-column custom Cell rendering
 * - Inline editing dispatch (table / row / cell edit modes + creating row)
 * - Click-to-copy wrapping via SRT_CopyButton
 * - Click-to-edit (double click opens cell editor)
 * - Right-click cell action menu (enableCellActions)
 * - Keyboard shortcuts
 * - Column ordering drag enter/over hover tracking
 * - Column pinning offsets (sticky) + data-pinned / data-index attributes
 * - Grouped cell subrow count suffix
 *
 * MUI's `sx`-driven dragging/resize border styling is conveyed via data
 * attributes (data-pinned / data-index) plus cva + Tailwind classes rather
 * than runtime theme color math.
 */

const cellVariants = cva(
  'overflow-hidden align-middle [&:has([role=checkbox])]:pr-0',
  {
    variants: {
      density: {
        compact: '',
        comfortable: '',
        spacious: '',
      },
      columnDefType: {
        data: '',
        display: '',
        group: '',
      },
    },
    compoundVariants: [
      { density: 'compact', columnDefType: 'display', class: 'px-2 py-0' },
      { density: 'compact', columnDefType: 'data', class: 'p-2' },
      { density: 'compact', columnDefType: 'group', class: 'p-2' },
      { density: 'comfortable', columnDefType: 'display', class: 'px-3 py-2' },
      { density: 'comfortable', columnDefType: 'data', class: 'p-4' },
      { density: 'comfortable', columnDefType: 'group', class: 'p-4' },
      { density: 'spacious', columnDefType: 'display', class: 'px-5 py-4' },
      { density: 'spacious', columnDefType: 'data', class: 'p-6' },
      { density: 'spacious', columnDefType: 'group', class: 'p-6' },
    ],
    defaultVariants: {
      density: 'comfortable',
      columnDefType: 'data',
    },
  },
);

export const SRT_TableBodyCell = <TData extends SRT_RowData>({
  cell,
  numRows,
  rowRef,
  staticColumnIndex,
  staticRowIndex,
  table,
  className,
}: SRT_TableBodyCellProps<TData>) => {
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableCellActions,
      enableClickToCopy,
      enableColumnOrdering,
      enableColumnPinning,
      enableGrouping,
      enableKeyboardShortcuts,
      groupedColumnMode,
      renderRowActions,
      rowNumberDisplayMode,
      srtTableBodyCellProps,
    },
    setHoveredColumn,
  } = table;
  const {
    actionCell,
    creatingRow,
    density,
    draggingColumn,
    editingCell,
    editingRow,
    hoveredColumn,
    isLoading,
    pagination,
    showSkeletons,
  } = getState();
  const { column, row } = cell;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  // Local anchor for the right-click cell action menu (popover-driven, the
  // shadcn equivalent of MRT's global actionCell + Menu portal).
  const [actionAnchorEl, setActionAnchorEl] = useState<HTMLElement | null>(
    null,
  );

  const [skeletonWidth, setSkeletonWidth] = useState(100);
  useEffect(() => {
    if ((!isLoading && !showSkeletons) || skeletonWidth !== 100) return;
    const size = column.getSize();
    setSkeletonWidth(
      columnDefType === 'display'
        ? size / 2
        : Math.round(Math.random() * (size - size / 3) + size / 3),
    );
  }, [isLoading, showSkeletons]);

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned();

  const isEditable = isCellEditable({ cell, table });

  const isEditing =
    isEditable &&
    !['custom', 'modal'].includes(editDisplayMode as string) &&
    (editDisplayMode === 'table' ||
      editingRow?.id === row.id ||
      editingCell?.id === cell.id) &&
    !row.getIsGrouped();

  const isCreating =
    isEditable && createDisplayMode === 'row' && creatingRow?.id === row.id;

  const showClickToCopyButton =
    (parseFromValuesOrFunc(enableClickToCopy, cell) === true ||
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) === true) &&
    !['context-menu', false].includes(
      // @ts-expect-error allow string/false union narrowing like MRT
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell),
    );

  const isRightClickable = parseFromValuesOrFunc(enableCellActions, cell);

  const cellValueProps = {
    cell,
    table,
    staticColumnIndex,
    staticRowIndex,
  };

  const isLastRow = numRows !== undefined && staticRowIndex === numRows - 1;

  /**
   * Render the contents of a display column's body cell.
   *
   * Core display column defs (getSRT_Row*ColumnDef) are intentionally headless
   * — they carry no `Cell` — so the component layer dispatches on `column.id`
   * here, mirroring the MRT getMRT_Row*ColumnDef `Cell` logic exactly. Any
   * other / user-defined display column falls back to `columnDef.Cell`.
   */
  const renderDisplayColumnCell = (): ReactNode => {
    switch (column.id) {
      case 'mrt-row-select':
        return (
          <SRT_SelectCheckbox
            row={row}
            staticRowIndex={staticRowIndex}
            table={table}
          />
        );
      case 'mrt-row-expand': {
        const expandButton = (
          <SRT_ExpandButton
            row={row}
            staticRowIndex={staticRowIndex}
            table={table}
          />
        );
        const subRowsLength = row.subRows?.length;
        if (groupedColumnMode === 'remove' && row.groupingColumnId) {
          return (
            <div className="flex flex-row items-center gap-1">
              {expandButton}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{row.groupingValue as ReactNode}</span>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {
                    table.getColumn(row.groupingColumnId).columnDef
                      .header as ReactNode
                  }
                </TooltipContent>
              </Tooltip>
              {!!subRowsLength && <span>({subRowsLength})</span>}
            </div>
          );
        }
        return (
          <>
            {expandButton}
            {columnDef.GroupedCell?.({ cell, column, row, table })}
          </>
        );
      }
      case 'mrt-row-numbers':
        return (
          ((rowNumberDisplayMode === 'static'
            ? (staticRowIndex || 0) +
              (pagination?.pageSize || 0) * (pagination?.pageIndex || 0)
            : row.index) ?? 0) + 1
        );
      case 'mrt-row-actions':
        return (
          renderRowActions?.({ cell, row, staticRowIndex, table }) ?? (
            <SRT_ToggleRowActionMenuButton
              cell={cell}
              row={row}
              staticRowIndex={staticRowIndex}
              table={table}
            />
          )
        );
      case 'mrt-row-drag':
        return (
          <SRT_TableBodyRowGrabHandle row={row} rowRef={rowRef} table={table} />
        );
      case 'mrt-row-pin':
        return <SRT_TableBodyRowPinButton row={row} table={table} />;
      default:
        return (
          (columnDef.Cell?.({
            cell,
            column,
            renderedCellValue: cell.renderValue() as any,
            row,
            rowRef,
            staticColumnIndex,
            staticRowIndex,
            table,
          }) as ReactNode) ?? null
        );
    }
  };

  const pinnedStyles = useMemo<CSSProperties | undefined>(() => {
    if (!isColumnPinned) return undefined;
    return {
      position: 'sticky',
      left:
        isColumnPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right:
        isColumnPinned === 'right'
          ? `${column.getAfter('right')}px`
          : undefined,
      zIndex: 1,
      opacity: 0.97,
    };
  }, [isColumnPinned, column]);

  const handleDoubleClick = (_event: MouseEvent<HTMLTableCellElement>) => {
    openEditingCell({ cell, table });
  };

  const handleDragEnter = (_e: DragEvent<HTMLTableCellElement>) => {
    if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
      setHoveredColumn(null);
    }
    if (enableColumnOrdering && draggingColumn) {
      setHoveredColumn(
        columnDef.enableColumnOrdering !== false ? column : null,
      );
    }
  };

  const handleDragOver = (e: DragEvent) => {
    if (columnDef.enableColumnOrdering !== false) {
      e.preventDefault();
    }
  };

  const handleContextMenu = (e: MouseEvent<HTMLTableCellElement>) => {
    if (isRightClickable) {
      e.preventDefault();
      table.setActionCell(cell);
      table.refs.actionCellRef.current = e.currentTarget;
      setActionAnchorEl(e.currentTarget);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
    cellKeyboardShortcuts({
      cell,
      cellValue: cell.getValue<string>(),
      event,
      table,
    });
  };

  // Resolve the table-level + columnDef-level slot props (columnDef wins on
  // conflicts; className composed, style merged, handlers composed), then layer
  // them over the component's own cell DOM attrs (library handlers fire first,
  // user handlers second). Final tailwind className dedup happens via cn() below.
  const htmlPropsContext = { cell, column, row, table };
  const userCellProps = mergeSRT_HtmlProps(
    parseSRT_HtmlProps(srtTableBodyCellProps, htmlPropsContext),
    parseSRT_HtmlProps(columnDef.srtTableBodyCellProps, htmlPropsContext),
  );
  const cellProps = mergeSRT_HtmlProps(
    {
      onKeyDown: handleKeyDown,
      onContextMenu: handleContextMenu,
      onDoubleClick: handleDoubleClick,
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      style: {
        whiteSpace:
          row.getIsPinned() || density === 'compact' ? 'nowrap' : 'normal',
        textOverflow: columnDefType !== 'display' ? 'ellipsis' : undefined,
        cursor: isRightClickable
          ? 'context-menu'
          : isEditable && editDisplayMode === 'cell'
            ? 'pointer'
            : 'inherit',
        ...pinnedStyles,
      } as CSSProperties,
    },
    userCellProps,
  );

  return (
    <td
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      data-last-row={isLastRow || undefined}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      {...cellProps}
      className={cn(
        cellVariants({ density, columnDefType: columnDefType ?? 'data' }),
        (actionCell?.id === cell.id ||
          (editDisplayMode === 'cell' && isEditable) ||
          (editDisplayMode === 'table' && (isCreating || isEditing))) &&
          'hover:outline hover:outline-1 hover:-outline-offset-1 hover:outline-muted-foreground/50',
        actionCell?.id === cell.id &&
          'outline outline-1 -outline-offset-1 outline-muted-foreground/50',
        isColumnPinned && 'bg-background',
        className,
        cellProps?.className,
      )}
    >
      {cell.getIsPlaceholder() ? (
        (columnDef.PlaceholderCell?.({ cell, column, row, table }) ?? null)
      ) : showSkeletons !== false && (isLoading || showSkeletons) ? (
        <span
          className="inline-block h-5 animate-pulse rounded bg-muted"
          style={{ width: skeletonWidth }}
        />
      ) : columnDefType === 'display' &&
        (['mrt-row-expand', 'mrt-row-numbers', 'mrt-row-select'].includes(
          column.id,
        ) ||
          !row.getIsGrouped()) ? (
        renderDisplayColumnCell()
      ) : isCreating || isEditing ? (
        <SRT_EditCellTextField cell={cell} table={table} />
      ) : showClickToCopyButton && columnDef.enableClickToCopy !== false ? (
        <SRT_CopyButton cell={cell} table={table}>
          <SRT_TableBodyCellValue {...cellValueProps} />
        </SRT_CopyButton>
      ) : (
        <SRT_TableBodyCellValue {...cellValueProps} />
      )}
      {cell.getIsGrouped() && !columnDef.GroupedCell && (
        <> ({row.subRows?.length})</>
      )}
      {isRightClickable && (
        <SRT_CellActionMenu
          anchorEl={actionAnchorEl}
          cell={cell}
          setAnchorEl={(el) => {
            setActionAnchorEl(el);
            if (!el) table.setActionCell(null);
          }}
          table={table}
        />
      )}
    </td>
  );
};

export const Memo_SRT_TableBodyCell = memo(
  SRT_TableBodyCell,
  (prev, next) => next.cell === prev.cell,
) as typeof SRT_TableBodyCell;
