'use client';

import dynamic from 'next/dynamic';
import {
  type CellInstanceAPI,
  cellInstanceAPIs,
} from '@/lib/prop-tables/cellInstanceAPIs';
import { PropTableFallback, PropTableShell } from './prop-table-shell';
import { staticRows } from './static-prop-table';

const CellInstanceAPIsTableClient = dynamic(
  () => import('./cell-instance-apis-table.client'),
  {
    ssr: false,
    loading: PropTableFallback,
  },
);

interface Props {
  onlyOptions?: Set<CellInstanceAPI['cellInstanceAPI']>;
}

/** Static HTML table on the server, the interactive one after hydration. */
export const CellInstanceAPIsTable = ({ onlyOptions }: Props) => (
  <PropTableShell
    anchor="cell-instance-api"
    nameHeader="State Option"
    rows={staticRows(cellInstanceAPIs, 'cellInstanceAPI', onlyOptions)}
  >
    <CellInstanceAPIsTableClient onlyOptions={onlyOptions} />
  </PropTableShell>
);

export default CellInstanceAPIsTable;
