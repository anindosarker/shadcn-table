import {
  type ChangeEvent,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type ComponentType,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import {
  type AccessorFn,
  type AggregationFnDef,
  type AppTableComponent,
  type Cell,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningPosition,
  type ColumnPinningState,
  type ColumnSizingState,
  type ColumnVisibilityState,
  type columnResizingState,
  type DeepKeys,
  type DeepValue,
  type ExpandedState,
  type FilterFn,
  type GroupingState,
  type Header,
  type HeaderGroup,
  type OnChangeFn,
  type PaginationState,
  type ReactTable,
  type Row,
  type RowSelectionState,
  type SortFn,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
} from '@tanstack/react-table';
import {
  type VirtualItem,
  type Virtualizer,
  type VirtualizerOptions,
} from '@tanstack/react-virtual';
import { type ReadonlyAtom } from '@tanstack/react-store';
import { type ST_Checkbox } from '@/components/ui/shadcn-table/components/inputs/ST_Checkbox';
import { type Button } from '@/components/ui/button';
import { type Collapsible } from '@/components/ui/collapsible';
import { type Dialog, type DialogContent } from '@/components/ui/dialog';
import { type RadioGroupItem } from '@/components/ui/radio-group';
import { type Slider } from '@/components/ui/slider';
import { type ST_AggregationFns } from '@/components/ui/shadcn-table/shared/fns/aggregationFns';
import { type ST_FilterFns } from '@/components/ui/shadcn-table/shared/fns/filterFns';
import { type ST_SortFns } from '@/components/ui/shadcn-table/shared/fns/sortFns';
import {
  type ST_ColumnDef_Config,
  type ST_TableOptions_Config,
} from '@/components/ui/shadcn-table/features/stConfigFeature';
import { type ST_Features } from '@/components/ui/shadcn-table/features/stFeatures';

export type DivProps = ComponentPropsWithRef<'div'>;

export type NavProps = ComponentPropsWithRef<'nav'>;

export type ST_PaginationProps = NavProps & {
  boundaryCount?: number;
  disabled?: boolean;
  hideNextButton?: boolean;
  hidePrevButton?: boolean;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  siblingCount?: number;
};

export type TableProps = ComponentPropsWithRef<'table'>;

export type TableHeadProps = ComponentPropsWithRef<'thead'>;

export type TableRowProps = ComponentPropsWithRef<'tr'>;

export type TableBodyProps = ComponentPropsWithRef<'tbody'>;

export type TableFooterProps = ComponentPropsWithRef<'tfoot'>;

export type TableCellProps = ComponentPropsWithRef<'th'> &
  ComponentPropsWithRef<'td'>;

/** Native button props plus the shadcn `Button` part's `size` and `variant`. */
export type ButtonProps = ComponentPropsWithRef<'button'> &
  Pick<ComponentProps<typeof Button>, 'size' | 'variant'>;

export type InputProps = ComponentPropsWithRef<'input'>;

export type SelectProps = Omit<ButtonProps, 'size' | 'variant'> &
  Omit<ComponentPropsWithRef<'select'>, 'size'> & { native?: boolean };

export type CheckboxProps = ComponentPropsWithRef<typeof ST_Checkbox>;

export type SliderProps = ComponentPropsWithRef<typeof Slider>;

export type CollapseProps = ComponentPropsWithRef<typeof Collapsible>;

export type RadioProps = ComponentPropsWithRef<typeof RadioGroupItem>;

export type DialogProps = Pick<
  ComponentPropsWithRef<typeof Dialog>,
  'onOpenChange'
> &
  ComponentPropsWithRef<typeof DialogContent>;

export interface ST_PartPropTypes {
  button: ButtonProps;
  checkbox: CheckboxProps;
  dialog: DialogProps;
  radio: RadioProps;
  select: SelectProps;
  slider: SliderProps;
}

/**
 * A part's props, tree-neutral: every tree's part props fit it. `object`, not
 * `Record<string, unknown>`: the parts' props types are interfaces, which have
 * no index signature.
 */
export type ST_PartProps = object;

/**
 * `ST_PartPropTypes` with every part tree-neutral, so the feature-map
 * augmentation and the table instance types stay identical across trees; the
 * options a user writes take this tree's `ST_PartPropTypes`.
 */
export type ST_NeutralPartPropTypes = Record<
  keyof ST_PartPropTypes,
  ST_PartProps
>;

export type ST_LinearProgressProps = {
  collapsibleProps?: DivProps;
  progressComponentProps?: DivProps & { value?: number | null };
};

export type ST_CircularProgressProps = ST_IconProps;

/** Props every icon in `ST_Icons` accepts: SVG props plus a `size`. */
export type ST_IconProps = ComponentPropsWithoutRef<'svg'> & {
  size?: number | string;
};

export type ST_IconKey =
  | 'ArrowDownwardIcon'
  | 'ArrowRightIcon'
  | 'CancelIcon'
  | 'ChevronLeftIcon'
  | 'ChevronRightIcon'
  | 'ClearAllIcon'
  | 'CloseIcon'
  | 'ContentCopy'
  | 'DensityLargeIcon'
  | 'DensityMediumIcon'
  | 'DensitySmallIcon'
  | 'DragHandleIcon'
  | 'DynamicFeedIcon'
  | 'EditIcon'
  | 'ExpandMoreIcon'
  | 'FilterAltIcon'
  | 'FilterListIcon'
  | 'FilterListOffIcon'
  | 'FirstPageIcon'
  | 'FullscreenExitIcon'
  | 'FullscreenIcon'
  | 'IndeterminateIcon'
  | 'KeyboardDoubleArrowDownIcon'
  | 'LastPageIcon'
  | 'MoreHorizIcon'
  | 'MoreVertIcon'
  | 'PushPinIcon'
  | 'RestartAltIcon'
  | 'SaveIcon'
  | 'SearchIcon'
  | 'SearchOffIcon'
  | 'SortIcon'
  | 'SyncAltIcon'
  | 'ViewColumnIcon'
  | 'VisibilityOffIcon';

export type ST_Icons = Record<ST_IconKey, ComponentType<ST_IconProps>>;

/** The events the row selection and select-all handlers accept. */
export type ST_SelectionEvent =
  | ChangeEvent<HTMLInputElement>
  | KeyboardEvent<HTMLElement>
  | MouseEvent<HTMLElement>;

export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<never, never>);

