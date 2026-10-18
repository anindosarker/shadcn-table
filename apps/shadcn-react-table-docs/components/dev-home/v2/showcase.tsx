'use client';

import Link from 'next/link';
import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { ArrowRightIcon } from 'lucide-react';
import {
  LiveTable,
  type LiveExampleKey,
} from '@/components/dev-home/shared/live-table';

const TABS: {
  key: LiveExampleKey;
  label: string;
  /** Shorter label for phones, so four tabs fit at 320px. */
  short?: string;
  href: string;
}[] = [
  {
    key: 'advanced',
    label: 'Advanced',
    href: '/docs/examples/advanced',
  },
  {
    key: 'editing',
    label: 'Editing',
    href: '/docs/examples/editing-crud-inline-table',
  },
  {
    key: 'grouping',
    label: 'Grouping',
    href: '/docs/examples/aggregation-and-grouping',
  },
  {
    key: 'virtualization',
    label: 'Virtualization',
    short: 'Virtual',
    href: '/docs/examples/virtualized',
  },
];

/**
 * Tab strip + live table. Visited tables stay mounted in one grid cell, so
 * switching keeps their state and the stage never shrinks under the reader.
 */
export function Showcase() {
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState<ReadonlySet<number>>(
    () => new Set([0]),
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const select = (i: number, focus = false) => {
    setActive(i);
    setVisited((v) => (v.has(i) ? v : new Set(v).add(i)));
    if (focus) tabRefs.current[i]?.focus({ preventScroll: true });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = TABS.length - 1;
    const next =
      e.key === 'ArrowRight'
        ? active === last
          ? 0
          : active + 1
        : e.key === 'ArrowLeft'
          ? active === 0
            ? last
            : active - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
  };

  const tab = TABS[active];

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div
            role="tablist"
            aria-label="Live examples"
            onKeyDown={onKeyDown}
            className="v2-tabs w-full sm:w-auto"
            style={
              {
                '--v2-tab-count': TABS.length,
                '--v2-tab-index': active,
              } as CSSProperties
            }
          >
            <span aria-hidden="true" className="v2-tab-pill" />
            {TABS.map((t, i) => (
              <button
                key={t.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${t.key}`}
                aria-selected={i === active}
                aria-controls={
                  visited.has(i) ? `${id}-panel-${t.key}` : undefined
                }
                tabIndex={i === active ? 0 : -1}
                onClick={() => select(i)}
                aria-label={t.short ? t.label : undefined}
                className="v2-tab"
              >
                {t.short ? (
                  <>
                    <span className="sm:hidden">{t.short}</span>
                    <span className="hidden sm:inline">{t.label}</span>
                  </>
                ) : (
                  t.label
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 items-center text-xs">
          <Link
            href={tab.href}
            className="v2-focus inline-flex shrink-0 items-center gap-1.5 rounded-full border border-(--dh-rule) bg-(--dh-paper) px-3.5 py-2 whitespace-nowrap text-(--dh-ink-muted) hover:text-(--dh-ink)"
          >
            Source for {tab.label.toLowerCase()}
            <ArrowRightIcon aria-hidden="true" className="v2-arrow size-3.5" />
          </Link>
        </div>
      </div>

      <div className="v2-stage min-w-0">
        <div className="v2-panels">
          {TABS.map((t, i) =>
            visited.has(i) ? (
              <div
                key={t.key}
                role="tabpanel"
                id={`${id}-panel-${t.key}`}
                aria-labelledby={`${id}-tab-${t.key}`}
                data-active={i === active}
                inert={i !== active}
                aria-hidden={i !== active}
              >
                <LiveTable
                  example={t.key}
                  className="rounded-[18px] border-0"
                />
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
