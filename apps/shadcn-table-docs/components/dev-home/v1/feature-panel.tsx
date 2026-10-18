'use client';

import { useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  XIcon,
} from 'lucide-react';
import {
  FEATURES,
  OutlineArt,
  getFeature,
  type FeatureId,
} from '@/components/dev-home/shared/outline-tiles';
import { LiveTable } from '@/components/dev-home/shared/live-table';

interface FeaturePanelProps {
  feature: FeatureId;
  onSelect: (id: FeatureId) => void;
  onClose: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** The live example for one feature, opened in place under the orbit. */
export function FeaturePanel({
  feature,
  onSelect,
  onClose,
}: FeaturePanelProps) {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const f = getFeature(feature);
  const index = FEATURES.findIndex((x) => x.id === feature);
  const step = (by: number) =>
    onSelect(FEATURES[(index + by + FEATURES.length) % FEATURES.length].id);

  // first open only: bring the panel into view and move focus to it
  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    root.current?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
    title.current?.focus({ preventScroll: true });
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <section
      ref={root}
      className="o1-panel"
      aria-labelledby="o1-panel-title"
      onKeyDown={onKeyDown}
    >
      <div className="o1-panel-inner">
        <div className="o1-panel-meta">
          <div className="flex items-center justify-between gap-3">
            <p className="o1-hint" aria-live="polite">
              Feature {pad(index + 1)} / {pad(FEATURES.length)}
            </p>
            <div className="flex gap-1.5">
              <button
                type="button"
                className="o1-iconbtn"
                onClick={() => step(-1)}
                aria-label="Previous feature"
              >
                <ArrowLeftIcon aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                className="o1-iconbtn"
                onClick={() => step(1)}
                aria-label="Next feature"
              >
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                className="o1-iconbtn"
                onClick={onClose}
                aria-label="Close live example"
              >
                <XIcon aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>

          <span className="dh-tile o1-panel-art" data-active="true">
            <OutlineArt feature={feature} />
          </span>

          <h2
            id="o1-panel-title"
            ref={title}
            tabIndex={-1}
            className="o1-panel-title"
          >
            {f.title}
          </h2>
          <p className="m-0 text-[0.975rem] leading-relaxed text-(--dh-ink-muted)">
            {f.description}
          </p>
          <div className="flex flex-col gap-1.5">
            <span className="o1-hint">Turn it on</span>
            <code className="o1-code">{f.prop}</code>
          </div>
          <Link href={f.docsHref} className="o1-btn o1-btn-ghost self-start">
            Read the guide
            <ArrowUpRightIcon aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <LiveTable
          key={feature}
          example={f.example}
          className="self-start bg-(--dh-paper)"
          caption={`Live: the ${f.title.toLowerCase()} example from the docs, running here.`}
        />
      </div>
    </section>
  );
}
