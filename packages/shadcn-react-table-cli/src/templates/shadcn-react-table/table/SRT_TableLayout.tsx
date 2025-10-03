import {
  parseFromValuesOrFunc,
  type LayoutDivProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SRT_TableContainer } from './SRT_TableContainer';
import { SRT_TopToolbar } from '../toolbar/SRT_TopToolbar';
import { SRT_BottomToolbar } from '../toolbar/SRT_BottomToolbar';

export interface SRT_TableLayoutProps<TData extends SRT_RowData>
  extends LayoutDivProps {
  table: SRT_TableInstance<TData>;
}

const tableLayoutVariants = cva(
  'relative overflow-hidden rounded-md border bg-background shadow transition-all duration-100 p-2',
  {
    variants: {
      fullscreen: {
        true: 'fixed inset-0 z-50 h-dvh w-screen rounded-none border-0 m-0',
        false: '',
      },
    },
    defaultVariants: {
      fullscreen: false,
    },
  },
);

export const SRT_TableLayout = <TData extends SRT_RowData>({
  table,
  ...rest
}: SRT_TableLayoutProps<TData>) => {
  const {
    getState,
    options: {
      enableTopToolbar,
      enableBottomToolbar,
      renderTopToolbar,
      renderBottomToolbar,
      srtTableLayoutProps,
    },
    refs: { tableLayoutRef },
  } = table;

  const { isFullScreen } = getState();

  const layoutDivProps = {
    ...parseFromValuesOrFunc(srtTableLayoutProps, { table }),
    ...rest,
  };
  // TODO: use cva for className overrides
  const { className, ...divRest } = layoutDivProps;

  // TODO: I've omitted the ref since this code will live in user's directory, might add later

  return (
    <div
      ref={(ref: HTMLDivElement) => {
        tableLayoutRef.current = ref;
      }}
      onKeyDown={(e) => e.key === 'Escape' && table.setIsFullScreen(false)}
      className={cn(
        tableLayoutVariants({ fullscreen: isFullScreen, className }),
      )}
      {...divRest}
    >
      {enableTopToolbar &&
        (parseFromValuesOrFunc(renderTopToolbar, { table }) ?? (
          <SRT_TopToolbar table={table} />
        ))}
      <SRT_TableContainer table={table} />
      {enableBottomToolbar &&
        (parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? (
          <SRT_BottomToolbar table={table} />
        ))}
    </div>
  );
};
