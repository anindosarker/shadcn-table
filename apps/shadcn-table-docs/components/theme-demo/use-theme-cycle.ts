'use client';

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type RefCallback,
} from 'react';
import { DEMO_THEMES, type DemoTheme, type DemoThemeId } from './demo-themes';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
const getServerReducedMotion = () => false;

/* auto: plays unless reduced motion asks it not to; paused: stopped by a
 * pick or an interaction; resumed: plays again, reduced motion or not, since
 * the visitor asked for it */
type Mode = 'auto' | 'paused' | 'resumed';

/**
 * Autoplay for the theme demo: steps through DEMO_THEMES every intervalMs
 * while the element behind `ref` is on screen. A chip pick (`select`) or a
 * pointer down or focus inside that element stops it for good, until
 * `resume`. Starts paused on the first theme under reduced motion.
 */
export function useThemeCycle({
  intervalMs = 3500,
}: { intervalMs?: number } = {}): {
  index: number;
  theme: DemoTheme;
  paused: boolean;
  select: (id: DemoThemeId) => void;
  resume: () => void;
  ref: RefCallback<HTMLElement>;
} {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('auto');
  const [visible, setVisible] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );

  const paused = mode === 'paused' || (mode === 'auto' && reducedMotion);
  const running = !paused && visible;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % DEMO_THEMES.length),
      intervalMs,
    );
    return () => clearInterval(t);
  }, [running, intervalMs]);

  const select = useCallback((id: DemoThemeId) => {
    setMode('paused');
    setIndex(
      Math.max(
        0,
        DEMO_THEMES.findIndex((t) => t.id === id),
      ),
    );
  }, []);

  const resume = useCallback(() => setMode('resumed'), []);

  // stable, so React does not reattach the observer on every render
  const ref = useCallback<RefCallback<HTMLElement>>((el) => {
    if (!el) return;
    const onInteract = () => setMode('paused');
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    el.addEventListener('pointerdown', onInteract);
    el.addEventListener('focusin', onInteract);
    return () => {
      io.disconnect();
      el.removeEventListener('pointerdown', onInteract);
      el.removeEventListener('focusin', onInteract);
    };
  }, []);

  return {
    index,
    theme: DEMO_THEMES[index],
    paused,
    select,
    resume,
    ref,
  };
}
