import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Experiments',
  robots: { index: false, follow: false },
};

/**
 * Review-only pages (the theme demo variants under /dev/theme). No fumadocs
 * layout: each page brings the site nav and follows the site theme.
 */
export default function DevLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
