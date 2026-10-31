import { useEffect, useState } from 'react';

export const useST_MediaQuery = (query: string): boolean => {
  // Starts false on server and client alike: reading matchMedia in the
  // initializer would make the first client render differ from the server HTML
  // and throw a hydration mismatch. The effect sets the real value after mount.
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
