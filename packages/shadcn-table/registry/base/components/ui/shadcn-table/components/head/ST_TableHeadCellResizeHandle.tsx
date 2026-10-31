import { cva } from 'class-variance-authority';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  type ST_Header,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';

export interface ST_TableHeadCellResizeHandleProps<TData extends ST_RowData>
  extends React.ComponentProps<typeof Separator> {
  header: ST_Header<TData>;
}

const resizeHandleVariants = cva(
  'absolute cursor-col-resize px-1 [&:active>[data-slot=separator]]:bg-primary',
  {
    variants: {
      density: {
        compact: '-me-2',
        comfortable: '-me-4',
        spacious: '-me-6',
      },
      display: {
        true: 'inset-e-1',
        false: 'inset-e-0',
      },
    },
  },
);

export const ST_TableHeadCellResizeHandle = <TData extends ST_RowData>({
  header,
  ...rest
}: ST_TableHeadCellResizeHandleProps<TData>) => {
  const table = header.table;
  const {
    options: { columnResizeDirection, columnResizeMode },
    setColumnResizing,
  } = table;
  const { column } = header;

  const handler = header.getResizeHandler();

  // Only the handle being dragged follows the drag offset.
  return (
    <table.Subscribe
      selector={(state) => {
        const isResizing = state.columnResizing.isResizingColumn === column.id;
        return {
          deltaOffset: isResizing ? state.columnResizing.deltaOffset : null,
          density: state.density,
          isResizing,
        };
      }}
    >
      {({ deltaOffset, density, isResizing }) => (
        <div
          className={cn(
            resizeHandleVariants({
              density,
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
              isResizing && columnResizeMode === 'onEnd'
                ? `translateX(${
                    (columnResizeDirection === 'rtl' ? -1 : 1) *
                    (deltaOffset ?? 0)
                  }px)`
                : undefined,
          }}
        >
          {/* Base UI and Radix mark the orientation with data-orientation,
              React Aria with aria-orientation. */}
          <Separator
            orientation="vertical"
            className={cn(
              'z-4 translate-x-1 touch-none select-none rounded-xs data-[orientation=vertical]:h-6 data-[orientation=vertical]:w-1 aria-[orientation=vertical]:h-6 aria-[orientation=vertical]:w-1',
              !isResizing && 'transition-all duration-150 ease-in-out',
              rest.className,
            )}
          />
        </div>
      )}
    </table.Subscribe>
  );
};
