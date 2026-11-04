import {
  type ComponentType,
  createElement,
  isValidElement,
  type ReactNode,
} from 'react';
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui-base/combobox';
import { cn } from '@/lib/utils';
import {
  type ST_Column,
  type ST_IconProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-base/shadcn-table/types';
import { getColumnLabel } from '@/components/ui-base/shadcn-table/shared/utils/filterSummary.utils';

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
  const ids = columns.map((column) => column.id);
  const byId = new Map(columns.map((column) => [column.id, column]));
  const labelFor = (id: string) => {
    const column = byId.get(id);
    return column ? getColumnLabel(column) : id;
  };

  return (
    <>
      <Combobox
        autoHighlight
        inline
        itemToStringLabel={labelFor}
        items={ids}
        onValueChange={(id: string | null) => {
          const column = id ? byId.get(id) : undefined;
          if (column) onPick(column);
        }}
        open
        value={null}
      >
        <ComboboxInput
          autoFocus
          className="m-1 shrink-0"
          placeholder={placeholder}
          showTrigger={false}
        />
        <ComboboxEmpty className="py-4 text-xs">
          {localization.noColumns}
        </ComboboxEmpty>
        <ComboboxList className="max-h-none min-h-0 flex-1">
          {(id: string) => {
            const column = byId.get(id);
            return (
              <ComboboxItem key={id} value={id}>
                {column && <ST_ColumnIcon column={column} />}
                {labelFor(id)}
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </Combobox>
      {trailing}
    </>
  );
};
