import { type ComponentPropsWithoutRef } from 'react';
import {
  type DivProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export interface SRT_TableHeadCellResizeHandleProps<TData extends SRT_RowData>
  extends DivProps {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

const resizeHandleVariants = cva(
  'absolute cursor-col-resize px-1 [&:active>hr]:bg-primary',
  {
    variants: {
      density: {
        compact: '',
        comfortable: '',
        spacious: '',
      },
      direction: {
        ltr: '',
        rtl: '',
      },
    },
    compoundVariants: [
      { density: 'compact', direction: 'ltr', class: '-mr-2' },
      { density: 'comfortable', direction: 'ltr', class: '-mr-4' },
      { density: 'spacious', direction: 'ltr', class: '-mr-6' },
      { density: 'compact', direction: 'rtl', class: '-ml-2' },
      { density: 'comfortable', direction: 'rtl', class: '-ml-4' },
      { density: 'spacious', direction: 'rtl', class: '-ml-6' },
    ],
    defaultVariants: {
      density: 'comfortable',
      direction: 'ltr',
    },
  },
);

export const SRT_TableHeadCellResizeHandle = <TData extends SRT_RowData>({
  header,
  table,
  ...rest
}: SRT_TableHeadCellResizeHandleProps<TData>) => {
  const {
    getState,
    options: { columnResizeDirection, columnResizeMode },
    setColumnSizingInfo,
  } = table;
  const { density } = getState();
  const { column } = header;

  const handler = header.getResizeHandler();

  const isResizing = column.getIsResizing();

  const isDisplay = column.columnDef.columnDefType === 'display';

  // lr: 4px for display columns else 0 → right-1/left-1 (4px) vs right-0/left-0.
  const positionClass =
    columnResizeDirection === 'rtl'
      ? isDisplay
        ? 'left-1'
        : 'left-0'
      : isDisplay
        ? 'right-1'
        : 'right-0';

  const activeOpacityClass =
    header.subHeaders.length || columnResizeMode === 'onEnd'
      ? '[&:active>hr]:opacity-100'
      : '[&:active>hr]:opacity-0';

  return (
    <div
      className={cn(
        'Srt-TableHeadCell-ResizeHandle-Wrapper',
        resizeHandleVariants({ density, direction: columnResizeDirection }),
        positionClass,
        activeOpacityClass,
      )}
      onDoubleClick={() => {
        setColumnSizingInfo((old) => ({
          ...old,
          isResizingColumn: false,
        }));
        column.resetSize();
      }}
      onMouseDown={handler}
      onTouchStart={handler}
      style={{
        transform:
          isResizing && columnResizeMode === 'onEnd'
            ? `translateX(${
                (columnResizeDirection === 'rtl' ? -1 : 1) *
                (getState().columnSizingInfo.deltaOffset ?? 0)
              }px)`
            : undefined,
      }}
    >
      <hr
        // Note: DivProps types ref as HTMLDivElement; the divider is an <hr>,
        // so the spread is cast to hr props (the accepted div<->hr deviation).
        {...(rest as ComponentPropsWithoutRef<'hr'>)}
        className={cn(
          'Srt-TableHeadCell-ResizeHandle-Divider',
          'z-[4] h-6 w-0 translate-x-[4px] touch-none select-none rounded-[2px] border-l-2 border-border',
          !isResizing && 'transition-all duration-150',
          rest.className,
        )}
      />
    </div>
  );
};
