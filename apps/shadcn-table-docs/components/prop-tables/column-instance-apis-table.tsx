'use client';

import dynamic from 'next/dynamic';
import {
  type ColumnInstanceAPI,
  columnInstanceAPIs,
} from '@/lib/prop-tables/columnInstanceAPIs';
import { PropTableFallback, PropTableShell } from './prop-table-shell';
import { staticRows } from './static-prop-table';

const ColumnInstanceAPIsTableClient = dynamic(
  () => import('./column-instance-apis-table.client'),
  {
    ssr: false,
    loading: PropTableFallback,
  },
);

interface Props {
  onlyOptions?: Set<ColumnInstanceAPI['columnInstanceAPI']>;
}

/** Static HTML table on the server, the interactive one after hydration. */
export const ColumnInstanceAPIsTable = ({ onlyOptions }: Props) => (
  <PropTableShell
    anchor="column-instance-api"
    nameHeader="State Option"
    rows={staticRows(columnInstanceAPIs, 'columnInstanceAPI', onlyOptions)}
  >
    <ColumnInstanceAPIsTableClient onlyOptions={onlyOptions} />
  </PropTableShell>
);

export default ColumnInstanceAPIsTable;
