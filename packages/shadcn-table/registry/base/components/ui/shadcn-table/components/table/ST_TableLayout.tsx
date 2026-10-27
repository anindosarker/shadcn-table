import { Subscribe } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { type DivProps } from '@/components/ui/shadcn-table/types';
import {
  assignRef,
  parseFromValuesOrFunc,
} from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_BottomToolbar } from '@/components/ui/shadcn-table/components/toolbar/ST_BottomToolbar';
import { ST_TopToolbar } from '@/components/ui/shadcn-table/components/toolbar/ST_TopToolbar';
import { ST_TableContainer } from '@/components/ui/shadcn-table/components/table/ST_TableContainer';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

export type ST_TableLayoutProps = DivProps;

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

export const ST_TableLayout = ({ ...rest }: ST_TableLayoutProps) => {
  const table = useSTContext();
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

  const layoutDivProps = {
    ...parseFromValuesOrFunc(stTableLayoutProps, { table }),
    ...rest,
  };

  // NOTE: theme isn't needed for shadcn
  // const theme = useTheme();

  // Created outside the full screen subscription, so toggling full screen
  // re-renders only this element.
  const topToolbar =
    enableTopToolbar &&
    (parseFromValuesOrFunc(renderTopToolbar, { table }) ?? <ST_TopToolbar />);
  const tableContainer = <ST_TableContainer />;
  const bottomToolbar =
    enableBottomToolbar &&
    (parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? (
      <ST_BottomToolbar />
    ));

  return (
    <Subscribe source={table.atoms.isFullScreen}>
      {(isFullScreen) => (
        <div
          onKeyDown={(e) => e.key === 'Escape' && table.setIsFullScreen(false)}
          {...layoutDivProps}
          ref={(node: HTMLDivElement) => {
            tableLayoutRef.current = node;
            const cleanup = assignRef(layoutDivProps?.ref, node);
            return () => {
              if (typeof cleanup === 'function') {
                cleanup();
              } else {
                assignRef(layoutDivProps?.ref, null);
              }
              tableLayoutRef.current = null;
            };
          }}
          className={cn(
            tableLayoutVariants({
              fullscreen: isFullScreen,
              className: layoutDivProps.className,
            }),
          )}
        >
          {topToolbar}
          {tableContainer}
          {bottomToolbar}
        </div>
      )}
    </Subscribe>
  );
};
