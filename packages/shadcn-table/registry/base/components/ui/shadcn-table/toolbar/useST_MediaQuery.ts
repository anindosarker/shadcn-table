import { useEffect, useState } from 'react';

/**
 * Minimal `matchMedia` hook used by the toolbars to replicate MUI's
 * `useMediaQuery`. MRT uses `useMediaQuery('(max-width:720px)')` (mobile) and
 * `useMediaQuery('(max-width:1024px)')` (tablet) to decide whether to stack the
 * alert banner. We reproduce that here without pulling in a dependency.
 */
export const useST_MediaQuery = (query: string): boolean => {
  // Starts false on server and client alike (SSR-safe): reading matchMedia in
  // the initializer made the first client render differ from the server HTML
  // below 720px and threw a React hydration mismatch. The effect below sets the
  // real value right after mount.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    )
      return;
    const mediaQueryList = window.matchMedia(query);
    const handler = () => setMatches(mediaQueryList.matches);
    handler();
    mediaQueryList.addEventListener('change', handler);
    return () => mediaQueryList.removeEventListener('change', handler);
  }, [query]);

  return matches;
};
