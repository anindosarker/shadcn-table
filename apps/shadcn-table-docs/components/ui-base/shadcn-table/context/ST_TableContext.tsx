import { createTableHookContexts } from '@tanstack/react-table';
import { TooltipProvider } from '@/components/ui-base/tooltip';
import { type ST_Features } from '@/components/ui-base/shadcn-table/features/stFeatures';
import {
  type ST_RowData,
  type ST_TableInstance,
  type ST_TableProviderProps,
} from '@/components/ui-base/shadcn-table/types';

/**
 * The table context every ST table publishes on, handed to each table hook
 * explicitly so `useSTContext` reads any table, whichever hook built it.
 */
export const { tableContext, useTableContext } =
  createTableHookContexts<ST_Features>();

export function useSTContext<
  TData extends ST_RowData = ST_RowData,
>(): ST_TableInstance<TData> {
  // The context carries the core-typed table; the ST wrapper types re-type
  // its row, column, cell and header getters.
  return useTableContext() as unknown as ST_TableInstance<TData>;
}

export const ST_TableProvider = <TData extends ST_RowData>({
  children,
  table,
}: ST_TableProviderProps<TData>) => (
  // The Base UI provider owns the shared open delay and skip window, which the
  // table turns off for every tooltip below it.
  <TooltipProvider timeout={0}>
    <table.AppTable>{children}</table.AppTable>
  </TooltipProvider>
);
