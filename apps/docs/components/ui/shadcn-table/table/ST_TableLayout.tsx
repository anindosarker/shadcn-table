import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  type DivProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_BottomToolbar } from '@/components/ui/shadcn-table/toolbar/ST_BottomToolbar';
import { ST_TopToolbar } from '@/components/ui/shadcn-table/toolbar/ST_TopToolbar';
import { ST_TableContainer } from '@/components/ui/shadcn-table/table/ST_TableContainer';

export interface ST_TableLayoutProps<TData extends ST_RowData>
  extends DivProps {
  table: ST_TableInstance<TData>;
}

const tableLayoutVariants = cva(
  'relative overflow-hidden rounded-md border bg-background shadow transition-all duration-100 p-2',
  {
    variants: {
      fullscreen: {
        true: 'fixed inset-0 z-50 h-dvh max-h-dvh w-dvw max-w-dvw rounded-none border-0 m-0 p-0',
        false: '',
      },
    },
    defaultVariants: {
      fullscreen: false,
    },
  },
);

export const ST_TableLayout = <TData extends ST_RowData>({
  table,
  ...rest
}: ST_TableLayoutProps<TData>) => {
  const {
    options: {
      enableBottomToolbar,
      enableTopToolbar,
      // Note: we removed mrtTheme since shadcn already handles the themeing through tailwind classes, so we don't need to handle it here
      // mrtTheme: { baseBackgroundColor },
      stTableLayoutProps,
      renderBottomToolbar,
      renderTopToolbar,
    },
    refs: { tableLayoutRef },
  } = table;
  const { isFullScreen } = table.state;

  const layoutDivProps = {
    ...parseFromValuesOrFunc(stTableLayoutProps, { table }),
    ...rest,
  };

  // NOTE: theme isn't needed for shadcn
  // const theme = useTheme();

  return (
    <div
      onKeyDown={(e) => e.key === 'Escape' && table.setIsFullScreen(false)}
      {...layoutDivProps}
      ref={(ref: HTMLDivElement) => {
        tableLayoutRef.current = ref;
        if (layoutDivProps?.ref) {
          //@ts-expect-error ref can be either RefCallback or RefObject
          layoutDivProps.ref.current = ref;
        }
      }}
      className={cn(
        tableLayoutVariants({
          fullscreen: isFullScreen,
          className: layoutDivProps.className,
        }),
      )}
    >
      {enableTopToolbar &&
        (parseFromValuesOrFunc(renderTopToolbar, { table }) ?? (
          <ST_TopToolbar table={table} />
        ))}
      <ST_TableContainer table={table} />
      {enableBottomToolbar &&
        (parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? (
          <ST_BottomToolbar table={table} />
        ))}
    </div>
  );
};
