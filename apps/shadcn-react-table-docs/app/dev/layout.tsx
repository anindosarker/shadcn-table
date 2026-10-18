import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ForceDark } from '@/components/dev-home/shared/force-dark';

export const metadata: Metadata = {
  title: 'Homepage experiments',
  robots: { index: false, follow: false },
};

/**
 * Experimental homepages. No fumadocs HomeLayout: each variant owns its nav.
 * Dark-only, whatever the site theme is. A variant page can set its accent
 * with <div data-variant="N"> on its own .dev-home wrapper, or rely on this one.
 */
export default function DevLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dev-home dark flex min-h-screen w-full flex-1 flex-col bg-(--dh-paper) text-(--dh-ink) antialiased">
      <ForceDark />
      {children}
    </div>
  );
}
