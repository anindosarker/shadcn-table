'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { FocusEvent } from 'react';
import { cn } from '@/lib/cn';
import {
  FEATURES,
  OutlineTile,
  type FeatureId,
  type OutlineTileSize,
} from './outline-tiles';

/*
 * Autoplay tile grid: an OutlineTileGrid whose drawings act out one after
 * another, cycling through the tiles that are on screen. Hover or focus
 * pauses the cycle on that tile; leaving the grid resumes from the next
 * one. Reduced motion turns autoplay off (hover still plays a tile).
 */

export interface AutoplayTileGridProps {
  /** Which features, in order. Defaults to all twelve. */
  features?: readonly FeatureId[];
  size?: OutlineTileSize;
  showLabel?: boolean;
  className?: string;
  tileClassName?: string;
  /** Time each tile stays active, in ms. */
  intervalMs?: number;
}

const gridClass: Record<OutlineTileSize, string> = {
  sm: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6',
  md: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  lg: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

const useReducedMotion = () =>
  useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  );

/** The tile that plays for `index`: itself if on screen, else the first one. */
const shownIn = (visible: readonly number[], index: number) =>
  visible.includes(index) ? index : (visible[0] ?? index);

/** The next on-screen tile after `from`, wrapping. */
const nextIn = (visible: readonly number[], from: number) =>
  visible.find((i) => i > from) ?? visible[0] ?? from;

export function AutoplayTileGrid({
  features = FEATURES.map((f) => f.id),
  size = 'lg',
  showLabel = true,
  className,
  tileClassName,
  intervalMs = 1800,
}: AutoplayTileGridProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [visible, setVisible] = useState<readonly number[]>([]);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [pausedIndex, setPausedIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const count = features.length;
  const autoplay = !reducedMotion && visible.length > 0;

  // Watch each tile, not the list: a one-column grid on a phone is far
  // taller than the viewport, so the list never reaches a useful ratio.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const shown = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (entry.isIntersecting) shown.add(index);
          else shown.delete(index);
        }
        setVisible([...shown].sort((a, b) => a - b));
      },
      { threshold: 0.6 },
    );
    for (const item of Array.from(list.children)) observer.observe(item);
    return () => observer.disconnect();
  }, [count]);

  // next visible tile after `from`, wrapping
  useEffect(() => {
    if (!autoplay || pausedIndex !== null) return;
    const timer = window.setInterval(
      () => setCycleIndex((i) => nextIn(visible, shownIn(visible, i))),
      intervalMs,
    );
    return () => window.clearInterval(timer);
  }, [autoplay, pausedIndex, intervalMs, visible]);

  const resume = () => {
    if (pausedIndex === null) return;
    setCycleIndex(nextIn(visible, pausedIndex));
    setPausedIndex(null);
  };

  const handleBlur = (event: FocusEvent<HTMLUListElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      resume();
    }
  };

  const activeIndex =
    pausedIndex ?? (autoplay ? shownIn(visible, cycleIndex) : null);

  return (
    <ul
      ref={listRef}
      onPointerLeave={resume}
      onBlur={handleBlur}
      className={cn('grid gap-3 sm:gap-4', gridClass[size], className)}
    >
      {features.map((id, index) => (
        <li
          key={id}
          data-index={index}
          className="flex min-w-0"
          onPointerEnter={() => setPausedIndex(index)}
          onFocus={() => setPausedIndex(index)}
        >
          <OutlineTile
            feature={id}
            size={size}
            showLabel={showLabel}
            active={activeIndex === index}
            className={cn('w-full', tileClassName)}
          />
        </li>
      ))}
    </ul>
  );
}
