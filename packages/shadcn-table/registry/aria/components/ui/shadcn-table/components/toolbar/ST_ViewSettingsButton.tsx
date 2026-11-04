import { useSelector } from '@tanstack/react-store';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  type ST_DensityState,
  type ST_GridLinesState,
  type ST_RowData,
  type ST_TableInstance,
  type ST_ViewSettingsItemId,
} from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { ST_ShowHideColumnsMenu } from '@/components/ui/shadcn-table/components/menus/ST_ShowHideColumnsMenu';
import {
  getDensityLabel,
  getGridLinesLabel,
  getViewItemLabel,
  getViewSettingsItems,
  isViewToggle,
  ST_DENSITY_VALUES,
  ST_GRID_LINES_VALUES,
  setViewToggle,
  ST_ViewItemIcon,
} from '@/components/ui/shadcn-table/components/toolbar/ST_ViewSettingsItems';
import { resetST_View } from '@/components/ui/shadcn-table/hooks/useST_ViewPersistence';

const ST_ViewSettingsControl = <TData extends ST_RowData>({
  id,
  label,
  table,
}: {
  id: ST_ViewSettingsItemId;
  label: string;
  table: ST_TableInstance<TData>;
}) => {
  const {
    icons: { ChevronRightIcon },
    localization,
  } = table.options;
  const viewSettings = useSelector(table.atoms.viewSettings);
  const density = useSelector(table.atoms.density);
  useSelector(table.atoms.columnVisibility);

  if (id === 'columns') {
    const shown = table
      .getAllLeafColumns()
      .filter(
        (column) =>
          column.columnDef.columnDefType !== 'display' && column.getIsVisible(),
      ).length;
    return (
      <ST_ShowHideColumnsMenu
        trigger={
          <Button aria-label={label} size="sm" type="button" variant="ghost">
            {localization.columnsShown.replace('{n}', `${shown}`)}
            <ChevronRightIcon className="rtl:rotate-180" />
          </Button>
        }
      />
    );
  }
  if (id === 'density') {
    return (
      <Select
        aria-label={label}
        onChange={(key) => {
          if (key !== null) table.setDensity(key as ST_DensityState);
        }}
        value={density}
      >
        <SelectTrigger aria-label={label} size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent placement="bottom end">
          {ST_DENSITY_VALUES.map((value) => (
            <SelectItem id={value} key={value}>
              {getDensityLabel(value, localization)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  if (id === 'gridLines') {
    return (
      <Select
        aria-label={label}
        onChange={(key) => {
          if (key === null) return;
          table.setViewSettings((old) => ({
            ...old,
            gridLines: key as ST_GridLinesState,
          }));
        }}
        value={viewSettings.gridLines}
      >
        <SelectTrigger aria-label={label} size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent placement="bottom end">
          {ST_GRID_LINES_VALUES.map((value) => (
            <SelectItem id={value} key={value}>
              {getGridLinesLabel(value, localization)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  if (!isViewToggle(id)) return null;
  return (
    <Switch
      aria-label={label}
      isSelected={viewSettings[id]}
      onChange={(checked) => setViewToggle(table, id, checked)}
      size="sm"
    />
  );
};

/**
 * The view settings button and panel: one row per setting with a pin
 * toggle that places it in the toolbar, and "Reset view".
 */
export const ST_ViewSettingsButton = <TData extends ST_RowData>({
  table,
}: {
  table: ST_TableInstance<TData>;
}) => {
  const {
    icons: { PushPinIcon, PushPinOffIcon, RestartAltIcon, SettingsIcon },
    localization,
  } = table.options;
  const pins = useSelector(table.atoms.viewSettings, (state) => state.pins);

  return (
    <PopoverTrigger>
      <ST_Tooltip title={localization.viewSettings}>
        <Button
          aria-label={localization.viewSettings}
          size="icon"
          type="button"
          variant="ghost"
        >
          <SettingsIcon />
        </Button>
      </ST_Tooltip>
      <Popover placement="bottom end" className="w-80 gap-0 p-1" offset={8}>
        {getViewSettingsItems(table).map((id) => {
          const label = getViewItemLabel(id, localization);
          const pinned = pins.includes(id);
          const pinLabel = pinned
            ? localization.unpinFromToolbar
            : localization.pinToToolbar;
          return (
            <div
              className="flex min-h-9 items-center gap-2 ps-2"
              data-view-setting={id}
              key={id}
            >
              <ST_ViewItemIcon
                className="size-4 shrink-0 text-muted-foreground"
                id={id}
                table={table}
              />
              <span className="flex-1 text-sm">{label}</span>
              <ST_ViewSettingsControl id={id} label={label} table={table} />
              <ST_Tooltip title={pinLabel}>
                <Button
                  aria-label={`${pinLabel}: ${label}`}
                  aria-pressed={pinned}
                  onClick={() =>
                    table.setViewSettings((old) => ({
                      ...old,
                      pins: old.pins.includes(id)
                        ? old.pins.filter((pin) => pin !== id)
                        : [...old.pins, id],
                    }))
                  }
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  {pinned ? (
                    <PushPinIcon
                      className="animate-in fade-in zoom-in-75 duration-200 motion-reduce:animate-none"
                      key="pinned"
                    />
                  ) : (
                    <PushPinOffIcon
                      className="animate-in fade-in zoom-in-75 duration-200 motion-reduce:animate-none"
                      key="unpinned"
                    />
                  )}
                </Button>
              </ST_Tooltip>
            </div>
          );
        })}
        <Separator className="my-1" />
        <Button
          className="justify-start"
          onClick={() => resetST_View(table)}
          type="button"
          variant="ghost"
        >
          <RestartAltIcon />
          {localization.resetView}
        </Button>
      </Popover>
    </PopoverTrigger>
  );
};
