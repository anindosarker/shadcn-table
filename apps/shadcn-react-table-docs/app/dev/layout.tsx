import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DevShell } from '@/components/dev-home/shared/dev-shell';

export const metadata: Metadata = {
  title: 'Homepage experiments',
  robots: { index: false, follow: false },
};

/**
 * Experimental homepages. No fumadocs HomeLayout: each variant owns its nav.
 * Dark-only, whatever the site theme is. A variant page can set its accent
 * with <div data-variant="N"> on its own .dev-home wrapper, or rely on this one.
 * DevShell exempts the variants that follow the site theme (see THEMED there).
 */
export default function DevLayout({ children }: { children: ReactNode }) {
  return <DevShell>{children}</DevShell>;
}
