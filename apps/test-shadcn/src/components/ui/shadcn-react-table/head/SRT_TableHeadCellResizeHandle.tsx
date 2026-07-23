import {
  type DivProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export interface SRT_TableHeadCellResizeHandleProps<TData extends SRT_RowData>
  extends DivProps {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

// SRT-owned grab wrapper. Active highlight + height + z live here via the
// child-combinator on the shadcn Separator (data-slot=separator); the Separator
// itself takes no restyling className. MUI info.main highlight → bg-primary.
const resizeHandleVariants = cva(
  'absolute z-[4] h-6 cursor-col-resize touch-none select-none px-1 [&:active>[data-slot=separator]]:bg-primary',
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
      ? '[&:active>[data-slot=separator]]:opacity-100'
      : '[&:active>[data-slot=separator]]:opacity-0';

  return (
    <div
      className={cn(
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
      <Separator
        orientation="vertical"
        // Note: rest is DivProps; Separator root is a div, so it spreads
        // directly (the prior hr cast is gone). MUI Divider borderRadius:2px /
        // borderWidth:2px / w-0 dropped — shadcn Separator's w-px bg-border wins.
        {...rest}
        className={cn(
          'translate-x-1',
          !isResizing && 'transition-all duration-150',
          rest.className,
        )}
      />
    </div>
  );
};