export type Prettify<T> = { [K in keyof T]: T[K] } & unknown;

export type Xor<A, B> =
  | Prettify<A & { [k in keyof B]?: never }>
  | Prettify<B & { [k in keyof A]?: never }>;

export type DropdownOption =
  | {
      label?: string;
      value: string;
    }
  | string;

export type ST_DensityState = 'comfortable' | 'compact' | 'spacious';

export type ST_ColumnFilterFnsState = Record<string, ST_FilterOption>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- interfaces have no index signature, so only an any value admits them; mirrors table-core RowData
export type ST_RowData = Record<string, any>;

export type ST_ColumnFiltersState = ColumnFiltersState;
export type ST_ColumnOrderState = ColumnOrderState;
export type ST_ColumnPinningPosition = ColumnPinningPosition;
export type ST_ColumnPinningState = ColumnPinningState;
export type ST_ColumnResizingState = columnResizingState;
export type ST_ColumnSizingState = ColumnSizingState;
export type ST_ExpandedState = ExpandedState;
export type ST_GroupingState = GroupingState;
export type ST_PaginationState = PaginationState;
export type ST_RowSelectionState = RowSelectionState;
export type ST_SortingState = SortingState;
export type ST_Updater<T> = Updater<T>;
export type ST_VirtualItem = VirtualItem;
export type ST_VisibilityState = ColumnVisibilityState;

export type ST_VirtualizerOptions<
  TScrollElement extends Element | Window = Element | Window,
  TItemElement extends Element = Element,
> = VirtualizerOptions<TScrollElement, TItemElement>;

export type ST_ColumnVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableCellElement,
> = Virtualizer<TScrollElement, TItemElement> & {
  virtualColumns: ST_VirtualItem[];
  virtualPaddingLeft?: number;
  virtualPaddingRight?: number;
};

export type ST_RowVirtualizer<
  TScrollElement extends Element | Window = HTMLDivElement,
  TItemElement extends Element = HTMLTableRowElement,
> = Virtualizer<TScrollElement, TItemElement> & {
  virtualRows: ST_VirtualItem[];
};

