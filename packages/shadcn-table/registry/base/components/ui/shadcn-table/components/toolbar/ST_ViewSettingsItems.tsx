import { type ComponentType } from 'react';
import { useSelector } from '@tanstack/react-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type ST_DensityState,
  type ST_GridLinesState,
  type ST_IconProps,
  type ST_Icons,
  type ST_Localization,
  type ST_RowData,
  type ST_TableInstance,
  type ST_ViewSettingsItemId,
  type ST_ViewSettingsState,
} from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { ST_TooltipButton } from '@/components/ui/shadcn-table/components/buttons/ST_TooltipButton';
import { ST_ShowHideColumnsMenu } from '@/components/ui/shadcn-table/components/menus/ST_ShowHideColumnsMenu';

export type ST_ViewToggleId =
  | 'rowNumbers'
  | 'stickyHeader'
  | 'striped'
  | 'wrapText';

/** The view settings rows in panel and toolbar order. */
export const ST_VIEW_SETTINGS_ITEMS: readonly ST_ViewSettingsItemId[] = [
  'columns',
  'density',
  'wrapText',
  'gridLines',
  'stickyHeader',
  'striped',
  'rowNumbers',
];

export const ST_DENSITY_VALUES: readonly ST_DensityState[] = [
  'compact',
  'comfortable',
  'spacious',
];

export const ST_GRID_LINES_VALUES: readonly ST_GridLinesState[] = [
  'none',
  'rows',
  'columns',
  'all',
];

export const isViewToggle = (
  id: ST_ViewSettingsItemId,
): id is ST_ViewToggleId =>
  id === 'rowNumbers' ||
  id === 'stickyHeader' ||
  id === 'striped' ||
  id === 'wrapText';

/** The row label of a view settings item. */
export const getViewItemLabel = (
  id: ST_ViewSettingsItemId,
  localization: Required<ST_Localization>,
): string =>
  ({
    columns: localization.columns,
    density: localization.density,
    gridLines: localization.gridLines,
    rowNumbers: localization.rowNumbers,
    stickyHeader: localization.stickyHeader,
    striped: localization.alternatingRowColors,
    wrapText: localization.wrapCellText,
  })[id];

export const getDensityLabel = (
  density: ST_DensityState,
  localization: Required<ST_Localization>,
): string =>
  ({
    comfortable: localization.densityComfortable,
    compact: localization.densityCompact,
    spacious: localization.densitySpacious,
  })[density];

export const getGridLinesLabel = (
  gridLines: ST_GridLinesState,
  localization: Required<ST_Localization>,
): string =>
  ({
    all: localization.gridLinesAll,
    columns: localization.gridLinesColumns,
    none: localization.gridLinesNone,
    rows: localization.gridLinesRows,
  })[gridLines];

/** The icon for the item's current value, and that value as a key. */
const getViewItemIcon = ({
  density,
  icons,
  id,
  viewSettings,
}: {
  density: ST_DensityState;
  icons: ST_Icons;
  id: ST_ViewSettingsItemId;
  viewSettings: ST_ViewSettingsState;
}): [ComponentType<ST_IconProps>, string] => {
  switch (id) {
    case 'columns':
      return [icons.ViewColumnIcon, 'columns'];
    case 'density':
      return [
        density === 'compact'
          ? icons.DensitySmallIcon
          : density === 'comfortable'
            ? icons.DensityMediumIcon
            : icons.DensityLargeIcon,
        density,
      ];
    case 'gridLines':
      return [
        {
          all: icons.GridLinesAllIcon,
          columns: icons.GridLinesColumnsIcon,
          none: icons.GridLinesNoneIcon,
          rows: icons.GridLinesRowsIcon,
        }[viewSettings.gridLines],
        viewSettings.gridLines,
      ];
    case 'rowNumbers':
      return viewSettings.rowNumbers
        ? [icons.RowNumbersOnIcon, 'on']
        : [icons.RowNumbersOffIcon, 'off'];
    case 'stickyHeader':
      return viewSettings.stickyHeader
        ? [icons.StickyHeaderOnIcon, 'on']
        : [icons.StickyHeaderOffIcon, 'off'];
    case 'striped':
      return viewSettings.striped
        ? [icons.StripedOnIcon, 'on']
        : [icons.StripedOffIcon, 'off'];
    case 'wrapText':
      // The icon shows what a click does: wrap while off, single line while on.
      return viewSettings.wrapText
        ? [icons.SingleLineIcon, 'on']
        : [icons.WrapTextIcon, 'off'];
  }
};

