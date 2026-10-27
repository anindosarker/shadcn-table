import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DevBar } from './dev-bar';

export const metadata: Metadata = {
  title: 'Experiments',
  robots: { index: false, follow: false },
};

/**
 * Review-only pages, indexed at /dev from DEV_GROUPS (pages.ts). No fumadocs
 * layout: each page brings the site nav and follows the site theme. DevBar
 * links every listed page to the index and to its neighbours.
 */
export default function DevLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      {/* Room under the last content so the fixed bar never covers it. */}
      <div aria-hidden="true" className="h-16" />
      <DevBar />
    </>
  );
}
