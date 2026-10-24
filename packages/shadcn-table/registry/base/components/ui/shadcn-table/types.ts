import {
  type ComponentPropsWithRef,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from 'react';
import {
  type AccessorFn,
  type AggregationFnDef,
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
import { type LucideProps } from 'lucide-react';
import { type Checkbox } from '@/components/ui/checkbox';
import { type Collapsible } from '@/components/ui/collapsible';
import { type Dialog, type DialogContent } from '@/components/ui/dialog';
import { type RadioGroupItem } from '@/components/ui/radio-group';
import { type Slider } from '@/components/ui/slider';
import { type ST_AggregationFns } from '@/components/ui/shadcn-table/fns/aggregationFns';
import { type ST_FilterFns } from '@/components/ui/shadcn-table/fns/filterFns';
import { type ST_SortFns } from '@/components/ui/shadcn-table/fns/sortFns';
import { type ST_Icons } from '@/components/ui/shadcn-table/icons';
import { type ST_Features } from '@/components/ui/shadcn-table/utils/tanstack.features';

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

export type ButtonProps = ComponentPropsWithRef<'button'>;

export type InputProps = ComponentPropsWithRef<'input'>;

export type SelectProps = ButtonProps &
  Omit<ComponentPropsWithRef<'select'>, 'size'> & { native?: boolean };

export type CheckboxProps = ComponentPropsWithRef<typeof Checkbox>;

export type SliderProps = ComponentPropsWithRef<typeof Slider>;

export type CollapseProps = ComponentPropsWithRef<typeof Collapsible>;

export type RadioProps = ComponentPropsWithRef<typeof RadioGroupItem>;

export type DialogProps = Pick<
  ComponentPropsWithRef<typeof Dialog>,
  'onOpenChange'
> &
  ComponentPropsWithRef<typeof DialogContent>;

export type ST_LinearProgressProps = {
  collapsibleProps?: DivProps;
  progressComponentProps?: DivProps & { value?: number | null };
};

export type ST_CircularProgressProps = LucideProps;

export type { ST_Icons };
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
      value: any;
    }
  | string;

export type ST_DensityState = 'comfortable' | 'compact' | 'spacious';

export type ST_ColumnFilterFnsState = Record<string, ST_FilterOption>;

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
  // language of the localization as BCP 47 language tag for number formatting
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

// Note: mrtTheme dropped project-wide (Conventions); theme tokens instead.
// export interface ST_Theme { ... }

export interface ST_RowModel<TData extends ST_RowData> {
  flatRows: ST_Row<TData>[];
  rows: ST_Row<TData>[];
  rowsById: { [key: string]: ST_Row<TData> };
}

export type ST_TableInstance<TData extends ST_RowData> = Omit<
  ReactTable<ST_Features, TData, ST_TableState<TData>>,
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
  | 'options'
> & {
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
  options: ST_StatefulTableOptions<TData>;
  refs: {
    actionCellRef: RefObject<HTMLTableCellElement | null>;
    bottomToolbarRef: RefObject<HTMLDivElement | null>;
    editInputRefs: RefObject<Record<string, HTMLInputElement> | null>;
    filterInputRefs: RefObject<Record<string, HTMLInputElement> | null>;
    searchInputRef: RefObject<HTMLInputElement | null>;
    tableContainerRef: RefObject<HTMLDivElement | null>;
    tableFooterRef: RefObject<HTMLTableSectionElement | null>;
    tableHeadCellRefs: RefObject<Record<string, HTMLTableCellElement> | null>;
    tableHeadRef: RefObject<HTMLTableSectionElement | null>;
    tableLayoutRef: RefObject<HTMLDivElement | null>;
    topToolbarRef: RefObject<HTMLDivElement | null>;
  };
  setActionCell: Dispatch<SetStateAction<ST_Cell<TData> | null>>;
  setColumnFilterFns: Dispatch<SetStateAction<ST_ColumnFilterFnsState>>;
  setCreatingRow: Dispatch<SetStateAction<ST_Row<TData> | null | true>>;
  setDensity: Dispatch<SetStateAction<ST_DensityState>>;
  setDraggingColumn: Dispatch<SetStateAction<ST_Column<TData> | null>>;
  setDraggingRow: Dispatch<SetStateAction<ST_Row<TData> | null>>;
  setEditingCell: Dispatch<SetStateAction<ST_Cell<TData> | null>>;
  setEditingRow: Dispatch<SetStateAction<ST_Row<TData> | null>>;
  setGlobalFilterFn: Dispatch<SetStateAction<ST_FilterOption>>;
  setHoveredColumn: Dispatch<SetStateAction<Partial<ST_Column<TData>> | null>>;
  setHoveredRow: Dispatch<SetStateAction<Partial<ST_Row<TData>> | null>>;
  setIsFullScreen: Dispatch<SetStateAction<boolean>>;
  setShowAlertBanner: Dispatch<SetStateAction<boolean>>;
  setShowColumnFilters: Dispatch<SetStateAction<boolean>>;
  setShowGlobalFilter: Dispatch<SetStateAction<boolean>>;
  setShowToolbarDropZone: Dispatch<SetStateAction<boolean>>;
};

export type ST_DefinedTableOptions<TData extends ST_RowData> = Omit<
  ST_TableOptions<TData>,
  // Note: mrtTheme dropped project-wide (Conventions); theme tokens instead.
  'icons' | 'localization' // | 'mrtTheme'
> & {
  icons: ST_Icons;
  localization: ST_Localization;
  // mrtTheme: Required<ST_Theme>;
};

export type ST_StatefulTableOptions<TData extends ST_RowData> =
  ST_DefinedTableOptions<TData> & {
    state: Pick<
      ST_TableState<TData>,
      | 'columnFilterFns'
      | 'columnOrder'
      | 'columnResizing'
      | 'creatingRow'
      | 'density'
      | 'draggingColumn'
      | 'draggingRow'
      | 'editingCell'
      | 'editingRow'
      | 'globalFilterFn'
      | 'grouping'
      | 'hoveredColumn'
      | 'hoveredRow'
      | 'isFullScreen'
      | 'pagination'
      | 'showAlertBanner'
      | 'showColumnFilters'
      | 'showGlobalFilter'
      | 'showToolbarDropZone'
    >;
  };

export interface ST_TableState<TData extends ST_RowData>
  extends TableState<ST_Features> {
  actionCell?: ST_Cell<TData> | null;
  columnFilterFns: ST_ColumnFilterFnsState;
  creatingRow: ST_Row<TData> | null;
  density: ST_DensityState;
  draggingColumn: ST_Column<TData> | null;
  draggingRow: ST_Row<TData> | null;
  editingCell: ST_Cell<TData> | null;
  editingRow: ST_Row<TData> | null;
  globalFilterFn: ST_FilterOption;
  hoveredColumn: Partial<ST_Column<TData>> | null;
  hoveredRow: Partial<ST_Row<TData>> | null;
  isFullScreen: boolean;
  isLoading: boolean;
  isSaving: boolean;
  showAlertBanner: boolean;
  showColumnFilters: boolean;
  showGlobalFilter: boolean;
  showLoadingOverlay: boolean;
  showProgressBars: boolean;
  showSkeletons: boolean;
  showToolbarDropZone: boolean;
}

export interface ST_ColumnDef<TData extends ST_RowData, TValue = unknown>
  extends Omit<
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
  > {
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   * Specify a function here to point to the correct property in the data object.
   *
   * @example accessorFn: (row) => row.username
   */
  accessorFn?: (originalRow: TData) => TValue;
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   * Specify which key in the row this column should use to access the correct data.
   * Also supports Deep Key Dot Notation.
   *
   * @example accessorKey: 'username' //simple
   * @example accessorKey: 'name.firstName' //deep key dot notation
   */
  accessorKey?: DeepKeys<TData> | (string & {});
  AggregatedCell?: (props: {
    cell: ST_Cell<TData, TValue>;
    column: ST_Column<TData, TValue>;
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
    staticColumnIndex?: number;
    staticRowIndex?: number;
  }) => ReactNode;
  aggregationFn?: Array<ST_AggregationFn<TData>> | ST_AggregationFn<TData>;
  Cell?: (props: {
    cell: ST_Cell<TData, TValue>;
    column: ST_Column<TData, TValue>;
    renderedCellValue: ReactNode;
    row: ST_Row<TData>;
    rowRef?: RefObject<HTMLTableRowElement | null>;
    staticColumnIndex?: number;
    staticRowIndex?: number;
    table: ST_TableInstance<TData>;
  }) => ReactNode;
  /**
   * Specify what type of column this is. Either `data`, `display`, or `group`. Defaults to `data`.
   * Leave this blank if you are just creating a normal data column.
   *
   * @default 'data'
   *
   * @example columnDefType: 'display'
   */
  columnDefType?: 'data' | 'display' | 'group';
  columnFilterModeOptions?: Array<
    LiteralUnion<string & ST_FilterOption>
  > | null;
  columns?: ST_ColumnDef<TData, TValue>[];
  Edit?: (props: {
    cell: ST_Cell<TData, TValue>;
    column: ST_Column<TData, TValue>;
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
  }) => ReactNode;
  editSelectOptions?:
    | ((props: {
        cell: ST_Cell<TData, TValue>;
        column: ST_Column<TData>;
        row: ST_Row<TData>;
        table: ST_TableInstance<TData>;
      }) => DropdownOption[])
    | DropdownOption[];
  editVariant?: 'select' | 'text';
  enableClickToCopy?:
    | 'context-menu'
    | ((cell: ST_Cell<TData>) => 'context-menu' | boolean)
    | boolean;
  enableColumnActions?: boolean;
  enableColumnDragging?: boolean;
  enableColumnFilterModes?: boolean;
  enableColumnOrdering?: boolean;
  enableEditing?: ((row: ST_Row<TData>) => boolean) | boolean;
  enableFilterMatchHighlighting?: boolean;
  Filter?: (props: {
    column: ST_Column<TData, TValue>;
    header: ST_Header<TData>;
    rangeFilterIndex?: number;
    table: ST_TableInstance<TData>;
  }) => ReactNode;
  filterFn?: ST_FilterFn<TData>;
  filterSelectOptions?: DropdownOption[];
  filterVariant?:
    | 'autocomplete'
    | 'checkbox'
    | 'date'
    | 'date-range'
    | 'datetime'
    | 'datetime-range'
    | 'multi-select'
    | 'range'
    | 'range-slider'
    | 'select'
    | 'text'
    | 'time'
    | 'time-range';
  /**
   * footer must be a string. If you want custom JSX to render the footer, you can also specify a `Footer` option. (Capital F)
   */
  footer?: string;
  Footer?:
    | ((props: {
        column: ST_Column<TData, TValue>;
        footer: ST_Header<TData>;
        table: ST_TableInstance<TData>;
      }) => ReactNode)
    | ReactNode;
  GroupedCell?: (props: {
    cell: ST_Cell<TData, TValue>;
    column: ST_Column<TData, TValue>;
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
    staticColumnIndex?: number;
    staticRowIndex?: number;
  }) => ReactNode;
  /**
   * If `layoutMode` is `'grid'` or `'grid-no-grow'`, you can specify the flex grow value for individual columns to still grow and take up remaining space, or set to `false`/0 to not grow.
   */
  grow?: boolean | number;
  /**
   * header must be a string. If you want custom JSX to render the header, you can also specify a `Header` option. (Capital H)
   */
  header: string;
  Header?:
    | ((props: {
        column: ST_Column<TData, TValue>;
        header: ST_Header<TData>;
        table: ST_TableInstance<TData>;
      }) => ReactNode)
    | ReactNode;
  /**
   * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
   *
   * If you have also specified an `accessorFn`, MRT still needs to have a valid `id` to be able to identify the column uniquely.
   *
   * `id` defaults to the `accessorKey` or `header` if not specified.
   *
   * @default gets set to the same value as `accessorKey` by default
   */
  id?: LiteralUnion<string & keyof TData>;
  stColumnActionsButtonProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => ButtonProps)
    | ButtonProps;
  stColumnDragHandleProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => ButtonProps)
    | ButtonProps;
  stCopyButtonProps?:
    | ((props: {
        cell: ST_Cell<TData, TValue>;
        column: ST_Column<TData>;
        row: ST_Row<TData>;
        table: ST_TableInstance<TData>;
      }) => ButtonProps)
    | ButtonProps;
  stEditTextFieldProps?:
    | ((props: {
        cell: ST_Cell<TData, TValue>;
        column: ST_Column<TData>;
        row: ST_Row<TData>;
        table: ST_TableInstance<TData>;
      }) => InputProps & { error?: boolean; helperText?: ReactNode })
    | (InputProps & { error?: boolean; helperText?: ReactNode });
  stFilterAutocompleteProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => InputProps)
    | InputProps;
  stFilterCheckboxProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => CheckboxProps)
    | CheckboxProps;
  stFilterDatePickerProps?:
    | ((props: {
        column: ST_Column<TData>;
        rangeFilterIndex?: number;
        table: ST_TableInstance<TData>;
      }) => InputProps)
    | InputProps;
  stFilterDateTimePickerProps?:
    | ((props: {
        column: ST_Column<TData>;
        rangeFilterIndex?: number;
        table: ST_TableInstance<TData>;
      }) => InputProps)
    | InputProps;
  stFilterSliderProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => SliderProps)
    | SliderProps;
  stFilterTextFieldProps?:
    | ((props: {
        column: ST_Column<TData>;
        rangeFilterIndex?: number;
        table: ST_TableInstance<TData>;
      }) => InputProps)
    | InputProps;
  stFilterTimePickerProps?:
    | ((props: {
        column: ST_Column<TData>;
        rangeFilterIndex?: number;
        table: ST_TableInstance<TData>;
      }) => InputProps)
    | InputProps;
  stTableBodyCellProps?:
    | ((props: {
        cell: ST_Cell<TData, TValue>;
        column: ST_Column<TData>;
        row: ST_Row<TData>;
        table: ST_TableInstance<TData>;
      }) => TableCellProps)
    | TableCellProps;
  stTableFooterCellProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => TableCellProps)
    | TableCellProps;
  stTableHeadCellProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => TableCellProps)
    | TableCellProps;
  PlaceholderCell?: (props: {
    cell: ST_Cell<TData, TValue>;
    column: ST_Column<TData, TValue>;
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
  }) => ReactNode;
  renderCellActionMenuItems?: (props: {
    cell: ST_Cell<TData>;
    closeMenu: () => void;
    column: ST_Column<TData>;
    internalMenuItems: ReactNode[];
    row: ST_Row<TData>;
    staticColumnIndex?: number;
    staticRowIndex?: number;
    table: ST_TableInstance<TData>;
  }) => ReactNode[];
  renderColumnActionsMenuItems?: (props: {
    closeMenu: () => void;
    column: ST_Column<TData>;
    internalColumnMenuItems: ReactNode[];
    table: ST_TableInstance<TData>;
  }) => ReactNode[];
  renderColumnFilterModeMenuItems?: (props: {
    column: ST_Column<TData>;
    internalFilterOptions: ST_InternalFilterOption[];
    onSelectFilterMode: (filterMode: ST_FilterOption) => void;
    table: ST_TableInstance<TData>;
  }) => ReactNode[];
  sortFn?: ST_SortFn<TData>;
  visibleInShowHideMenu?: boolean;
}