export type ST_ColumnHelper<TData extends ST_RowData> = {
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never,
  >(
    accessor: TAccessor,
    column: ST_DisplayColumnDef<TData, TValue>,
  ) => ST_ColumnDef<TData, TValue>;
  display: (column: ST_DisplayColumnDef<TData>) => ST_ColumnDef<TData>;
  group: (column: ST_GroupColumnDef<TData>) => ST_ColumnDef<TData>;
};

export interface ST_Localization {
  // BCP 47 language tag, used for number formatting
  language: string;
  actions: string;
  and: string;
  cancel: string;
  changeFilterMode: string;
  changeSearchMode: string;
  clearFilter: string;
  clearSearch: string;
  clearSelection: string;
  clearSort: string;
  clickToCopy: string;
  collapse: string;
  collapseAll: string;
  columnActions: string;
  copiedToClipboard: string;
  copy: string;
  dropToGroupBy: string;
  edit: string;
  expand: string;
  expandAll: string;
  filterArrIncludes: string;
  filterArrIncludesAll: string;
  filterArrIncludesSome: string;
  filterBetween: string;
  filterBetweenInclusive: string;
  filterByColumn: string;
  filterContains: string;
  filterEmpty: string;
  filterEndsWith: string;
  filterEquals: string;
  filterEqualsString: string;
  filterFuzzy: string;
  filterGreaterThan: string;
  filterGreaterThanOrEqualTo: string;
  filterIncludesString: string;
  filterIncludesStringSensitive: string;
  filteringByColumn: string;
  filterInNumberRange: string;
  filterLessThan: string;
  filterLessThanOrEqualTo: string;
  filterMode: string;
  filterNotEmpty: string;
  filterNotEquals: string;
  filterStartsWith: string;
  filterWeakEquals: string;
  goToFirstPage: string;
  goToLastPage: string;
  goToNextPage: string;
  goToPreviousPage: string;
  grab: string;
  groupByColumn: string;
  groupedBy: string;
  hideAll: string;
  hideColumn: string;
  max: string;
  min: string;
  move: string;
  noRecordsToDisplay: string;
  noResultsFound: string;
  of: string;
  or: string;
  pin: string;
  pinToLeft: string;
  pinToRight: string;
  resetColumnSize: string;
  resetOrder: string;
  rowActions: string;
  rowNumber: string;
  rowNumbers: string;
  rowsPerPage: string;
  save: string;
  search: string;
  select: string;
  selectedCountOfRowCountRowsSelected: string;
  showAll: string;
  showAllColumns: string;
  showHideColumns: string;
  showHideFilters: string;
  showHideSearch: string;
  sortByColumnAsc: string;
  sortByColumnDesc: string;
  sortedByColumnAsc: string;
  sortedByColumnDesc: string;
  thenBy: string;
  toggleDensity: string;
  toggleFullScreen: string;
  toggleSelectAll: string;
  toggleSelectRow: string;
  toggleVisibility: string;
  ungroupByColumn: string;
  unpin: string;
  unpinAll: string;
}

export interface ST_RowModel<TData extends ST_RowData> {
  flatRows: ST_Row<TData>[];
  rows: ST_Row<TData>[];
  rowsById: { [key: string]: ST_Row<TData> };
}

export type ST_TableInstance<
  TData extends ST_RowData,
  TSelected = ST_TableState<TData>,
> = Omit<
  ReactTable<ST_Features, TData, TSelected>,
  | 'getAllColumns'
  | 'getAllFlatColumns'
  | 'getAllLeafColumns'
  | 'getBottomRows'
  | 'getCenterLeafColumns'
  | 'getCenterRows'
  | 'getColumn'
  | 'getExpandedRowModel'
  | 'getFlatHeaders'
  | 'getFooterGroups'
  | 'getHeaderGroups'
  | 'getLeafHeaders'
  | 'getEndLeafColumns'
  | 'getPaginatedRowModel'
  | 'getPreFilteredRowModel'
  | 'getPrePaginatedRowModel'
  | 'getRowModel'
  | 'getSelectedRowModel'
  | 'getStartLeafColumns'
  | 'getTopRows'
  | 'atoms'
  | 'options'
