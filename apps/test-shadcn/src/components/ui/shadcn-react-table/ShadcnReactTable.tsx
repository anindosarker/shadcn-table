import {
  useShadcnReactTable,
  type SRT_RowData,
  type SRT_TableInstance,
  type SRT_TableOptions,
  type Xor,
} from 'shadcn-react-table-core';
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

const ShadcnReactTable = <TData extends SRT_RowData>(
  props: ShadcnReactTableProps<TData>,
) => {
  let table: SRT_TableInstance<TData>;

  if (isTableInstanceProp(props)) {
    table = props.table;
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    table = useShadcnReactTable(props);
  }

  return <SRT_TableLayout table={table} />;
};

export default ShadcnReactTable;
