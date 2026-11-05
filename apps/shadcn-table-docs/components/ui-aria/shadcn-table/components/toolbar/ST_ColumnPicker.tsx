import {
  type ComponentType,
  createElement,
  isValidElement,
  type ReactNode,
} from 'react';
import { Autocomplete, TextField, useFilter } from 'react-aria-components';
import { ComboboxItem, ComboboxList } from '@/components/ui-aria/combobox';
import { InputGroup, InputGroupInput } from '@/components/ui-aria/input-group';
import { cn } from '@/lib/utils';
import {
  type ST_Column,
  type ST_IconProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-aria/shadcn-table/types';
import { getColumnLabel } from '@/components/ui-aria/shadcn-table/shared/utils/filterSummary.utils';

export interface ST_ColumnPickerProps<TData extends ST_RowData> {
  readonly columns: readonly ST_Column<TData>[];
  readonly onPick: (column: ST_Column<TData>) => void;
  readonly placeholder: string;
  readonly table: ST_TableInstance<TData>;
  /** Rendered under the list, such as a "Delete all filters" action. */
  readonly trailing?: ReactNode;
}

/** The column's `columnDef.icon`, or nothing when it has none. */
export const ST_ColumnIcon = <TData extends ST_RowData>({
  className,
  column,
}: {
  className?: string;
  column: ST_Column<TData>;
}) => {
  const { icon } = column.columnDef;
  if (icon === undefined || icon === null || typeof icon === 'boolean') {
    return null;
  }
  if (
    isValidElement(icon) ||
    typeof icon === 'string' ||
    typeof icon === 'number'
  ) {
    return <>{icon}</>;
  }
  return createElement(icon as ComponentType<ST_IconProps>, {
    'aria-hidden': true,
    className: cn('size-3.5 shrink-0 text-muted-foreground', className),
  });
};

/**
 * A searchable column list rendered inline, for a popover with
 * `gap-0 overflow-hidden p-0` and a maximum height.
 */
export const ST_ColumnPicker = <TData extends ST_RowData>({
  columns,
  onPick,
  placeholder,
  table,
  trailing,
}: ST_ColumnPickerProps<TData>) => {
  const { localization } = table.options;
  const { contains } = useFilter({ sensitivity: 'base' });
  const items = columns.map((column) => ({
    column,
    id: column.id,
    label: getColumnLabel(column),
  }));

  return (
    <>
      <Autocomplete filter={contains}>
        <TextField aria-label={placeholder} autoFocus className="m-1 shrink-0">
          <InputGroup>
            <InputGroupInput placeholder={placeholder} />
          </InputGroup>
        </TextField>
        <ComboboxList
          aria-label={placeholder}
          className="max-h-none min-h-0 flex-1"
          items={items}
          onAction={(key) => {
            const item = items.find((candidate) => candidate.id === key);
            if (item) onPick(item.column);
          }}
          renderEmptyState={() => (
            <div className="py-4 text-center text-xs text-muted-foreground">
              {localization.noColumns}
            </div>
          )}
        >
          {(item) => (
            <ComboboxItem id={item.id} textValue={item.label}>
              <ST_ColumnIcon column={item.column} />
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </Autocomplete>
      {trailing}
    </>
  );
};
