import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { type KeyboardEvent } from 'react';
import {
  mergeSRT_HtmlProps,
  parseFromValuesOrFunc,
  parseSRT_HtmlProps,
  type LayoutDivProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { SRT_BottomToolbar } from '../toolbar/SRT_BottomToolbar';
import { SRT_TopToolbar } from '../toolbar/SRT_TopToolbar';
import { SRT_TableContainer } from './SRT_TableContainer';

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
      enableBottomToolbar,
      enableTopToolbar,
      srtTableLayoutProps,
      renderBottomToolbar,
      renderTopToolbar,
    },
    refs: { tableLayoutRef },
  } = table;
  const { isFullScreen } = getState();

  const layoutDivProps = {
    ...parseFromValuesOrFunc(srtTableLayoutProps, { table }),
    ...rest,
  };

  const { className, ref: layoutRef, ...divRest } = layoutDivProps;

  const paperProps = mergeSRT_HtmlProps(
    {
      onKeyDown: (e: KeyboardEvent) =>
        e.key === 'Escape' && table.setIsFullScreen(false),
    },
    parseSRT_HtmlProps(srtTablePaperProps, { table }),
  );

  return (
    <div
      {...divRest}
      {...paperProps}
      className={cn(
        tableLayoutVariants({ fullscreen: isFullScreen, className }),
        paperProps?.className,
      )}
      ref={(node: HTMLDivElement) => {
        tableLayoutRef.current = node;
        if (layoutRef) {
          // @ts-expect-error - this is a ref from the user, so we need to assign it as well
          layoutRef.current = node;
        }
      }}
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
