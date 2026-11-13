import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { type ST_Defaults } from '@/components/ui/shadcn-table/types';

/**
 * The defaults every table below the nearest `ST_DefaultsProvider` starts
 * from; empty outside any provider, so a table behaves as without one.
 */
export const ST_DefaultsContext = createContext<ST_Defaults>({});

/**
 * Sets defaults for every table it wraps: `useST_TableOptions` merges
 * `ST_Default_Icons`, then the provider's `icons`, then the table's own
 * `icons` option. A nested provider merges over its parent.
 */
export const ST_DefaultsProvider = ({
  children,
  icons,
}: ST_Defaults & { children: ReactNode }) => {
  const parent = useContext(ST_DefaultsContext);
  const value = useMemo<ST_Defaults>(
    () => ({
      ...parent,
      icons: icons ? { ...parent.icons, ...icons } : parent.icons,
    }),
    [icons, parent],
  );
  return (
    <ST_DefaultsContext.Provider value={value}>
      {children}
    </ST_DefaultsContext.Provider>
  );
};

/** The defaults of the nearest `ST_DefaultsProvider`, `{}` outside one. */
export const useST_Defaults = () => useContext(ST_DefaultsContext);