export type ST_DisplayColumnDef<
  TData extends ST_RowData,
  TValue = unknown,
> = Omit<ST_ColumnDef<TData, TValue>, 'accessorFn' | 'accessorKey'>;

export type ST_GroupColumnDef<TData extends ST_RowData> = ST_DisplayColumnDef<
  TData,
  any
> & {
  columns: ST_ColumnDef<TData>[];
};

export type ST_DefinedColumnDef<
  TData extends ST_RowData,
  TValue = unknown,
> = Omit<ST_ColumnDef<TData, TValue>, 'defaultDisplayColumn' | 'id'> & {
  _filterFn: ST_FilterOption;
  defaultDisplayColumn: Partial<ST_ColumnDef<TData, TValue>>;
  id: string;
};

export type ST_Column<TData extends ST_RowData, TValue = unknown> = Omit<
  Column<ST_Features, TData, TValue>,
  'columnDef' | 'columns' | 'filterFn' | 'footer' | 'header'
> & {
  columnDef: ST_DefinedColumnDef<TData, TValue>;
  columns?: ST_Column<TData, TValue>[];
  filterFn?: ST_FilterFn<TData>;
  footer: string;
  header: string;
};

export type ST_Header<TData extends ST_RowData> = Omit<
  Header<ST_Features, TData, unknown>,
  'column'