> & {
  readonly atoms: ST_TableAtoms<TData>;
  AppTable: AppTableComponent<ST_Features>;
  getAllColumns: () => ST_Column<TData>[];
  getAllFlatColumns: () => ST_Column<TData>[];
  getAllLeafColumns: () => ST_Column<TData>[];
  getBottomRows: () => ST_Row<TData>[];
  getCenterLeafColumns: () => ST_Column<TData>[];
  getCenterRows: () => ST_Row<TData>[];
  getColumn: (columnId: string) => ST_Column<TData>;
  getExpandedRowModel: () => ST_RowModel<TData>;
  getFlatHeaders: () => ST_Header<TData>[];
  getFooterGroups: () => ST_HeaderGroup<TData>[];
  getHeaderGroups: () => ST_HeaderGroup<TData>[];
  getLeafHeaders: () => ST_Header<TData>[];
  getEndLeafColumns: () => ST_Column<TData>[];
  getPaginatedRowModel: () => ST_RowModel<TData>;
  getPreFilteredRowModel: () => ST_RowModel<TData>;
  getPrePaginatedRowModel: () => ST_RowModel<TData>;
  getRowModel: () => ST_RowModel<TData>;
  getSelectedRowModel: () => ST_RowModel<TData>;
  getStartLeafColumns: () => ST_Column<TData>[];
  getTopRows: () => ST_Row<TData>[];
  options: ST_DefinedTableOptions<TData>;
};

/**
 * The core table that `row.table`, `cell.table`, `column.table` and
 * `header.table` point to. It is the instance `constructTable` builds, not the
 * per-render wrapper `useShadcnTable` returns, so it has no `state` (read the
 * atoms) and no `AppTable` (`useAppTable` attaches it to the wrapper).
 */
export type ST_CoreTableInstance<TData extends ST_RowData = ST_RowData> = Omit<
  ST_TableInstance<TData>,
  'AppTable' | 'state'
>;

export type ST_DefinedTableOptions<TData extends ST_RowData> = Omit<
  ST_TableOptions<TData, ST_NeutralPartPropTypes>,
  'icons' | 'localization'
> & {
  icons: ST_Icons;
  localization: ST_Localization;
};

/** One read-only atom per table state slice, typed for `TData`. */
export type ST_TableAtoms<TData extends ST_RowData> = {
  [K in keyof ST_TableState<TData>]-?: ReadonlyAtom<ST_TableState<TData>[K]>;
};

/** The options the display column helpers read: the defined options plus three state slices. */
export type ST_DisplayColumnOptions<TData extends ST_RowData> =
  ST_DefinedTableOptions<TData> & {
    state: Pick<
      ST_TableState<TData>,
      'columnOrder' | 'creatingRow' | 'grouping'
    >;
  };

export type ST_StatefulTableOptions<TData extends ST_RowData> =
  ST_DefinedTableOptions<TData> & {
    state: ST_TableState<TData>;
  };

/**
 * The table state of `ST_Features`, with the slices that hold a row, cell or
 * column typed for `TData`. The feature state maps are not generic, so the
 * features store them typed for `ST_RowData`.
 */
export type ST_TableState<TData extends ST_RowData> = Omit<
  TableState<ST_Features>,
  | 'actionCell'
  | 'creatingRow'
  | 'draggingColumn'
  | 'draggingRow'
  | 'editingCell'
  | 'editingRow'
  | 'hoveredColumn'
  | 'hoveredRow'
> & {
  actionCell: ST_Cell<TData> | null;
  creatingRow: ST_Row<TData> | null;
  draggingColumn: ST_Column<TData> | null;
  draggingRow: ST_Row<TData> | null;
  editingCell: ST_Cell<TData> | null;
  editingRow: ST_Row<TData> | null;
  hoveredColumn: Partial<ST_Column<TData>> | null;
  hoveredRow: Partial<ST_Row<TData>> | null;
};

type ST_ColumnDef_PartKeys =
  | 'stColumnActionsButtonProps'
  | 'stColumnDragHandleProps'
  | 'stCopyButtonProps'
  | 'stFilterCheckboxProps'
  | 'stFilterSliderProps';

export interface ST_ColumnDef<
  TData extends ST_RowData,
  TValue = unknown,
  TParts extends ST_NeutralPartPropTypes = ST_PartPropTypes,
