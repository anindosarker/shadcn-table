import { TooltipProvider } from '@/components/ui/tooltip';
import { useShadcnTable } from '@/components/ui/shadcn-table/hooks/useShadcnTable';
import {
  type ST_RowData,
  type ST_TableInstance,
  type ST_TableOptions,
  type Xor,
} from '@/components/ui/shadcn-table/types';
import { ST_TableLayout } from '@/components/ui/shadcn-table/table/ST_TableLayout';

type TableInstanceProp<TData extends ST_RowData> = {
  table: ST_TableInstance<TData>;
};

export type ShadcnTableProps<TData extends ST_RowData> = Xor<
  TableInstanceProp<TData>,
  ST_TableOptions<TData>
>;

const isTableInstanceProp = <TData extends ST_RowData>(
  props: ShadcnTableProps<TData>,
): props is TableInstanceProp<TData> =>
  (props as TableInstanceProp<TData>).table !== undefined;

export const ShadcnTable = <TData extends ST_RowData>(
  props: ShadcnTableProps<TData>,
) => {
  let table: ST_TableInstance<TData>;

  if (isTableInstanceProp(props)) {
    table = props.table;
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    table = useShadcnTable(props);
  }

  // Note: the provider lives here at the ST root because the latest shadcn
  // tooltip (registry change 2026-07) no longer self-wraps each Tooltip in a
  // TooltipProvider — Base UI Tooltip.Root works without one, but the provider
  // owns the shared open delay and the skip window (`timeout`), which the
  // library turns off. Mounting it once at the outermost component keeps
  // consumer boilerplate at zero (MRT/MUI ergonomics) and covers every toolbar,
  // menu, modal, and cell, including portalled content (portals preserve React
  // context).
  return (
    <TooltipProvider timeout={0}>
      <ST_TableLayout table={table} />
    </TooltipProvider>
  );
};
