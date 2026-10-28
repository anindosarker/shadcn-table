import { ST_TableProvider } from '@/components/ui/shadcn-table/hooks/stTableHook';
import {
  selectST_TransformState,
  useST_TableInstance,
} from '@/components/ui/shadcn-table/hooks/useST_TableInstance';
import { useST_TableOptions } from '@/components/ui/shadcn-table/hooks/useST_TableOptions';
import {
  type ST_RowData,
  type ST_TableInstance,
  type ST_TableOptions,
  type Xor,
} from '@/components/ui/shadcn-table/types';
import { ST_TableLayout } from '@/components/ui/shadcn-table/components/table/ST_TableLayout';

type TableInstanceProp<TData extends ST_RowData> = {
  table: ST_TableInstance<TData, unknown>;
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
  let table: ST_TableInstance<TData, unknown>;

  if (isTableInstanceProp(props)) {
    // A table built by the caller re-renders with its owner, and the tree
    // follows; the owner picks its selector (`useShadcnTable` selects all by
    // default).
    table = props.table;
  } else {
    // A table built here re-renders this component only on the state its
    // option-time transforms read; the components subscribe to the rest.
    /* eslint-disable react-hooks/rules-of-hooks -- the props hold either a table or options for the life of the component */
    table = useST_TableInstance(
      useST_TableOptions(props),
      selectST_TransformState,
    );
    /* eslint-enable react-hooks/rules-of-hooks */
  }

  return (
    <ST_TableProvider table={table}>
      <ST_TableLayout />
    </ST_TableProvider>
  );
};
