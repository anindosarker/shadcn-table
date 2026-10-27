import { ST_TableProvider } from '@/components/ui/shadcn-table/hooks/stTableHook';
import { useShadcnTable } from '@/components/ui/shadcn-table/hooks/useShadcnTable';
import {
  type ST_RowData,
  type ST_TableInstance,
  type ST_TableOptions,
  type Xor,
} from '@/components/ui/shadcn-table/types';
import { ST_TableLayout } from '@/components/ui/shadcn-table/components/table/ST_TableLayout';

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

  // `ST_TableProvider` also mounts the tooltip provider.
  return (
    <ST_TableProvider table={table}>
      <ST_TableLayout table={table} />
    </ST_TableProvider>
  );
};
