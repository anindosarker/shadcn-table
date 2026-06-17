import { type CSSProperties } from 'react';
import {
  type SRT_Column,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  parseCSSVarId,
} from 'shadcn-react-table-core';

export const getSRT_CommonCellStyles = <TData extends SRT_RowData>({
  column,
  header,
  table,
}: {
  column: SRT_Column<TData>;
  header?: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}): CSSProperties => {
  const {
    options: { layoutMode },
  } = table;
  const { columnDef } = column;
  const id = parseCSSVarId(header?.id ?? column.id);
  const prefix = header ? 'header' : 'col';

  const widthStyles: CSSProperties = {
    minWidth: `max(calc(var(--${prefix}-${id}-size) * 1px), ${
      columnDef.minSize ?? 30
    }px)`,
    width: `calc(var(--${prefix}-${id}-size) * 1px)`,
  };

  if (layoutMode === 'grid') {
    widthStyles.flex = `${
      [0, false].includes(columnDef.grow!) ? 0 : `var(--${prefix}-${id}-size)`
    } 0 auto`;
  } else if (layoutMode === 'grid-no-grow') {
    widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`;
  }

  return widthStyles;
};
