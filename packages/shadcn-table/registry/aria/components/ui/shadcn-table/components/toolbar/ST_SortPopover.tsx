import { useState } from 'react';
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
import { cn } from '@/lib/utils';
import {
  type ST_Column,
  type ST_RowData,
  type ST_SortingState,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { getColumnLabel } from '@/components/ui/shadcn-table/shared/utils/filterSummary.utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { ST_ColumnPicker } from '@/components/ui/shadcn-table/components/toolbar/ST_ColumnPicker';

const pickerClassName = 'max-h-96 w-65 gap-0 overflow-hidden p-0';

export interface ST_SortPopoverProps<TData extends ST_RowData> {
  table: ST_TableInstance<TData>;
  /** `button` sits in the toolbar group; `chip` shows the sorts in the chip row and renders only while one exists. */
  variant?: 'button' | 'chip';
}

const moveRule = (
  sorting: ST_SortingState,
  from: number,
  to: number,
): ST_SortingState => {
  const next = [...sorting];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

/**
 * The sort editor: one row per sort rule with a drag handle, a column and a
 * direction select and a remove button, plus "Add sort" and "Delete sort".
 * With no sort it opens the column picker instead.
 */
export const ST_SortPopover = <TData extends ST_RowData>({
  table,
  variant = 'button',
}: ST_SortPopoverProps<TData>) => {
  const {
    options: {
      enableMultiSort,
      icons: {
        AddIcon,
        CloseIcon,
        DeleteIcon,
        DragHandleIcon,
        ExpandMoreIcon,
        SwapVertIcon,
      },
      localization,
    },
  } = table;
  const sorting = useSelector(table.atoms.sorting);
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const sortableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanSort());
  const labelFor = (id: string) => {
    const column = sortableColumns.find((candidate) => candidate.id === id);
    return column ? getColumnLabel(column) : id;
  };
  const unusedColumns = sortableColumns.filter(
    (column) => !sorting.some((rule) => rule.id === column.id),
  );
  const canAddSort = enableMultiSort !== false && unusedColumns.length > 0;

  const addSort = (column: ST_Column<TData>) =>
    table.setSorting((old) => [...old, { desc: false, id: column.id }]);
  const updateRule = (index: number, patch: { desc?: boolean; id?: string }) =>
    table.setSorting((old) =>
      old.map((rule, i) => (i === index ? { ...rule, ...patch } : rule)),
    );
  const removeRule = (index: number) =>
    table.setSorting((old) => old.filter((_, i) => i !== index));
  const endDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  if (variant === 'chip' && !sorting.length) return null;

  const trigger =
    variant === 'chip' ? (
      <Button className="max-w-55" size="sm" type="button" variant="secondary">
        <SwapVertIcon />
        <span className="truncate">
          {sorting.length === 1
            ? labelFor(sorting[0].id)
            : localization.sortsCount.replace('{n}', `${sorting.length}`)}
        </span>
        <ExpandMoreIcon />
      </Button>
    ) : (
      <ST_Tooltip title={localization.sort}>
        <Button
          aria-label={localization.sort}
          size="icon"
          type="button"
          variant={sorting.length > 0 ? 'secondary' : 'ghost'}
        >
          <SwapVertIcon />
        </Button>
      </ST_Tooltip>
    );

  const placement = variant === 'button' ? 'bottom end' : 'bottom start';

  return (
    <PopoverTrigger isOpen={open} onOpenChange={setOpen}>
      {trigger}
      {!sorting.length ? (
        <Popover placement={placement} className={pickerClassName} offset={8}>
          <ST_ColumnPicker
            columns={unusedColumns}
            onPick={addSort}
            placeholder={localization.sortBy}
            table={table}
          />
        </Popover>
      ) : (
        <Popover placement={placement} className="w-80" offset={8}>
          <ul className="flex flex-col gap-1">
            {sorting.map((rule, index) => {
              const columnOptions = sortableColumns.filter(
                (column) =>
                  column.id === rule.id ||
                  !sorting.some((other) => other.id === column.id),
              );
              return (
                <li
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-1 py-0.5',
                    dragIndex === index && 'opacity-50',
                    overIndex === index &&
                      dragIndex !== null &&
                      dragIndex !== index &&
                      'bg-muted',
                  )}
                  data-sort-rule={rule.id}
                  key={rule.id}
                  onDragEnd={endDrag}
                  onDragOver={(event) => {
                    if (dragIndex === null) return;
                    event.preventDefault();
                    setOverIndex(index);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (dragIndex !== null && dragIndex !== index) {
                      table.setSorting((old) =>
                        moveRule(old, dragIndex, index),
                      );
                    }
                    endDrag();
                  }}
                >
                  <span
                    aria-label={localization.dragToReorder}
                    className="flex cursor-grab items-center text-muted-foreground/60 hover:text-muted-foreground active:cursor-grabbing"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', String(index));
                      setDragIndex(index);
                    }}
                    role="img"
                  >
                    <DragHandleIcon className="size-3.5" />
                  </span>
                  <Select
                    aria-label={localization.sortBy}
                    className="min-w-0 flex-1"
                    onChange={(key) => {
                      if (typeof key === 'string')
                        updateRule(index, { id: key });
                    }}
                    value={rule.id}
                  >
                    <SelectTrigger
                      aria-label={localization.sortBy}
                      className="w-full min-w-0 text-xs"
                      size="sm"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {columnOptions.map((column) => (
                        <SelectItem id={column.id} key={column.id}>
                          {getColumnLabel(column)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    aria-label={labelFor(rule.id)}
                    onChange={(key) => {
                      if (key !== null)
                        updateRule(index, { desc: key === 'desc' });
                    }}
                    value={rule.desc ? 'desc' : 'asc'}
                  >
                    <SelectTrigger
                      aria-label={labelFor(rule.id)}
                      className="w-29.5 text-xs"
                      size="sm"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem id="asc">{localization.ascending}</SelectItem>
                      <SelectItem id="desc">
                        {localization.descending}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    aria-label={localization.removeSortOn.replace(
                      '{column}',
                      labelFor(rule.id),
                    )}
                    onClick={() => removeRule(index)}
                    size="icon-xs"
                    type="button"
                    variant="ghost"
                  >
                    <CloseIcon />
                  </Button>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col gap-0.5">
            {canAddSort && (
              <PopoverTrigger isOpen={addOpen} onOpenChange={setAddOpen}>
                <Button
                  className="justify-start"
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <AddIcon />
                  {localization.addSort}
                </Button>
                <Popover
                  placement="bottom start"
                  className={pickerClassName}
                  offset={8}
                >
                  <ST_ColumnPicker
                    columns={unusedColumns}
                    onPick={(column) => {
                      setAddOpen(false);
                      addSort(column);
                    }}
                    placeholder={localization.sortBy}
                    table={table}
                  />
                </Popover>
              </PopoverTrigger>
            )}
            <Button
              className="justify-start"
              onClick={() => {
                table.setSorting([]);
                setOpen(false);
              }}
              size="sm"
              type="button"
              variant="ghost"
            >
              <DeleteIcon />
              {localization.deleteSort}
            </Button>
          </div>
        </Popover>
      )}
    </PopoverTrigger>
  );
};
