import {
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
  useRef,
  useState,
} from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui-radix/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnPinningPosition,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui-radix/shadcn-table/types';
import { getColumnFilterFnName } from '@/components/ui-radix/shadcn-table/shared/utils/column.utils';
import { ST_FilterOptionMenu } from '@/components/ui-radix/shadcn-table/components/menus/ST_FilterOptionMenu';
import { useST_MenuAnchor } from '@/components/ui-radix/shadcn-table/hooks/useST_MenuAnchor';

export interface ST_ColumnActionMenuProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuContent> {
  /** Opens the menu over this element when no `trigger` is given; `null` while closed. */
  readonly anchorEl?: HTMLElement | null;
  readonly header: ST_Header<TData>;
  /** Called when the menu opens or closes from its `trigger`. */
  readonly onOpenChange?: (open: boolean) => void;
  /** Whether the menu is open, with `trigger`; the menu keeps its own state without it. */
  readonly open?: boolean;
  /** Clears the anchor when the anchored menu closes. */
  readonly setAnchorEl?: (anchorEl: HTMLElement | null) => void;
  /** The element that opens the menu; a second press on it closes the menu. */
  readonly trigger?: ReactElement;
}

/**
 * The column menu: only the items that apply right now. Sorting stacks onto
 * the other columns' sorts; the active direction is the one disabled item
 * besides Fixed position on a locked column.
 */
