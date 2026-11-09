'use client';

import dynamic from 'next/dynamic';
import {
  type RowInstanceAPI,
  rowInstanceAPIs,
} from '@/lib/prop-tables/rowInstanceAPIs';
import { PropTableFallback, PropTableShell } from './prop-table-shell';
import { staticRows } from './static-prop-table';

const RowInstanceAPIsTableClient = dynamic(
  () => import('./row-instance-apis-table.client'),
  {
    ssr: false,
    loading: PropTableFallback,
  },
);

interface Props {
  onlyOptions?: Set<RowInstanceAPI['rowInstanceAPI']>;
}

/** Static HTML table on the server, the interactive one after hydration. */
export const RowInstanceAPIsTable = ({ onlyOptions }: Props) => (
  <PropTableShell
    anchor="row-instance-api"
    nameHeader="State Option"
    rows={staticRows(rowInstanceAPIs, 'rowInstanceAPI', onlyOptions)}
  >
    <RowInstanceAPIsTableClient onlyOptions={onlyOptions} />
  </PropTableShell>
);

export default RowInstanceAPIsTable;
