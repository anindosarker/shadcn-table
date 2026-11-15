'use client';

import { createContext, type ReactNode, useContext } from 'react';
import {
  StaticPropTable,
  type StaticPropTableProps,
} from './static-prop-table';

const FallbackContext = createContext<StaticPropTableProps | null>(null);

/**
 * Wraps an interactive prop table loaded with
 * `dynamic(() => import('./<x>-table.client'), { ssr: false, loading: PropTableFallback })`
 * (next/dynamic wants the import written literally, so each `<x>-table.tsx`
 * declares its own). The server renders the static table; after hydration the
 * interactive ShadcnTable replaces it (D59).
 */
export const PropTableShell = ({
  children,
  ...fallback
}: StaticPropTableProps & { children: ReactNode }) => (
  <FallbackContext.Provider value={fallback}>
    {children}
  </FallbackContext.Provider>
);

/** `loading` of the dynamic import: the static table of the enclosing shell. */
export const PropTableFallback = () => {
  const fallback = useContext(FallbackContext);
  return fallback ? <StaticPropTable {...fallback} /> : null;
};
