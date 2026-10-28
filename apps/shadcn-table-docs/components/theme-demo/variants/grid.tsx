'use client';

import dynamic from 'next/dynamic';
import { useState, type CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import {
  DEMO_THEMES,
  type DemoThemeId,
} from '@/components/theme-demo/demo-themes';
import { ThemeScope } from '@/components/theme-demo/theme-scope';

const ThemeTable = dynamic(
  () => import('@/components/theme-demo/theme-table'),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        className="flex min-h-[17rem] items-center justify-center text-sm text-muted-foreground"
      >
        Loading table
      </div>
    ),
  },
);

// a serif, a mono and a grotesk: the three furthest apart on every axis
const INITIAL: readonly DemoThemeId[] = ['paper', 'brutal', 'ocean'];

/**
 * Variant 4: three compact tables side by side, each in its own ThemeScope,
 * same data, no autoplay. Each card has its own theme picker; stacks below
 * lg. A card's menus take its theme because its scope owns the portals once
 * pointed at or focused.
 */
export function ThemeGrid() {
  const [themes, setThemes] = useState(INITIAL);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        Same component, same code. Only the theme differs.
      </p>
      <div className="grid gap-4 lg:grid-cols-3">
        {themes.map((id, i) => (
          <GridCard
            // the slot, not the theme: a pick restyles the card, never remounts it
            key={i}
            slot={i + 1}
            theme={id}
            onSelect={(next) =>
              setThemes((prev) => prev.map((t, j) => (j === i ? next : t)))
            }
          />
        ))}
      </div>
    </div>
  );
}

interface GridCardProps {
  slot: number;
  theme: DemoThemeId;
  onSelect: (id: DemoThemeId) => void;
}

function GridCard({ slot, theme, onSelect }: GridCardProps) {
  const current = DEMO_THEMES.find((t) => t.id === theme) ?? DEMO_THEMES[0];

  return (
    <ThemeScope
      theme={theme}
      className="flex min-w-0 flex-col gap-3 rounded-[calc(var(--radius)+0.25rem)] border p-2.5 shadow-sm transition-colors sm:p-3"
    >
      <div className="flex items-start justify-between gap-3 px-1 pt-1">
        <div className="flex min-w-0 flex-col">
          <span className="text-base font-semibold">{current.label}</span>
          <span className="text-xs text-muted-foreground">
            {current.fontLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            radius {current.radius}
          </span>
        </div>
        <div
          role="group"
          aria-label={`Theme for table ${slot}`}
          className="flex shrink-0 items-center gap-1 pt-0.5"
        >
          {DEMO_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              title={t.label}
              aria-label={t.label}
              aria-pressed={t.id === theme}
              onClick={() => onSelect(t.id)}
              className="grid size-6 place-items-center rounded-full outline-offset-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-ring aria-pressed:ring-2 aria-pressed:ring-foreground/70"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'size-4 rounded-full border border-foreground/20',
                  'bg-(--swatch-light) dark:bg-(--swatch-dark)',
                )}
                style={
                  {
                    '--swatch-light': t.light.primary,
                    '--swatch-dark': t.dark.primary,
                  } as CSSProperties
                }
              />
            </button>
          ))}
        </div>
      </div>
      <div className="min-w-0">
        <ThemeTable compact />
      </div>
    </ThemeScope>
  );
}
