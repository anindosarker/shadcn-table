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
 * Autoplay tile grid: an OutlineTileGrid whose on-screen drawings fire at
 * random, a few overlapping at a time. Hover or focus pauses new
 * activations and plays only that tile; leaving the grid resumes. Reduced
 * motion turns autoplay off (hover still plays a tile).
 */

export interface AutoplayTileGridProps {
  /** Which features, in order. Defaults to all twelve. */
  features?: readonly FeatureId[];
  size?: OutlineTileSize;
  showLabel?: boolean;
  className?: string;
  tileClassName?: string;
  /** Base gap between activations, in ms; each gap is jittered 0.7x to 1.4x. */
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

/*
 * How long one activation stays on. Drawings finish by 960ms
 * (--dh-dur-slow plus at most 320ms delay); virtualization (.dh-slow) runs
 * --dh-dur-crawl (1600ms), so it holds longer.
 */
const HOLD_MS = 1300;
const HOLD_SLOW_MS = 1700;
/** Recent picks skipped when choosing the next tile (fewer when few show). */
const RECENT = 2;

export function AutoplayTileGrid({
  features = FEATURES.map((f) => f.id),
  size = 'lg',
  showLabel = true,
  className,
  tileClassName,
  intervalMs = 500,
}: AutoplayTileGridProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const visibleRef = useRef<readonly number[]>([]);
  const [visible, setVisible] = useState<readonly number[]>([]);
  const [active, setActive] = useState<readonly number[]>([]);
  const [pausedIndex, setPausedIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const count = features.length;
  const autoplay = !reducedMotion && visible.length > 0;
  const slowIndex = features.indexOf('virtualization');

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
        visibleRef.current = [...shown].sort((a, b) => a - b);
        setVisible(visibleRef.current);
      },
      { threshold: 0.5 },
    );
    for (const item of Array.from(list.children)) observer.observe(item);
    return () => observer.disconnect();
  }, [count]);

  // Every jittered tick, light a random on-screen tile that is not already
  // playing and not one of the last few picks; it clears after its hold.
  useEffect(() => {
    if (!autoplay || pausedIndex !== null) return;
    const on = new Set<number>();
    const recent: number[] = [];
    const holds = new Set<number>();
    let tick = 0;
    const holdFor = (i: number) => (i === slowIndex ? HOLD_SLOW_MS : HOLD_MS);

    const schedule = () => {
      const jitter = 0.7 + Math.random() * 0.7;
      tick = window.setTimeout(fire, intervalMs * jitter);
    };

    const fire = () => {
      // skip recent picks when possible; the window shrinks with few tiles
      // on screen (a phone shows two or three) so picks do not settle into a
      // fixed rotation, and with none fresh any idle one will do
      const shown = visibleRef.current;
      const span = Math.max(0, Math.min(RECENT, shown.length - 2));
      const skip = span > 0 ? recent.slice(-span) : [];
      const idle = shown.filter((i) => !on.has(i));
      const fresh = idle.filter((i) => !skip.includes(i));
      const candidates = fresh.length > 0 ? fresh : idle;
      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        on.add(pick);
        recent.push(pick);
        if (recent.length > RECENT) recent.shift();
        setActive([...on]);
        const hold = window.setTimeout(() => {
          holds.delete(hold);
          on.delete(pick);
          setActive([...on]);
        }, holdFor(pick));
        holds.add(hold);
      }
      schedule();
    };

    fire();
    return () => {
      window.clearTimeout(tick);
      for (const hold of holds) window.clearTimeout(hold);
      setActive([]);
    };
  }, [autoplay, pausedIndex, intervalMs, slowIndex]);

  const resume = () => setPausedIndex(null);

  const handleBlur = (event: FocusEvent<HTMLUListElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      resume();
    }
  };

  const playing = pausedIndex !== null ? [pausedIndex] : autoplay ? active : [];

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
            active={playing.includes(index)}
            className={cn('w-full', tileClassName)}
          />
        </li>
      ))}
    </ul>
  );
}