> extends Omit<
      ColumnDef<ST_Features, TData, TValue>,
      | 'accessorKey'
      | 'aggregatedCell'
      | 'aggregationFn'
      | 'cell'
      | 'columns'
      | 'filterFn'
      | 'footer'
      | 'header'
      | 'id'
      | 'sortFn'
      | ST_ColumnDef_PartKeys
    >,
    Pick<ST_ColumnDef_Config<TData, TValue, TParts>, ST_ColumnDef_PartKeys> {
  accessorFn?: (originalRow: TData) => TValue;
  accessorKey?: DeepKeys<TData> | (string & {});
  aggregationFn?: Array<ST_AggregationFn<TData>> | ST_AggregationFn<TData>;
  columns?: ST_ColumnDef<TData, TValue, TParts>[];
  filterFn?: ST_FilterFn<TData>;
  footer?: string;
  header: string;
  id?: LiteralUnion<string & keyof TData>;
  sortFn?: ST_SortFn<TData>;
}

export type ST_DisplayColumnDef<
  TData extends ST_RowData,
  TValue = unknown,
  TParts extends ST_NeutralPartPropTypes = ST_PartPropTypes,
> = Omit<ST_ColumnDef<TData, TValue, TParts>, 'accessorFn' | 'accessorKey'>;

export type ST_GroupColumnDef<TData extends ST_RowData> = ST_DisplayColumnDef<
  TData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ST_ColumnDef is invariant in TValue and group children mix value types
  any
> & {
  columns: ST_ColumnDef<TData>[];
};

export type ST_DefinedColumnDef<
  TData extends ST_RowData,
  TValue = unknown,
> = Omit<
  ST_ColumnDef<TData, TValue, ST_NeutralPartPropTypes>,
  'defaultDisplayColumn' | 'id'
> & {
  defaultDisplayColumn: Partial<
    ST_ColumnDef<TData, TValue, ST_NeutralPartPropTypes>
  >;
  id: string;
};

export type ST_Column<TData extends ST_RowData, TValue = unknown> = Omit<
  Column<ST_Features, TData, TValue>,
  'columnDef' | 'columns' | 'filterFn' | 'footer' | 'header' | 'table'
> & {
  columnDef: ST_DefinedColumnDef<TData, TValue>;
  columns?: ST_Column<TData, TValue>[];
  filterFn?: ST_FilterFn<TData>;
  footer: string;
  header: string;
  table: ST_CoreTableInstance<TData>;
};

export type ST_Header<TData extends ST_RowData> = Omit<
  Header<ST_Features, TData, unknown>,
  'column' | 'table'
> & {
  column: ST_Column<TData>;
  table: ST_CoreTableInstance<TData>;
};

export type ST_HeaderGroup<TData extends ST_RowData> = Omit<
  HeaderGroup<ST_Features, TData>,
  'headers'
> & {
  headers: ST_Header<TData>[];
};

export type ST_Row<TData extends ST_RowData> = Omit<
  Row<ST_Features, TData>,
  | '_valuesCache'
  | 'getAllCells'
  | 'getParentRow'
  | 'getParentRows'
  | 'getRow'
  | 'getVisibleCells'
  | 'subRows'
  | 'table'
> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the library writes by column id under a generic TData; stories read typed fields
  _valuesCache: Record<LiteralUnion<string & DeepKeys<TData>>, any>;
  getAllCells: () => ST_Cell<TData>[];
  getParentRow: () => ST_Row<TData> | null;
  getParentRows: () => ST_Row<TData>[];
  getRow: () => ST_Row<TData>;
  getVisibleCells: () => ST_Cell<TData>[];
  subRows?: ST_Row<TData>[];
  table: ST_CoreTableInstance<TData>;
};

export type ST_Cell<TData extends ST_RowData, TValue = unknown> = Omit<
  Cell<ST_Features, TData, TValue>,
  'column' | 'row' | 'table'
> & {
  column: ST_Column<TData, TValue>;
  row: ST_Row<TData>;
  table: ST_CoreTableInstance<TData>;
};

export type ST_AggregationOption = LiteralUnion<
  string & keyof typeof ST_AggregationFns
>;

