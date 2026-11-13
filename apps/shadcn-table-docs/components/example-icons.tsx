'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useDesignSystem } from '@/components/design-system-provider';
import { ST_DefaultsProvider as AriaDefaults } from '@/components/ui-aria/shadcn-table/context/ST_DefaultsContext';
import { ST_DefaultsProvider as BaseDefaults } from '@/components/ui-base/shadcn-table/context/ST_DefaultsContext';
import { ST_DefaultsProvider as RadixDefaults } from '@/components/ui-radix/shadcn-table/context/ST_DefaultsContext';
import type { ST_Icons } from '@/components/ui-radix/shadcn-table/types';
import type { IconLibraryName } from '@/lib/design-system/config';
import type { Base } from '@/lib/install';

type Icons = Partial<ST_Icons>;
type IconSet = Exclude<IconLibraryName, 'lucide'>;
type Module = { ST_Default_Icons: Icons };

/**
 * One loader per base copy: its icons/<set>.ts map, written by lib:install
 * (spelled out per base so the bundler sees one dynamic segment, as
 * components/example-variant.tsx). A set's chunk downloads only once it is
 * picked.
 */
const loaders: Record<Base, (set: IconSet) => Promise<Module>> = {
  radix: (set) => import(`@/components/ui-radix/shadcn-table/icons/${set}`),
  base: (set) => import(`@/components/ui-base/shadcn-table/icons/${set}`),
  aria: (set) => import(`@/components/ui-aria/shadcn-table/icons/${set}`),
};

/** One promise per base and set. */
const sets = new Map<string, Promise<Icons>>();

const load = (base: Base, set: IconSet) => {
  const key = `${base}/${set}`;
  let promise = sets.get(key);
  if (!promise) {
    promise = loaders[base](set).then((m) => m.ST_Default_Icons);
    sets.set(key, promise);
  }
  return promise;
};

/** The base copy's map of `library`; undefined for Lucide and until it loads. */
const useIconSet = (base: Base, library: IconLibraryName) => {
  const [loaded, setLoaded] = useState<{
    library: IconLibraryName;
    icons: Icons;
  } | null>(null);
  useEffect(() => {
    if (library === 'lucide') return;
    let live = true;
    load(base, library).then((icons) => {
      if (live) setLoaded({ library, icons });
    });
    return () => {
      live = false;
    };
  }, [base, library]);
  return library !== 'lucide' && loaded?.library === library
    ? loaded.icons
    : undefined;
};

/**
 * The theme panel's Icon Library pick (D27) for every example table: one
 * ST_DefaultsProvider per base copy of the library, each fed that copy's
 * icon map. The tables show Lucide until the picked map has loaded; the docs
 * chrome never reads these providers and stays Lucide.
 */
export function ExampleIcons({ children }: { children: ReactNode }) {
  const { config } = useDesignSystem();
  const radix = useIconSet('radix', config.iconLibrary);
  const base = useIconSet('base', config.iconLibrary);
  const aria = useIconSet('aria', config.iconLibrary);
  return (
    <RadixDefaults icons={radix}>
      <BaseDefaults icons={base}>
        <AriaDefaults icons={aria}>{children}</AriaDefaults>
      </BaseDefaults>
    </RadixDefaults>
  );
}
