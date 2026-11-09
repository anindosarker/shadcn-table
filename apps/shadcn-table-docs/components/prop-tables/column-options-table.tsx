'use client';

import dynamic from 'next/dynamic';
import {
  type ColumnOption,
  columnOptions,
} from '@/lib/prop-tables/columnOptions';
import { PropTableFallback, PropTableShell } from './prop-table-shell';
import { staticRows } from './static-prop-table';

const ColumnOptionsTableClient = dynamic(
  () => import('./column-options-table.client'),
  {
    ssr: false,
    loading: PropTableFallback,
  },
);

interface Props {
  onlyOptions?: Set<ColumnOption['columnOption']>;
}

/** Static HTML table on the server, the interactive one after hydration. */
export const ColumnOptionsTable = ({ onlyOptions }: Props) => (
  <PropTableShell
    anchor="column-option"
    nameHeader="Column Option"
    rows={staticRows(
      columnOptions,
      'columnOption',
      onlyOptions,
      (row) => row.required,
    )}
  >
    <ColumnOptionsTableClient onlyOptions={onlyOptions} />
  </PropTableShell>
);

export default ColumnOptionsTable;
