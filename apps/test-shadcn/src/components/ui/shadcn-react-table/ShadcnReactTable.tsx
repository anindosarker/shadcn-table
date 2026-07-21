import {
  useShadcnReactTable,
  type SRT_RowData,
  type SRT_TableInstance,
  type SRT_TableOptions,
  type Xor,
} from 'shadcn-react-table-core';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SRT_TableLayout } from './table/SRT_TableLayout';

type TableInstanceProp<TData extends SRT_RowData> = {
  table: SRT_TableInstance<TData>;
};

export type ShadcnReactTableProps<TData extends SRT_RowData> = Xor<
  TableInstanceProp<TData>,
  SRT_TableOptions<TData>
>;

const isTableInstanceProp = <TData extends SRT_RowData>(
  props: ShadcnReactTableProps<TData>,
): props is TableInstanceProp<TData> =>
  (props as TableInstanceProp<TData>).table !== undefined;

export const ShadcnReactTable = <TData extends SRT_RowData>(
  props: ShadcnReactTableProps<TData>,
) => {
  let table: SRT_TableInstance<TData>;

  if (isTableInstanceProp(props)) {
    table = props.table;
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    table = useShadcnReactTable(props);
  }

  // Note: the provider lives here at the SRT root because the latest shadcn
  // tooltip (registry change 2026-07) no longer self-wraps each Tooltip in a
  // TooltipProvider — Radix Tooltip.Root throws without a provider ancestor.
  // Mounting it once at the outermost component keeps consumer boilerplate at
  // zero (MRT/MUI ergonomics) and covers every toolbar, menu, modal, and cell,
  // including portalled content (portals preserve React context).
  return (
    <TooltipProvider>
      <SRT_TableLayout table={table} />
    </TooltipProvider>
  );
};