export const ST_ColumnActionMenu = <TData extends ST_RowData>({
  className,
  anchorEl = null,
  header,
  onOpenChange: onTriggerOpenChange,
  open,
  setAnchorEl,
  trigger,
  ...rest
}: ST_ColumnActionMenuProps<TData>) => {
  const table = header.table;
  const {
    options: {
      columnFilterDisplayMode,
      columnFilterModeOptions,
      enableColumnFilterModes,
      enableColumnFilters,
      enableColumnOrdering,
      enableColumnPinning,
      enableColumnResizing,
      enableGrouping,
      enableHiding,
      enableSorting,
      enableSortingRemoval,
      icons: {
        ArrowDownwardIcon,
        ArrowUpwardIcon,
        CloseIcon,
        DynamicFeedIcon,
        FilterListIcon,
        LockIcon,
        PushPinIcon,
        PushPinOffIcon,
        RestartAltIcon,
        VisibilityOffIcon,
      },
      localization,
      renderColumnActionsMenuItems,
    },
    refs: { filterInputRefs },
    setColumnFilterFns,
    setColumnOrder,
    setColumnResizing,
    setFilterChips,
    setShowColumnFilters,
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isTriggerOpen = open ?? uncontrolledOpen;
  const setTriggerOpen = (next: boolean) => {
    setUncontrolledOpen(next);
    onTriggerOpenChange?.(next);
  };

  const {
    focusAnchor,
    onOpenChange: onAnchorOpenChange,
    spanProps,
  } = useST_MenuAnchor({
    anchorEl,
    setAnchorEl: (next) => setAnchorEl?.(next),
  });

  const closeMenu = () => {
    if (trigger) setTriggerOpen(false);
    else setAnchorEl?.(null);
  };

  const handleClearSort = () => {
    column.clearSorting();
    closeMenu();
  };

  const handleSort = (desc: boolean) => {
    column.toggleSorting(desc, true);
    closeMenu();
  };

  const handleResetColumnSize = () => {
    setColumnResizing((old) => ({ ...old, isResizingColumn: false }));
    column.resetSize();
    closeMenu();
  };

  const handleHideColumn = () => {
    column.toggleVisibility(false);
    closeMenu();
  };

  const handlePinColumn = (pinDirection: ST_ColumnPinningPosition) => {
    column.pin(pinDirection);
    closeMenu();
  };

  const handleGroupByColumn = () => {
    column.toggleGrouping();
    setColumnOrder((old) => ['st-row-expand', ...old]);
    closeMenu();
  };

  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;

  const handleClearFilter = () => {
    column.setFilterValue(undefined);
    if (columnFilterDisplayMode === 'chips') {
      setFilterChips((old) => ({
        ...old,
        columnIds: old.columnIds.filter((id) => id !== column.id),
        openAnchor: old.openColumnId === column.id ? null : old.openAnchor,
        openColumnId: old.openColumnId === column.id ? null : old.openColumnId,
      }));
    }
    closeMenu();
    if (['empty', 'notEmpty'].includes(getColumnFilterFnName(columnDef))) {
      setColumnFilterFns((prev) => ({
        ...prev,
        [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
      }));
    }
  };

  // "Filter" hands focus to the column's filter input when the menu closes,
  // instead of back to the opener; in chips mode the editor opens on the
  // header cell instead.
  const focusFilterOnCloseRef = useRef(false);
  // The header chip editor takes focus; the menu leaves it there.
  const keepEditorFocusOnCloseRef = useRef(false);

  const handleFilterByColumn = () => {
    if (columnFilterDisplayMode === 'chips') {
      setFilterChips((old) => ({
        columnIds: old.columnIds.includes(column.id)
          ? old.columnIds
          : [...old.columnIds, column.id],
        openAnchor: 'header',
        openColumnId: column.id,
      }));
      keepEditorFocusOnCloseRef.current = true;
    } else {
      setShowColumnFilters(true);
      focusFilterOnCloseRef.current = true;
    }
    closeMenu();
  };

  const isSelectFilter = !!columnDef.filterSelectOptions;

  const showFilterModeSubMenu =
    columnFilterDisplayMode === 'subheader' &&
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    !isSelectFilter &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length);

  const isLocked =
    enableColumnOrdering === false || columnDef.enableColumnOrdering === false;

  const menuItem = ({
    disabled,
    icon,
    key,
    label,
    onClick,
  }: {
    disabled?: boolean;
    icon: ReactNode;
    key: string;
    label: string;
    onClick?: () => void;
  }) => (
    <DropdownMenuItem disabled={disabled} key={key} onClick={onClick}>
      {icon}
      {label}
    </DropdownMenuItem>
  );

  const items = (
    <table.Subscribe
      selector={(state) => ({
        columnFilters: state.columnFilters,
        columnPinning: state.columnPinning,
        columnSizing: state.columnSizing,
        columnVisibility: state.columnVisibility,
        grouping: state.grouping,
        sorting: state.sorting,
      })}
    >
      {({ columnSizing }) => {
        const columnFilterValue = column.getFilterValue();
        const hasFilterValue = Array.isArray(columnFilterValue)
          ? columnFilterValue.some((value) => value != null && value !== '')
          : columnFilterValue != null && columnFilterValue !== '';
        const sorted = column.getIsSorted();
        const pinned = column.getIsPinned();
        const size = columnSizing[column.id];

        const sortAndFilterItems: ReactNode[] = [];
        if (enableSorting !== false && column.getCanSort()) {
          sortAndFilterItems.push(
            menuItem({
              disabled: sorted === 'asc',
              icon: <ArrowUpwardIcon />,
              key: 'sort-asc',
              label: localization.sortAscending,
              onClick: () => handleSort(false),
            }),
            menuItem({
              disabled: sorted === 'desc',
              icon: <ArrowDownwardIcon />,
              key: 'sort-desc',
              label: localization.sortDescending,
              onClick: () => handleSort(true),
            }),
          );
          if (sorted && enableSortingRemoval !== false) {
            sortAndFilterItems.push(
              menuItem({
                icon: <CloseIcon />,
                key: 'clear-sort',
                label: localization.clearSort,
                onClick: handleClearSort,
              }),
            );
          }
        }
        if (enableColumnFilters !== false && column.getCanFilter()) {
          sortAndFilterItems.push(
            showFilterModeSubMenu ? (
              // The filter modes open as a submenu of this item.
              <DropdownMenuSub key="filter">
                <DropdownMenuSubTrigger>
                  <FilterListIcon />
                  {localization.filter}
                </DropdownMenuSubTrigger>
                <ST_FilterOptionMenu
                  header={header}
                  isSubMenu
                  onSelect={handleFilterByColumn}
                />
              </DropdownMenuSub>
            ) : (
              menuItem({
                icon: <FilterListIcon />,
                key: 'filter',
                label: localization.filter,
                onClick: handleFilterByColumn,
              })
            ),
          );
          if (hasFilterValue) {
            sortAndFilterItems.push(
              menuItem({
                icon: <CloseIcon />,
                key: 'clear-filter',
                label: localization.clearFilter,
                onClick: handleClearFilter,
              }),
            );
          }
        }

        const layoutItems: ReactNode[] = [];
        if (enableColumnPinning && column.getCanPin()) {
          if (pinned !== 'start') {
            layoutItems.push(
              menuItem({
                icon: <PushPinIcon />,
                key: 'pin-start',
                label: localization.pinToStart,
                onClick: () => handlePinColumn('start'),
              }),
            );
          }
          if (pinned !== 'end') {
            layoutItems.push(
              menuItem({
                icon: <PushPinIcon className="rotate-90" />,
                key: 'pin-end',
                label: localization.pinToEnd,
                onClick: () => handlePinColumn('end'),
              }),
            );
          }
          if (pinned) {
            layoutItems.push(
              menuItem({
                icon: <PushPinOffIcon />,
                key: 'unpin',
                label: localization.unpin,
                onClick: () => handlePinColumn(false),
              }),
            );
          }
        }
        if (
          enableColumnResizing &&
          column.getCanResize() &&
          size !== undefined &&
          size !== columnDef.size
        ) {
          layoutItems.push(
            menuItem({
              icon: <RestartAltIcon />,
              key: 'reset-size',
              label: localization.resetColumnSize,
              onClick: handleResetColumnSize,
            }),
          );
        }
        if (enableGrouping && column.getCanGroup()) {
          layoutItems.push(
            menuItem({
              icon: <DynamicFeedIcon />,
              key: 'group',
              label: localization[
                column.getIsGrouped() ? 'ungroupByColumn' : 'groupByColumn'
              ]?.replace('{column}', String(columnDef.header)),
              onClick: handleGroupByColumn,
            }),
          );
        }
        if (isLocked) {
          layoutItems.push(
            menuItem({
              disabled: true,
              icon: <LockIcon />,
              key: 'fixed',
              label: localization.fixedPosition,
            }),
          );
        }

        const hideItems: ReactNode[] =
          enableHiding !== false && column.getCanHide()
            ? [
                menuItem({
                  icon: <VisibilityOffIcon />,
                  key: 'hide',
                  label: localization.hideThisColumn,
                  onClick: handleHideColumn,
                }),
              ]
            : [];

        const internalColumnMenuItems = [
          sortAndFilterItems,
          layoutItems,
          hideItems,
        ]
          .filter((group) => group.length > 0)
          .flatMap((group, index) =>
            index === 0
              ? group
              : [
                  <DropdownMenuSeparator key={`separator-${index}`} />,
                  ...group,
                ],
          );

        return (
          <>
            {columnDef.renderColumnActionsMenuItems?.({
              closeMenu,
              column,
              internalColumnMenuItems,
              table,
            }) ??
              renderColumnActionsMenuItems?.({
                closeMenu,
                column,
                internalColumnMenuItems,
                table,
              }) ??
              internalColumnMenuItems}
          </>
        );
      }}
    </table.Subscribe>
  );

  const focusFilterInput = () => {
    const filterInput = focusFilterOnCloseRef.current
      ? filterInputRefs.current?.[`${column.id}-0`]
      : undefined;
    focusFilterOnCloseRef.current = false;
    filterInput?.focus();
    return !!filterInput;
  };

  if (trigger) {
    return (
      <DropdownMenu open={isTriggerOpen} onOpenChange={setTriggerOpen}>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onCloseAutoFocus={(event) => {
            if (keepEditorFocusOnCloseRef.current) {
              keepEditorFocusOnCloseRef.current = false;
              event.preventDefault();
              return;
            }
            if (focusFilterInput()) event.preventDefault();
          }}
          className={cn('w-44', className)}
          {...rest}
        >
          {items}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={!!anchorEl} onOpenChange={onAnchorOpenChange}>
      <DropdownMenuTrigger asChild>
        <span {...spanProps} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (!focusFilterInput()) focusAnchor();
        }}
        className={cn('w-max', className)}
        {...rest}
      >
        {items}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
