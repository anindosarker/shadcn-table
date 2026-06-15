import { useEffect, useState } from 'react';

/**
 * Minimal `matchMedia` hook used by the toolbars to replicate MUI's
 * `useMediaQuery`. MRT uses `useMediaQuery('(max-width:720px)')` (mobile) and
 * `useMediaQuery('(max-width:1024px)')` (tablet) to decide whether to stack the
 * alert banner. We reproduce that here without pulling in a dependency.
 */
export const useSRT_MediaQuery = (query: string): boolean => {
  const getMatches = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState(getMatches);

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
