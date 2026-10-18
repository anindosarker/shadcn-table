'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { ForceDark } from './force-dark';

/** Variants that follow the site's theme preset and light/dark mode instead
 * of the dark-only .dev-home tokens. */
const THEMED = new Set(['/dev/12']);

/**
 * The /dev wrapper. Every variant gets the dark-only .dev-home shell and
 * <ForceDark />, except the THEMED ones, which render bare so the site's
 * shadcn tokens reach them unchanged.
 */
export function DevShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (THEMED.has(pathname)) {
    return (
      <div className="flex min-h-screen w-full flex-1 flex-col antialiased">
        {children}
      </div>
    );
  }
  return (
    <div className="dev-home dark flex min-h-screen w-full flex-1 flex-col bg-(--dh-paper) text-(--dh-ink) antialiased">
      <ForceDark />
      {children}
    </div>
  );
}
