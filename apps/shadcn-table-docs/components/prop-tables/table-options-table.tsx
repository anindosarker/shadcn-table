'use client';

import dynamic from 'next/dynamic';
import { type TableOption, tableOptions } from '@/lib/prop-tables/tableOptions';
import { PropTableFallback, PropTableShell } from './prop-table-shell';
import { staticRows } from './static-prop-table';

const TableOptionsTableClient = dynamic(
  () => import('./table-options-table.client'),
  {
    ssr: false,
    loading: PropTableFallback,
  },
);

interface Props {
  onlyOptions?: Set<TableOption['tableOption']>;
}

/** Static HTML table on the server, the interactive one after hydration. */
export const TableOptionsTable = ({ onlyOptions }: Props) => (
  <PropTableShell
    anchor="prop"
    nameHeader="Prop Name"
    rows={staticRows(
      tableOptions,
      'tableOption',
      onlyOptions,
      (row) => row.required,
    )}
  >
    <TableOptionsTableClient onlyOptions={onlyOptions} />
  </PropTableShell>
);

export default TableOptionsTable;
