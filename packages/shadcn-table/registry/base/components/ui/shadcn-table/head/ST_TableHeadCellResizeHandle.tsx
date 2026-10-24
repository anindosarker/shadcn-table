import { cva } from 'class-variance-authority';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';

export interface ST_TableHeadCellResizeHandleProps<TData extends ST_RowData>
  extends React.ComponentProps<typeof Separator> {
  header: ST_Header<TData>;
  table: ST_TableInstance<TData>;
}

const resizeHandleVariants = cva(
  'absolute cursor-col-resize px-1 [&:active>[data-slot=separator]]:bg-primary',
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
      display: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { density: 'compact', direction: 'ltr', class: '-mr-2' },
      { density: 'comfortable', direction: 'ltr', class: '-mr-4' },
      { density: 'spacious', direction: 'ltr', class: '-mr-6' },
      { density: 'compact', direction: 'rtl', class: '-ml-2' },
      { density: 'comfortable', direction: 'rtl', class: '-ml-4' },
      { density: 'spacious', direction: 'rtl', class: '-ml-6' },
      { direction: 'ltr', display: true, class: 'right-1' },
      { direction: 'ltr', display: false, class: 'right-0' },
      { direction: 'rtl', display: true, class: 'left-1' },
      { direction: 'rtl', display: false, class: 'left-0' },
    ],
  },
);

export const ST_TableHeadCellResizeHandle = <TData extends ST_RowData>({
  header,
  table,
  ...rest
}: ST_TableHeadCellResizeHandleProps<TData>) => {
  const {
    options: { columnResizeDirection, columnResizeMode },
    setColumnResizing,
  } = table;
  const { density } = table.state;
  const { column } = header;

  const handler = header.getResizeHandler();

  return (
    <div
      className={cn(
        resizeHandleVariants({
          density,
          direction: columnResizeDirection,
          display: column.columnDef.columnDefType === 'display',
        }),
        header.subHeaders.length || columnResizeMode === 'onEnd'
          ? '[&:active>[data-slot=separator]]:opacity-100'
          : '[&:active>[data-slot=separator]]:opacity-0',
      )}
      onDoubleClick={() => {
        setColumnResizing((old) => ({
          ...old,
          isResizingColumn: false,
        }));
        column.resetSize();
      }}
      onMouseDown={handler}
      onTouchStart={handler}
      style={{
        transform:
          column.getIsResizing() && columnResizeMode === 'onEnd'
            ? `translateX(${
                (columnResizeDirection === 'rtl' ? -1 : 1) *
                (table.state.columnResizing.deltaOffset ?? 0)
              }px)`
            : undefined,
      }}
    >
      <Separator
        // flexItem
        // Note: MUI-only prop; the wrapper is not a flex container, so it had no effect.
        orientation="vertical"
        className={cn(
          'z-[4] translate-x-1 touch-none select-none rounded-xs data-[orientation=vertical]:h-6 data-[orientation=vertical]:w-1',
          !column.getIsResizing() && 'transition-all duration-150 ease-in-out',
          rest.className,
        )}
      />
    </div>
  );
};
