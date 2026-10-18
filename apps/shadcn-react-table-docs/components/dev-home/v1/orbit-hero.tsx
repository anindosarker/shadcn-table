'use client';

import { useCallback, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import {
  OutlineTile,
  type FeatureId,
} from '@/components/dev-home/shared/outline-tiles';
import { InstallCommand } from '@/components/dev-home/shared/install-command';
import { FeaturePanel } from './feature-panel';

type Depth = 'near' | 'mid' | 'far';

interface Slot {
  id: FeatureId;
  /** centre of the tile, % of the stage */
  x: number;
  y: number;
  /** width in tenths of a vw (clamped in css) */
  w: number;
  depth: Depth;
  /** drift: seconds per loop, negative start offset, travel in px */
  t: number;
  delay: number;
  ax: number;
  ay: number;
}

/* Hand-placed on two loose ellipses: four left, four right, two top, two
 * bottom, so the wordmark keeps the middle half of the stage. */
const SLOTS: readonly Slot[] = [
  {
    id: 'sorting',
    x: 14,
    y: 18,
    w: 128,
    depth: 'near',
    t: 19,
    delay: -3,
    ax: 8,
    ay: 6,
  },
  {
    id: 'filtering',
    x: 36,
    y: 10,
    w: 100,
    depth: 'far',
    t: 23,
    delay: -11,
    ax: -6,
    ay: 5,
  },
  {
    id: 'column-pinning',
    x: 62,
    y: 11,
    w: 112,
    depth: 'mid',
    t: 21,
    delay: -6,
    ax: 7,
    ay: -5,
  },
  {
    id: 'grouping',
    x: 85,
    y: 19,
    w: 130,
    depth: 'near',
    t: 18,
    delay: -14,
    ax: -8,
    ay: 7,
  },
  {
    id: 'localization',
    x: 7,
    y: 42,
    w: 98,
    depth: 'far',
    t: 24,
    delay: -2,
    ax: 5,
    ay: -8,
  },
  {
    id: 'virtualization',
    x: 93,
    y: 43,
    w: 100,
    depth: 'far',
    t: 22,
    delay: -17,
    ax: -5,
    ay: 8,
  },
  {
    id: 'column-ordering',
    x: 10,
    y: 65,
    w: 114,
    depth: 'mid',
    t: 20,
    delay: -9,
    ax: 7,
    ay: 6,
  },
  {
    id: 'editing',
    x: 89,
    y: 67,
    w: 124,
    depth: 'near',
    t: 19,
    delay: -5,
    ax: -7,
    ay: -6,
  },
  {
    id: 'column-resizing',
    x: 16,
    y: 88,
    w: 124,
    depth: 'near',
    t: 21,
    delay: -12,
    ax: 8,
    ay: -5,
  },
  {
    id: 'export',
    x: 38,
    y: 91,
    w: 98,
    depth: 'far',
    t: 25,
    delay: -8,
    ax: -5,
    ay: -6,
  },
  {
    id: 'detail-panel',
    x: 62,
    y: 90,
    w: 114,
    depth: 'mid',
    t: 20,
    delay: -15,
    ax: 6,
    ay: -7,
  },
  {
    id: 'row-selection',
    x: 85,
    y: 88,
    w: 106,
    depth: 'mid',
    t: 23,
    delay: -4,
    ax: -7,
    ay: -5,
  },
];

const slotStyle = (s: Slot, i: number) =>
  ({
    '--i': i,
    '--x': `${s.x}%`,
    '--y': `${s.y}%`,
    '--w': s.w,
    '--t': `${s.t}s`,
    '--delay': `${s.delay}s`,
    '--ax': `${s.ax}px`,
    '--ay': `${s.ay}px`,
  }) as CSSProperties;

export function OrbitHero() {
  const [open, setOpen] = useState<FeatureId | null>(null);

  const close = useCallback(() => {
    const was = open;
    setOpen(null);
    if (was) {
      document
        .querySelector<HTMLButtonElement>(`[data-o1-feature="${was}"] button`)
        ?.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <section id="top" aria-label="Shadcn React Table" className="o1-hero">
      <div className="o1-stage">
        <svg
          className="o1-rings"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="50" cy="50" r="49" className="o1-ring-faint" />
          <circle cx="50" cy="50" r="38" className="o1-ring-spin" />
          <circle cx="50" cy="50" r="27" />
          <circle
            cx="50"
            cy="50"
            r="16"
            className="o1-ring-spin o1-ring-spin-rev"
          />
          <line x1="0" y1="50" x2="6" y2="50" />
          <line x1="94" y1="50" x2="100" y2="50" />
          <line x1="50" y1="0" x2="50" y2="4" />
          <line x1="50" y1="96" x2="50" y2="100" />
        </svg>

        <div className="o1-core">
          <h1 className="o1-word">
            <span className="o1-word-line">Shadcn</span>
            <span className="o1-word-line">
              <span>React </span>
              <span className="o1-word-accent">Table</span>
            </span>
          </h1>
          <p className="o1-sub">
            The full-featured data grid for shadcn/ui. Sorting, filtering,
            grouping, pinning and virtualization on TanStack Table v8, in code
            you own.
          </p>
          <div className="o1-ctas">
            <Link
              href="/docs/getting-started/install"
              className="o1-btn o1-btn-primary"
            >
              Get started
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
            <InstallCommand className="h-11 rounded-[3px] py-0" />
          </div>
          <p className="o1-hint">
            <span className="o1-hint-wide">Click a drawing to run it live</span>
            <span className="o1-hint-narrow">Tap a drawing to run it live</span>
          </p>
        </div>

        <ul className="o1-orbit" aria-label="Features">
          {SLOTS.map((s, i) => (
            <li
              key={s.id}
              className="o1-slot"
              data-depth={s.depth}
              data-selected={open === s.id ? 'true' : undefined}
              data-o1-feature={s.id}
              style={slotStyle(s, i)}
            >
              <div className="o1-pop">
                <OutlineTile
                  feature={s.id}
                  size="sm"
                  active={open === s.id}
                  onClick={() => setOpen(open === s.id ? null : s.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {open ? (
        <FeaturePanel feature={open} onSelect={setOpen} onClose={close} />
      ) : null}
    </section>
  );
}
