import {
  type SRT_ColumnDef,
  type SRT_RowData,
  type SRT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

/**
 * BOUNDARY NOTE (MRT -> SRT deviation):
 * MRT's getMRT_RowExpandColumnDef builds `Cell`/`Header` from presentational components
 * (`MRT_ExpandButton`, `MRT_ExpandAllButton`) plus a MUI `Stack`/`Tooltip` layout for the
 * grouped (`groupedColumnMode === 'remove'`) case. Those components live in the app layer,
 * not the headless core, so the core cannot import them. The core therefore emits only the
 * headless column definition (id `mrt-row-expand`, size). The app's body/head cell renderers
 * dispatch on the `mrt-row-expand` id to render the expand button, the grouped-row label, and
 * the expand-all header — reproducing MRT's Cell/Header behavior in the component layer.
 *
 * The size heuristic (grouped/detail-panel/expand-all) is preserved here since it is
 * headless metadata.
 */
export const getSRT_RowExpandColumnDef = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): SRT_ColumnDef<TData> => {
  const {
    defaultColumn,
    enableExpandAll,
    groupedColumnMode,
    renderDetailPanel,
  } = tableOptions;

  return {
    ...defaultDisplayColumnProps({
      header: 'expand',
      id: 'mrt-row-expand',
      size:
        groupedColumnMode === 'remove'
          ? (defaultColumn?.size ?? 180)
          : renderDetailPanel
            ? enableExpandAll
              ? 60
              : 70
            : 100,
      tableOptions,
    }),
  };
};
