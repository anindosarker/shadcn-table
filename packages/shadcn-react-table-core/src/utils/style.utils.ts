import { type CSSProperties } from 'react';
import {
  type SRT_Column,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';

export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

export const getSRTPinnedCellStyles = <TData extends SRT_RowData>({
  column,
}: {
  column: SRT_Column<TData>;
  table: SRT_TableInstance<TData>;
}): CSSProperties => {
  const isPinned = column.getIsPinned();

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    position: 'sticky',
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
  };
};

export const getSRTCellWidthStyles = <TData extends SRT_RowData>({
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

  const widthStyles: CSSProperties = {
    minWidth: `max(calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId(
      header?.id ?? column.id,
    )}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
    width: `calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId(
      header?.id ?? column.id,
    )}-size) * 1px)`,
  };

  if (layoutMode === 'grid') {
    widthStyles.flex = `${
      [0, false].includes(columnDef.grow!)
        ? 0
        : `var(--${header ? 'header' : 'col'}-${parseCSSVarId(
            header?.id ?? column.id,
          )}-size)`
    } 0 auto`;
  } else if (layoutMode === 'grid-no-grow') {
    widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`;
  }

  return widthStyles;
};

export type SRT_TooltipSide = 'bottom' | 'left' | 'right' | 'top';

export type SRT_CommonTooltipProps = {
  delayDuration: number;
  side?: SRT_TooltipSide;
};

export const getCommonTooltipProps = (
  side?: SRT_TooltipSide,
): SRT_CommonTooltipProps => ({
  delayDuration: 1000,
  side,
});
