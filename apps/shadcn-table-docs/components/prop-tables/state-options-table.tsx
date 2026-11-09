'use client';

import dynamic from 'next/dynamic';
import { type StateOption, stateOptions } from '@/lib/prop-tables/stateOptions';
import { PropTableFallback, PropTableShell } from './prop-table-shell';
import { staticRows } from './static-prop-table';

const StateOptionsTableClient = dynamic(
  () => import('./state-options-table.client'),
  {
    ssr: false,
    loading: PropTableFallback,
  },
);

interface Props {
  onlyOptions?: Set<StateOption['stateOption']>;
}

/** Static HTML table on the server, the interactive one after hydration. */
export const StateOptionsTable = ({ onlyOptions }: Props) => (
  <PropTableShell
    anchor="state-option"
    nameHeader="State Option"
    rows={staticRows(stateOptions, 'stateOption', onlyOptions)}
  >
    <StateOptionsTableClient onlyOptions={onlyOptions} />
  </PropTableShell>
);

export default StateOptionsTable;