export type ST_AggregationFn<TData extends ST_RowData> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TValue and TResult are invariant, aggregationFn_sum fails unknown; mirrors CustomAggregationFns
  AggregationFnDef<ST_Features, TData, any, any> | ST_AggregationOption;

export type ST_SortingOption = LiteralUnion<string & keyof typeof ST_SortFns>;

export type ST_SortFn<TData extends ST_RowData> =
  | SortFn<ST_Features, TData>
  | ST_SortingOption;

export type ST_FilterOption = LiteralUnion<string & keyof typeof ST_FilterFns>;

export type ST_FilterFn<TData extends ST_RowData> =
  | FilterFn<ST_Features, TData>
  | ST_FilterOption;

export type ST_InternalFilterOption = {
  divider: boolean;
  label: string;
  option: string;
  symbol: string;
};

export type ST_DisplayColumnIds =
  | 'st-row-actions'
  | 'st-row-drag'
  | 'st-row-expand'
  | 'st-row-numbers'
  | 'st-row-pin'
  | 'st-row-select'
  | 'st-row-spacer';

type ST_TableOptions_PartKeys =
  | 'defaultDisplayColumn'
  | 'displayColumnDefOptions'
  | 'stColumnActionsButtonProps'
  | 'stColumnDragHandleProps'
  | 'stCopyButtonProps'
  | 'stCreateRowModalProps'
  | 'stEditRowDialogProps'
  | 'stExpandAllButtonProps'
  | 'stExpandButtonProps'
  | 'stFilterCheckboxProps'
  | 'stFilterSliderProps'
  | 'stPaginationProps'
  | 'stRowDragHandleProps'
  | 'stSelectAllCheckboxProps'
  | 'stSelectCheckboxProps'
  | 'stToolbarAlertBannerChipProps';

export interface ST_TableOptions<
  TData extends ST_RowData,
  TParts extends ST_NeutralPartPropTypes = ST_PartPropTypes,
> extends Omit<
      Partial<TableOptions<ST_Features, TData>>,
      | 'columns'
      | 'data'
      | 'defaultColumn'
      | 'enableRowPinning'
      | 'enableRowSelection'
      | 'features'
      | 'getRowId'
      | 'globalFilterFn'
      | 'initialState'
      | 'onActionCellChange'
      | 'onCreatingRowChange'
      | 'onDraggingColumnChange'
      | 'onDraggingRowChange'
      | 'onEditingCellChange'
      | 'onEditingRowChange'
      | 'onHoveredColumnChange'
      | 'onHoveredRowChange'
      | 'state'
      | ST_TableOptions_PartKeys
    >,
    Pick<ST_TableOptions_Config<TData, TParts>, ST_TableOptions_PartKeys> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- a mixed TValue array; mirrors table-core columnHelper.columns
  columns: ST_ColumnDef<TData, any, TParts>[];
  data: TData[];
  defaultColumn?: Partial<ST_ColumnDef<TData, unknown, TParts>>;
  enableRowPinning?: ((row: ST_Row<TData>) => boolean) | boolean;
  enableRowSelection?: ((row: ST_Row<TData>) => boolean) | boolean;
  getRowId?: (
    originalRow: TData,
    index: number,
    parentRow: ST_Row<TData>,
  ) => string;
  globalFilterFn?: ST_FilterOption;
  initialState?: Partial<ST_TableState<TData>>;
  onActionCellChange?: OnChangeFn<ST_Cell<TData> | null>;
  onCreatingRowChange?: OnChangeFn<ST_Row<TData> | null>;
  onDraggingColumnChange?: OnChangeFn<ST_Column<TData> | null>;
  onDraggingRowChange?: OnChangeFn<ST_Row<TData> | null>;
  onEditingCellChange?: OnChangeFn<ST_Cell<TData> | null>;
  onEditingRowChange?: OnChangeFn<ST_Row<TData> | null>;
  onHoveredColumnChange?: OnChangeFn<Partial<ST_Column<TData>> | null>;
  onHoveredRowChange?: OnChangeFn<Partial<ST_Row<TData>> | null>;
  state?: Partial<ST_TableState<TData>>;
}

export type ST_TableProviderProps<TData extends ST_RowData> = {
  children: ReactNode;
  table: ST_TableInstance<TData, unknown>;
};