/**
 * The item's icon for its current value, keyed by the value so a change
 * plays the swap animation.
 */
export const ST_ViewItemIcon = <TData extends ST_RowData>({
  className,
  id,
  table,
}: {
  className?: string;
  id: ST_ViewSettingsItemId;
  table: ST_TableInstance<TData>;
}) => {
  const viewSettings = useSelector(table.atoms.viewSettings);
  const density = useSelector(table.atoms.density);
  const [Icon, value] = getViewItemIcon({
    density,
    icons: table.options.icons,
    id,
    viewSettings,
  });
  return (
    <Icon
      className={cn(
        'animate-in fade-in zoom-in-75 duration-200 motion-reduce:animate-none',
        className,
      )}
      key={value}
    />
  );
};

/**
 * Sets a view settings switch. Row numbers also pin the `#` column to the
 * start while on.
 */
export const setViewToggle = <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
  id: ST_ViewToggleId,
  value: boolean,
) => {
  table.setViewSettings((old) => ({ ...old, [id]: value }));
  if (id !== 'rowNumbers') return;
  const rowNumbersId = 'st-row-numbers';
  table.setColumnPinning(({ end = [], start = [] }) => ({
    end: end.filter((columnId) => columnId !== rowNumbersId),
    start: value
      ? [rowNumbersId, ...start.filter((columnId) => columnId !== rowNumbersId)]
      : start.filter((columnId) => columnId !== rowNumbersId),
  }));
};

const nextValue = <T,>(values: readonly T[], value: T): T =>
  values[(values.indexOf(value) + 1) % values.length];

/** The view settings items pinned to the toolbar, as icon buttons in list order. */
export const ST_ViewSettingsItems = <TData extends ST_RowData>({
  table,
}: {
  table: ST_TableInstance<TData>;
}) => {
  const { localization } = table.options;
  const viewSettings = useSelector(table.atoms.viewSettings);
  const density = useSelector(table.atoms.density);

  return ST_VIEW_SETTINGS_ITEMS.filter((id) =>
    viewSettings.pins.includes(id),
  ).map((id) => {
    const label = getViewItemLabel(id, localization);
    if (id === 'columns') {
      return (
        <ST_ShowHideColumnsMenu
          key={id}
          trigger={
            <ST_TooltipButton
              aria-haspopup="menu"
              aria-label={localization.showHideColumns}
              size="icon"
              tooltip={localization.showHideColumns}
              type="button"
              variant="ghost"
            >
              <ST_ViewItemIcon id={id} table={table} />
            </ST_TooltipButton>
          }
        />
      );
    }
    if (isViewToggle(id)) {
      const on = viewSettings[id];
      return (
        <ST_Tooltip
          key={id}
          title={id === 'wrapText' && on ? localization.singleLineCells : label}
        >
          <Button
            aria-label={label}
            aria-pressed={on}
            onClick={() => setViewToggle(table, id, !on)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ST_ViewItemIcon id={id} table={table} />
          </Button>
        </ST_Tooltip>
      );
    }
    const isDensity = id === 'density';
    return (
      <ST_Tooltip
        key={id}
        title={`${label}: ${
          isDensity
            ? getDensityLabel(density, localization)
            : getGridLinesLabel(viewSettings.gridLines, localization)
        }`}
      >
        <Button
          aria-label={isDensity ? localization.toggleDensity : label}
          onClick={() =>
            isDensity
              ? table.setDensity(nextValue(ST_DENSITY_VALUES, density))
              : table.setViewSettings((old) => ({
                  ...old,
                  gridLines: nextValue(ST_GRID_LINES_VALUES, old.gridLines),
                }))
          }
          size="icon"
          type="button"
          variant="ghost"
        >
          <ST_ViewItemIcon id={id} table={table} />
        </Button>
      </ST_Tooltip>
    );
  });
};
