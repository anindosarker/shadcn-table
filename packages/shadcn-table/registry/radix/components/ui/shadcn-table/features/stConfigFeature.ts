// stConfigFeature: a runtime no-op that carries the ST-only table options and
// column-def members with no state slice of their own, merged into core's
// TableOptions and ColumnDef through TableOptions_FeatureMap and
// ColumnDef_FeatureMap. The on*Change handlers live in their owning features.
import { type ReactNode, type RefObject } from 'react';
import {
  type CellData,
  type DeepKeys,
  type RowData,
  type TableFeature,
  type TableFeatures,
} from '@tanstack/react-table';
import { type VirtualizerOptions } from '@tanstack/react-virtual';
import {
  type ButtonProps,
  type CheckboxProps,
  type DialogProps,
  type DivProps,
  type DropdownOption,
  type InputProps,
  type LiteralUnion,
  type RadioProps,
  type SelectProps,
  type SliderProps,
  type ST_AggregationFn,
  type ST_Cell,
  type ST_CircularProgressProps,
  type ST_Column,
  type ST_ColumnVirtualizer,
  type ST_DisplayColumnDef,
  type ST_DisplayColumnIds,
  type ST_FilterFn,
  type ST_FilterOption,
  type ST_Header,
  type ST_HeaderGroup,
  type ST_Icons,
  type ST_InternalFilterOption,
  type ST_LinearProgressProps,
  type ST_Localization,
  type ST_PaginationProps,
  type ST_Row,
  type ST_RowData,
  type ST_RowVirtualizer,
  type ST_SortFn,
  type ST_TableInstance,
  type TableBodyProps,
  type TableCellProps,
  type TableFooterProps,
  type TableHeadProps,
  type TableProps,
  type TableRowProps,
} from '@/components/ui/shadcn-table/types';

export const stConfigFeature: TableFeature = {};

declare module '@tanstack/react-table' {
  interface Plugins {
    stConfigFeature: TableFeature;
  }
  interface TableOptions_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- merging needs core's type parameter list; the ST_ types fix ST_Features
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stConfigFeature: ST_TableOptions_Config<TData>;
  }
  interface ColumnDef_FeatureMap<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- merging needs core's type parameter list; the ST_ types fix ST_Features
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData,
  > {
    stConfigFeature: ST_ColumnDef_Config<TData, TValue>;
  }
}

export interface ST_TableOptions_Config<TData extends ST_RowData> {
  /**
   * Custom aggregation functions, by name, on top of the built-in ones. A column's `aggregationFn` string resolves against this map.
   */
  aggregationFns?: Record<string, Exclude<ST_AggregationFn<TData>, string>>;
  columnFilterDisplayMode?: 'custom' | 'popover' | 'subheader';
  columnFilterModeOptions?: Array<
    LiteralUnion<string & ST_FilterOption>
  > | null;
  columnVirtualizerInstanceRef?: RefObject<ST_ColumnVirtualizer | null>;
  columnVirtualizerOptions?:
    | ((props: {
        table: ST_TableInstance<TData>;
      }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>)
    | Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>;
  createDisplayMode?: 'custom' | 'modal' | 'row';
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
  enableEditing?: ((row: ST_Row<TData>) => boolean) | boolean;
  enableExpandAll?: boolean;
  enableFacetedValues?: boolean;
  enableFilterMatchHighlighting?: boolean;
  enableGlobalFilterModes?: boolean;
  enableGlobalFilterRankedResults?: boolean;
  enableKeyboardShortcuts?: boolean;
  enablePagination?: boolean;
  enableRowActions?: boolean;
  enableRowDragging?: boolean;
  enableRowNumbers?: boolean;
  enableRowOrdering?: boolean;
  enableRowVirtualization?: boolean;
  enableSelectAll?: boolean;
  enableStickyFooter?: boolean;
  enableStickyHeader?: boolean;
  enableTableFooter?: boolean;
  enableTableHead?: boolean;
  enableToolbarInternalActions?: boolean;
  enableTopToolbar?: boolean;
  /**
   * Custom filter functions, by name, on top of the built-in ones. A column's `filterFn` string and `globalFilterFn` resolve against this map.
   */
  filterFns?: Record<string, Exclude<ST_FilterFn<TData>, string>>;
  globalFilterModeOptions?: ST_FilterOption[] | null;
  icons?: Partial<ST_Icons>;
  id?: string;
  /**
   * Changes which kind of CSS layout is used to render the table. `semantic` uses default semantic HTML elements, while `grid` adds CSS grid and flexbox styles
   */
  layoutMode?: 'grid' | 'grid-no-grow' | 'semantic';
  /**
   * Pass in either a locale imported from `@/components/ui/shadcn-table/shared/locales/*` or a custom locale object.
   *
   * See the localization (i18n) guide for more info:
   * @link https://shadcn-table.com/docs/guides/localization
   */
  localization?: Partial<ST_Localization>;
  // Note: mrtTheme dropped project-wide (Conventions); theme tokens instead.
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
  onCreatingRowCancel?: (props: {
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
  }) => void;
  onCreatingRowSave?: (props: {
    exitCreatingMode: () => void;
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- edited values are user data of any shape, as in ST_TableOptions
    values: Record<LiteralUnion<string & DeepKeys<TData>>, any>;
  }) => Promise<void> | void;
  onEditingRowCancel?: (props: {
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
  }) => void;
  onEditingRowSave?: (props: {
    exitEditingMode: () => void;
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- edited values are user data of any shape, as in ST_TableOptions
    values: Record<LiteralUnion<string & DeepKeys<TData>>, any>;
  }) => Promise<void> | void;
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
  sortFns?: Record<string, Exclude<ST_SortFn<TData>, string>>;
}

export interface ST_ColumnDef_Config<
  TData extends ST_RowData,
  TValue = unknown,
> {
  AggregatedCell?: (props: {
    cell: ST_Cell<TData, TValue>;
    column: ST_Column<TData, TValue>;
    row: ST_Row<TData>;
    table: ST_TableInstance<TData>;
    staticColumnIndex?: number;
    staticRowIndex?: number;
  }) => ReactNode;
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
   * The lowercase `cell` template of core is not rendered; use the capital `Cell` slot instead.
   * Narrowed to `never` so passing it is a type error.
   */
  cell?: never;
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
  visibleInShowHideMenu?: boolean;
}
