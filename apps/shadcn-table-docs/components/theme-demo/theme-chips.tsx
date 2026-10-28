'use client';

import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { DEMO_THEMES, type DemoThemeId } from './demo-themes';

export interface ThemeChipsProps {
  value: DemoThemeId;
  onSelect: (id: DemoThemeId) => void;
  /** Adds a second row that picks the font on its own. */
  showFonts?: boolean;
  /** The font override; undefined follows the theme's font. */
  font?: DemoThemeId;
  onFontSelect?: (id: DemoThemeId | undefined) => void;
  className?: string;
}

// one chip per face (two themes share Inter)
const FONTS = DEMO_THEMES.filter(
  (t, i) => DEMO_THEMES.findIndex((u) => u.fontLabel === t.fontLabel) === i,
);

const CHIP =
  'inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground aria-pressed:border-foreground aria-pressed:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

/**
 * The demo's picker, drawn in the site theme: a chip per demo theme (its
 * primary as a swatch, light or dark with the site mode), and with
 * `showFonts` a row of the demo faces, each label set in its own face.
 */
export function ThemeChips({
  value,
  onSelect,
  showFonts = false,
  font,
  onFontSelect,
  className,
}: ThemeChipsProps) {
  const fontLabel = DEMO_THEMES.find(
    (t) => t.id === (font ?? value),
  )?.fontLabel;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div role="group" aria-label="Theme" className="flex flex-wrap gap-1.5">
        {DEMO_THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={t.id === value}
            onClick={() => onSelect(t.id)}
            className={CHIP}
          >
            <span
              aria-hidden="true"
              className="size-3 rounded-full border border-foreground/15 bg-(--swatch-light) dark:bg-(--swatch-dark)"
              style={
                {
                  '--swatch-light': t.light.primary,
                  '--swatch-dark': t.dark.primary,
                } as CSSProperties
              }
            />
            {t.label}
          </button>
        ))}
      </div>

      {showFonts ? (
        <div role="group" aria-label="Font" className="flex flex-wrap gap-1.5">
          <button
            type="button"
            aria-pressed={font === undefined}
            onClick={() => onFontSelect?.(undefined)}
            className={CHIP}
          >
            Theme font
          </button>
          {FONTS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={font !== undefined && t.fontLabel === fontLabel}
              onClick={() => onFontSelect?.(t.id)}
              className={CHIP}
              style={{ fontFamily: t.font }}
            >
              {t.fontLabel}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