> & {
  column: ST_Column<TData>;
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
> & {
  _valuesCache: Record<LiteralUnion<string & DeepKeys<TData>>, any>;
  getAllCells: () => ST_Cell<TData>[];
  getParentRow: () => ST_Row<TData> | null;
  getParentRows: () => ST_Row<TData>[];
  getRow: () => ST_Row<TData>;
  getVisibleCells: () => ST_Cell<TData>[];
  subRows?: ST_Row<TData>[];
};

export type ST_Cell<TData extends ST_RowData, TValue = unknown> = Omit<
  Cell<ST_Features, TData, TValue>,
  'column' | 'row'
> & {
  column: ST_Column<TData, TValue>;
  row: ST_Row<TData>;
};

export type ST_AggregationOption = string & keyof typeof ST_AggregationFns;

export type ST_AggregationFn<TData extends ST_RowData> =
  | AggregationFnDef<ST_Features, TData, any, any>
  | ST_AggregationOption;

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

/**
 * `columns` and `data` props are the only required props, but there are over 170 other optional props.
 *
 * See more info on creating columns and data on the official docs site:
 * @link https://shadcn-table.com/docs/getting-started/usage
 *
 * See the full props list on the official docs site:
 * @link https://shadcn-table.com/docs/api/table-options
 */
export interface ST_TableOptions<TData extends ST_RowData>
  extends Omit<
    Partial<TableOptions<ST_Features, TData>>,
    | 'columns'
    | 'data'
    | 'defaultColumn'
    | 'enableRowSelection'
    | 'features'
    | 'getRowId'
    | 'globalFilterFn'
    | 'initialState'
    | 'state'
  > {
  /**
   * Custom aggregation functions, by name, on top of the built-in ones. A column's `aggregationFn` string resolves against this map.
   */
  aggregationFns?: Record<
    string,
    AggregationFnDef<ST_Features, TData, any, any>
  >;
  columnFilterDisplayMode?: 'custom' | 'popover' | 'subheader';
  columnFilterModeOptions?: Array<
    LiteralUnion<string & ST_FilterOption>
  > | null;
  /**
   * The columns to display in the table. `accessorKey`s or `accessorFn`s must match keys in the `data` table option.
   *
   * See more info on creating columns on the official docs site:
   * @link https://shadcn-table.com/docs/guides/data-columns
   * @link https://shadcn-table.com/docs/guides/display-columns
   *
   * See all Columns Options on the official docs site:
   * @link https://shadcn-table.com/docs/api/column-options
   */
  columns: ST_ColumnDef<TData, any>[];
  columnVirtualizerInstanceRef?: RefObject<ST_ColumnVirtualizer | null>;
  columnVirtualizerOptions?:
    | ((props: {
        table: ST_TableInstance<TData>;
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>;
  createDisplayMode?: 'custom' | 'modal' | 'row';
  /**
   * Pass your data as an array of objects. Objects can theoretically be any shape, but it's best to keep them consistent.
   *
   * See the usage guide for more info on creating columns and data:
   * @link https://shadcn-table.com/docs/getting-started/usage
   */
  data: TData[];
  /**
   * Instead of specifying a bunch of the same options for each column, you can just change an option in the `defaultColumn` table option to change a default option for all columns.
   */
  defaultColumn?: Partial<ST_ColumnDef<TData>>;
  /**
   * Change the default options for display columns.
   */
  defaultDisplayColumn?: Partial<ST_DisplayColumnDef<TData>>;
  displayColumnDefOptions?: Partial<{
    [key in ST_DisplayColumnIds]: Partial<ST_DisplayColumnDef<TData>>;
  }>;
  editDisplayMode?: 'cell' | 'custom' | 'modal' | 'row' | 'table';
  enableBottomToolbar?: boolean;
  enableCellActions?: ((cell: ST_Cell<TData>) => boolean) | boolean;
  enableClickToCopy?:
    | 'context-menu'
    | ((cell: ST_Cell<TData>) => 'context-menu' | boolean)
    | boolean;
  enableColumnActions?: boolean;
  enableColumnDragging?: boolean;
  enableColumnFilterModes?: boolean;
  enableColumnOrdering?: boolean;
  enableColumnVirtualization?: boolean;
  enableDensityToggle?: boolean;
  enableEditing?: ((row: ST_Row<TData>) => boolean) | boolean;
  enableExpandAll?: boolean;
  enableFacetedValues?: boolean;
  enableFilterMatchHighlighting?: boolean;
  enableFullScreenToggle?: boolean;
  enableGlobalFilterModes?: boolean;
  enableGlobalFilterRankedResults?: boolean;
  enableKeyboardShortcuts?: boolean;
  enablePagination?: boolean;
  enableRowActions?: boolean;
  enableRowDragging?: boolean;
  enableRowNumbers?: boolean;
  enableRowOrdering?: boolean;
  enableRowSelection?: ((row: ST_Row<TData>) => boolean) | boolean;
  enableRowVirtualization?: boolean;
  enableSelectAll?: boolean;
  enableStickyFooter?: boolean;
  enableStickyHeader?: boolean;
  enableTableFooter?: boolean;
  enableTableHead?: boolean;
  enableToolbarInternalActions?: boolean;
  enableTopToolbar?: boolean;
  expandRowsFn?: (dataRow: TData) => TData[];
  /**
   * Custom filter functions, by name, on top of the built-in ones. A column's `filterFn` string and `globalFilterFn` resolve against this map.
   */
  filterFns?: Record<string, FilterFn<ST_Features, TData>>;
  getRowId?: (
    originalRow: TData,
    index: number,
    parentRow: ST_Row<TData>,
  ) => string;
  globalFilterFn?: ST_FilterOption;
  globalFilterModeOptions?: ST_FilterOption[] | null;
  icons?: Partial<ST_Icons>;
  id?: string;
  initialState?: Partial<ST_TableState<TData>>;
  /**
   * Changes which kind of CSS layout is used to render the table. `semantic` uses default semantic HTML elements, while `grid` adds CSS grid and flexbox styles
   */
  layoutMode?: 'grid' | 'grid-no-grow' | 'semantic';
  /**
   * Pass in either a locale imported from `@/components/ui/shadcn-table/locales/*` or a custom locale object.
   *
   * See the localization (i18n) guide for more info:
   * @link https://shadcn-table.com/docs/guides/localization
   */
  localization?: Partial<ST_Localization>;
  /**
   * Memoize cells, rows, or the entire table body to potentially improve render performance.
   *
   * @warning This will break some dynamic rendering features. See the memoization guide for more info:
   * @link https://shadcn-table.com/docs/guides/memoization
   */
  memoMode?: 'cells' | 'rows' | 'table-body';
  // Note: mrtTheme dropped project-wide (Conventions); theme tokens instead.
  // mrtTheme?: ((theme: Theme) => Partial<ST_Theme>) | Partial<ST_Theme>;
  stBottomToolbarProps?:
    | ((props: { table: ST_TableInstance<TData> }) => DivProps)
    | DivProps;
  stCircularProgressProps?:
    | ((props: {
        table: ST_TableInstance<TData>;
      }) => ST_CircularProgressProps & { Component?: ReactNode })
    | (ST_CircularProgressProps & { Component?: ReactNode });
  stColumnActionsButtonProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => ButtonProps)
    | ButtonProps;
  stColumnDragHandleProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => ButtonProps)
    | ButtonProps;
  stCopyButtonProps?:
    | ((props: {
        cell: ST_Cell<TData>;
        column: ST_Column<TData>;
        row: ST_Row<TData>;
        table: ST_TableInstance<TData>;
      }) => ButtonProps)
    | ButtonProps;
  stCreateRowModalProps?:
    | ((props: {
        row: ST_Row<TData>;
        table: ST_TableInstance<TData>;
      }) => DialogProps)
    | DialogProps;
  stDetailPanelProps?:
    | ((props: {
        row: ST_Row<TData>;
        table: ST_TableInstance<TData>;
      }) => TableCellProps)
    | TableCellProps;
  stEditRowDialogProps?:
    | ((props: {
        row: ST_Row<TData>;
        table: ST_TableInstance<TData>;
      }) => DialogProps)
    | DialogProps;
  stEditTextFieldProps?:
    | ((props: {
        cell: ST_Cell<TData>;
        column: ST_Column<TData>;
        row: ST_Row<TData>;
        table: ST_TableInstance<TData>;
      }) => InputProps & { error?: boolean; helperText?: ReactNode })
    | (InputProps & { error?: boolean; helperText?: ReactNode });
  stExpandAllButtonProps?:
    | ((props: { table: ST_TableInstance<TData> }) => ButtonProps)
    | ButtonProps;
  stExpandButtonProps?:
    | ((props: {
        row: ST_Row<TData>;
        staticRowIndex?: number;
        table: ST_TableInstance<TData>;
      }) => ButtonProps)
    | ButtonProps;
  stFilterAutocompleteProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => InputProps)
    | InputProps;
  stFilterCheckboxProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => CheckboxProps)
    | CheckboxProps;
  stFilterDatePickerProps?:
    | ((props: {
        column: ST_Column<TData>;
        rangeFilterIndex?: number;
        table: ST_TableInstance<TData>;
      }) => InputProps)
    | InputProps;
  stFilterDateTimePickerProps?:
    | ((props: {
        column: ST_Column<TData>;
        rangeFilterIndex?: number;
        table: ST_TableInstance<TData>;
      }) => InputProps)
    | InputProps;
  stFilterSliderProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => SliderProps)
    | SliderProps;
  stFilterTextFieldProps?:
    | ((props: {
        column: ST_Column<TData>;
        rangeFilterIndex?: number;
        table: ST_TableInstance<TData>;
      }) => InputProps)
    | InputProps;
  stFilterTimePickerProps?:
    | ((props: {
        column: ST_Column<TData>;
        rangeFilterIndex?: number;
        table: ST_TableInstance<TData>;
      }) => InputProps)
    | InputProps;
  stLinearProgressProps?:
    | ((props: {
        isTopToolbar: boolean;
        table: ST_TableInstance<TData>;
      }) => ST_LinearProgressProps)
    | ST_LinearProgressProps;
  stPaginationProps?:
    | ((props: { table: ST_TableInstance<TData> }) => Partial<
        ST_PaginationProps & {
          SelectProps?: Partial<SelectProps>;
          disabled?: boolean;
          rowsPerPageOptions?: { label: string; value: number }[] | number[];
          showRowsPerPage?: boolean;
        }
      >)
    | Partial<
        ST_PaginationProps & {
          SelectProps?: Partial<SelectProps>;
          disabled?: boolean;
          rowsPerPageOptions?: { label: string; value: number }[] | number[];
          showRowsPerPage?: boolean;
        }
      >;
  stRowDragHandleProps?:
    | ((props: {
        row: ST_Row<TData>;
        table: ST_TableInstance<TData>;
      }) => ButtonProps)
    | ButtonProps;
  stSearchTextFieldProps?:
    | ((props: { table: ST_TableInstance<TData> }) => InputProps)
    | InputProps;
  stSelectAllCheckboxProps?:
    | ((props: { table: ST_TableInstance<TData> }) => CheckboxProps)
    | CheckboxProps;
  stSelectCheckboxProps?:
    | ((props: {
        row: ST_Row<TData>;
        staticRowIndex?: number;
        table: ST_TableInstance<TData>;
      }) => CheckboxProps | RadioProps)
    | (CheckboxProps | RadioProps);
  stSkeletonProps?:
    | ((props: {
        cell: ST_Cell<TData>;
        column: ST_Column<TData>;
        row: ST_Row<TData>;
        table: ST_TableInstance<TData>;
      }) => DivProps)
    | DivProps;
  stTableBodyCellProps?:
    | ((props: {
        cell: ST_Cell<TData>;
        column: ST_Column<TData>;
        row: ST_Row<TData>;
        table: ST_TableInstance<TData>;
      }) => TableCellProps)
    | TableCellProps;
  stTableBodyProps?:
    | ((props: { table: ST_TableInstance<TData> }) => TableBodyProps)
    | TableBodyProps;
  stTableBodyRowProps?:
    | ((props: {
        isDetailPanel?: boolean;
        row: ST_Row<TData>;
        staticRowIndex: number;
        table: ST_TableInstance<TData>;
      }) => TableRowProps & { hover?: boolean })
    | (TableRowProps & { hover?: boolean });
  stTableContainerProps?:
    | ((props: { table: ST_TableInstance<TData> }) => DivProps)
    | DivProps;
  stTableFooterCellProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => TableCellProps)
    | TableCellProps;
  stTableFooterProps?:
    | ((props: { table: ST_TableInstance<TData> }) => TableFooterProps)
    | TableFooterProps;
  stTableFooterRowProps?:
    | ((props: {
        footerGroup: ST_HeaderGroup<TData>;
        table: ST_TableInstance<TData>;
      }) => TableRowProps)
    | TableRowProps;
  stTableHeadCellProps?:
    | ((props: {
        column: ST_Column<TData>;
        table: ST_TableInstance<TData>;
      }) => TableCellProps)
    | TableCellProps;
  stTableHeadProps?:
    | ((props: { table: ST_TableInstance<TData> }) => TableHeadProps)
    | TableHeadProps;
  stTableHeadRowProps?:
    | ((props: {
        headerGroup: ST_HeaderGroup<TData>;
        table: ST_TableInstance<TData>;
      }) => TableRowProps)
    | TableRowProps;
  stTableLayoutProps?:
    | ((props: { table: ST_TableInstance<TData> }) => DivProps)
    | DivProps;
  stTableProps?:
    | ((props: { table: ST_TableInstance<TData> }) => TableProps)
    | TableProps;
  stToolbarAlertBannerChipProps?:
    | ((props: { table: ST_TableInstance<TData> }) => ButtonProps)
    | ButtonProps;
  stToolbarAlertBannerProps?:
    | ((props: { table: ST_TableInstance<TData> }) => DivProps)
    | DivProps;
  stTopToolbarProps?:
    | ((props: { table: ST_TableInstance<TData> }) => DivProps)
    | DivProps;
  onActionCellChange?: OnChangeFn<ST_Cell<TData> | null>;
  onColumnFilterFnsChange?: OnChangeFn<{ [key: string]: ST_FilterOption }>;
  onCreatingRowCancel?: (props: {
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
  }) => void;
  onCreatingRowChange?: OnChangeFn<ST_Row<TData> | null>;
  onCreatingRowSave?: (props: {
    exitCreatingMode: () => void;
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
    values: Record<LiteralUnion<string & DeepKeys<TData>>, any>;
  }) => Promise<void> | void;
  onDensityChange?: OnChangeFn<ST_DensityState>;
  onDraggingColumnChange?: OnChangeFn<ST_Column<TData> | null>;
  onDraggingRowChange?: OnChangeFn<ST_Row<TData> | null>;
  onEditingCellChange?: OnChangeFn<ST_Cell<TData> | null>;
  onEditingRowCancel?: (props: {
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
  }) => void;
  onEditingRowChange?: OnChangeFn<ST_Row<TData> | null>;
  onEditingRowSave?: (props: {
    exitEditingMode: () => void;
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
    values: Record<LiteralUnion<string & DeepKeys<TData>>, any>;
  }) => Promise<void> | void;
  onGlobalFilterFnChange?: OnChangeFn<ST_FilterOption>;
  onHoveredColumnChange?: OnChangeFn<Partial<ST_Column<TData>> | null>;
  onHoveredRowChange?: OnChangeFn<Partial<ST_Row<TData>> | null>;
  onIsFullScreenChange?: OnChangeFn<boolean>;
  onShowAlertBannerChange?: OnChangeFn<boolean>;
  onShowColumnFiltersChange?: OnChangeFn<boolean>;
  onShowGlobalFilterChange?: OnChangeFn<boolean>;
  onShowToolbarDropZoneChange?: OnChangeFn<boolean>;
  paginationDisplayMode?: 'custom' | 'default' | 'pages';
  positionActionsColumn?: 'first' | 'last';
  positionCreatingRow?: 'bottom' | 'top' | number;
  positionExpandColumn?: 'first' | 'last';
  positionGlobalFilter?: 'left' | 'none' | 'right';
  positionPagination?: 'both' | 'bottom' | 'none' | 'top';
  positionToolbarAlertBanner?: 'bottom' | 'head-overlay' | 'none' | 'top';
  positionToolbarDropZone?: 'both' | 'bottom' | 'none' | 'top';
  renderBottomToolbar?:
    | ((props: { table: ST_TableInstance<TData> }) => ReactNode)
    | ReactNode;
  renderBottomToolbarCustomActions?: (props: {
    table: ST_TableInstance<TData>;
  }) => ReactNode;
  renderCaption?:
    | ((props: { table: ST_TableInstance<TData> }) => ReactNode)
    | ReactNode;
  renderCellActionMenuItems?: (props: {
    cell: ST_Cell<TData>;
    closeMenu: () => void;
    column: ST_Column<TData>;
    internalMenuItems: ReactNode[];
    row: ST_Row<TData>;
    staticColumnIndex?: number;
    staticRowIndex?: number;
    table: ST_TableInstance<TData>;
  }) => ReactNode[];
  renderColumnActionsMenuItems?: (props: {
    closeMenu: () => void;
    column: ST_Column<TData>;
    internalColumnMenuItems: ReactNode[];
    table: ST_TableInstance<TData>;
  }) => ReactNode[];
  renderColumnFilterModeMenuItems?: (props: {
    column: ST_Column<TData>;
    internalFilterOptions: ST_InternalFilterOption[];
    onSelectFilterMode: (filterMode: ST_FilterOption) => void;
    table: ST_TableInstance<TData>;
  }) => ReactNode[];
  renderCreateRowDialogContent?: (props: {
    internalEditComponents: ReactNode[];
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
  }) => ReactNode;
  renderDetailPanel?: (props: {
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
  }) => ReactNode;
  renderEditRowDialogContent?: (props: {
    internalEditComponents: ReactNode[];
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
  }) => ReactNode;
  renderEmptyRowsFallback?: (props: {
    table: ST_TableInstance<TData>;
  }) => ReactNode;
  renderGlobalFilterModeMenuItems?: (props: {
    internalFilterOptions: ST_InternalFilterOption[];
    onSelectFilterMode: (filterMode: ST_FilterOption) => void;
    table: ST_TableInstance<TData>;
  }) => ReactNode[];
  renderRowActionMenuItems?: (props: {
    closeMenu: () => void;
    row: ST_Row<TData>;
    staticRowIndex?: number;
    table: ST_TableInstance<TData>;
  }) => ReactNode[] | undefined;
  renderRowActions?: (props: {
    cell: ST_Cell<TData>;
    row: ST_Row<TData>;
    staticRowIndex?: number;
    table: ST_TableInstance<TData>;
  }) => ReactNode;
  renderToolbarAlertBannerContent?: (props: {
    groupedAlert: ReactNode | null;
    selectedAlert: ReactNode | null;
    table: ST_TableInstance<TData>;
  }) => ReactNode;
  renderToolbarInternalActions?: (props: {
    table: ST_TableInstance<TData>;
  }) => ReactNode;
  renderTopToolbar?:
    | ((props: { table: ST_TableInstance<TData> }) => ReactNode)
    | ReactNode;
  renderTopToolbarCustomActions?: (props: {
    table: ST_TableInstance<TData>;
  }) => ReactNode;
  rowNumberDisplayMode?: 'original' | 'static';
  rowPinningDisplayMode?:
    | 'bottom'
    | 'select-bottom'
    | 'select-sticky'
    | 'select-top'
    | 'sticky'
    | 'top'
    | 'top-and-bottom';
  rowVirtualizerInstanceRef?: RefObject<ST_RowVirtualizer | null>;
  rowVirtualizerOptions?:
    | ((props: {
        table: ST_TableInstance<TData>;
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>;
  selectAllMode?: 'all' | 'page';
  /**
   * Custom sorting functions, by name, on top of the built-in ones. A column's `sortFn` string resolves against this map.
   */
  sortFns?: Record<string, SortFn<ST_Features, TData>>;
  /**
   * Manage state externally any way you want, then pass it back into MRT.
   */
  state?: Partial<ST_TableState<TData>>;
}
