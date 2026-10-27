import { type ComponentPropsWithRef, type ReactNode } from 'react';
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
import { type ST_AggregationFns } from '@/components/ui/shadcn-table/shared/fns/aggregationFns';
import { type ST_FilterFns } from '@/components/ui/shadcn-table/shared/fns/filterFns';
import { type ST_SortFns } from '@/components/ui/shadcn-table/shared/fns/sortFns';
import { type ST_Icons } from '@/components/ui/shadcn-table/icons';
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

/**
 * The props types of the shadcn parts that the part-prop options
 * (`stFilterCheckboxProps`, `stEditRowDialogProps`, ...) pass on, by part.
 * They resolve to this tree's parts, Radix UI or Base UI.
 */
export interface ST_PartPropTypes {
  checkbox: CheckboxProps;
  dialog: DialogProps;
  radio: RadioProps;
  slider: SliderProps;
}

/**
 * A part's props, tree-neutral: every tree's part props fit it. `object`, not
 * `Record<string, unknown>`: the parts' props types are interfaces, which have
 * no index signature.
 */
export type ST_PartProps = object;

/**
 * `ST_PartPropTypes` with every part tree-neutral. The feature-map
 * augmentation (stConfigFeature) and the table instance types (`table.options`,
 * `column.columnDef`) use it, so they stay identical across trees; the options
 * a user writes (`ST_TableOptions`, `ST_ColumnDef`) take this tree's
 * `ST_PartPropTypes`.
 */
export type ST_NeutralPartPropTypes = Record<
  keyof ST_PartPropTypes,
  ST_PartProps
>;

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
  options: ST_DefinedTableOptions<TData>;
};

export type ST_DefinedTableOptions<TData extends ST_RowData> = Omit<
  ST_TableOptions<TData, ST_NeutralPartPropTypes>,
  // Note: mrtTheme dropped project-wide (Conventions); theme tokens instead.
  'icons' | 'localization' // | 'mrtTheme'
> & {
  icons: ST_Icons;
  localization: ST_Localization;
  // mrtTheme: Required<ST_Theme>;
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

/**
 * The column members that pass props to a shadcn part, typed for `TParts`.
 */
type ST_ColumnDef_PartKeys = 'stFilterCheckboxProps' | 'stFilterSliderProps';

/**
 * A column definition. The ST-only members come from `stConfigFeature`; this
 * interface narrows the core members whose ST shape differs, and types the
 * part-prop members for `TParts` (this tree's parts by default).
 */
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
  aggregationFn?: Array<ST_AggregationFn<TData>> | ST_AggregationFn<TData>;
  columns?: ST_ColumnDef<TData, TValue, TParts>[];
  filterFn?: ST_FilterFn<TData>;
  /**
   * footer must be a string. If you want custom JSX to render the footer, you can also specify a `Footer` option. (Capital F)
   */
  footer?: string;
  /**
   * header must be a string. If you want custom JSX to render the header, you can also specify a `Header` option. (Capital H)
   */
  header: string;
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
  sortFn?: ST_SortFn<TData>;
}

export type ST_DisplayColumnDef<
  TData extends ST_RowData,
  TValue = unknown,
  TParts extends ST_NeutralPartPropTypes = ST_PartPropTypes,
> = Omit<ST_ColumnDef<TData, TValue, TParts>, 'accessorFn' | 'accessorKey'>;

export type ST_GroupColumnDef<TData extends ST_RowData> = ST_DisplayColumnDef<
  TData,
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

export type ST_AggregationOption = LiteralUnion<
  string & keyof typeof ST_AggregationFns
>;

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
 * The table options that pass props to a shadcn part or hold column defs that
 * do, typed for `TParts`.
 */
type ST_TableOptions_PartKeys =
  | 'defaultDisplayColumn'
  | 'displayColumnDefOptions'
  | 'stCreateRowModalProps'
  | 'stEditRowDialogProps'
  | 'stFilterCheckboxProps'
  | 'stFilterSliderProps'
  | 'stSelectAllCheckboxProps'
  | 'stSelectCheckboxProps';

/**
 * `columns` and `data` props are the only required props, but there are over 170 other optional props.
 *
 * See more info on creating columns and data on the official docs site:
 * @link https://shadcn-table.com/docs/getting-started/usage
 *
 * See the full props list on the official docs site:
 * @link https://shadcn-table.com/docs/api/table-options
 *
 * The part-prop members are typed for `TParts` (this tree's parts by default).
 */
export interface ST_TableOptions<
  TData extends ST_RowData,
  TParts extends ST_NeutralPartPropTypes = ST_PartPropTypes,
> extends Omit<
      Partial<TableOptions<ST_Features, TData>>,
      | 'columns'
      | 'data'
      | 'defaultColumn'
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
  columns: ST_ColumnDef<TData, any, TParts>[];
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
  defaultColumn?: Partial<ST_ColumnDef<TData, unknown, TParts>>;
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
  /**
   * Manage state externally any way you want, then pass it back into MRT.
   */
  state?: Partial<ST_TableState<TData>>;
}

export type ST_TableProviderProps<TData extends ST_RowData> = {
  children: ReactNode;
  table: ST_TableInstance<TData>;
};
