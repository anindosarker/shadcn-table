'use client';

import { useLayoutEffect } from 'react';

/**
 * The /dev variants are dark-only. Portalled UI (menus, popovers, tooltips)
 * renders outside .dev-home, so <html> has to be dark too. Restores the
 * site theme's classes on the way out without touching the saved preference.
 */
export function ForceDark() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains('dark');
    const hadLight = root.classList.contains('light');
    const prevScheme = root.style.colorScheme;
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
    return () => {
      if (!hadDark) root.classList.remove('dark');
      if (hadLight) root.classList.add('light');
      root.style.colorScheme = prevScheme;
    };
  }, []);
  return null;
}
