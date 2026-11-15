'use client';

import dynamic from 'next/dynamic';
import {
  type TableInstanceAPI,
  tableInstanceAPIs,
} from '@/lib/prop-tables/tableInstanceAPIs';
import { PropTableFallback, PropTableShell } from './prop-table-shell';
import { staticRows } from './static-prop-table';

const TableInstanceAPIsTableClient = dynamic(
  () => import('./table-instance-apis-table.client'),
  {
    ssr: false,
    loading: PropTableFallback,
  },
);

interface Props {
  onlyOptions?: Set<TableInstanceAPI['tableInstanceAPI']>;
}

/** Static HTML table on the server, the interactive one after hydration. */
export const TableInstanceAPIsTable = ({ onlyOptions }: Props) => (
  <PropTableShell
    anchor="table-instance-api"
    nameHeader="State Option"
    rows={staticRows(tableInstanceAPIs, 'tableInstanceAPI', onlyOptions)}
  >
    <TableInstanceAPIsTableClient onlyOptions={onlyOptions} />
  </PropTableShell>
);

export default TableInstanceAPIsTable;
