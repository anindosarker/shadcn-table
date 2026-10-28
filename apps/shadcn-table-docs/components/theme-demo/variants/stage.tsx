'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { DEMO_THEMES, type DemoThemeId } from '../demo-themes';
import { ThemeChips } from '../theme-chips';
import { ThemeScope } from '../theme-scope';
import { useThemeCycle } from '../use-theme-cycle';

const ThemeTable = dynamic(() => import('../theme-table'), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      className="flex min-h-[22rem] items-center justify-center text-sm text-muted-foreground"
    >
      Loading table
    </div>
  ),
});

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/* a crossfade needs the View Transitions API, :active-view-transition (see
 * CSS) and a visitor who wants motion */
const getAnimate = () =>
  'startViewTransition' in document &&
  CSS.supports('selector(:active-view-transition)') &&
  !window.matchMedia(REDUCED_MOTION).matches;
const getServerAnimate = () => false;

/* Only the stage is captured, so the crossfade covers the table alone. The
 * root's default name comes off while a transition runs: a captured root
 * would crossfade the whole page and make it miss every click until the
 * transition ends, overlay pointer-events or not. Nothing else on the site
 * starts a view transition. */
const STAGE_CSS = [
  `html:active-view-transition{view-transition-name:none}`,
  `::view-transition{pointer-events:none}`,
  `::view-transition-old(theme-stage),::view-transition-new(theme-stage){animation-duration:480ms;animation-timing-function:cubic-bezier(0.4,0,0.2,1)}`,
].join('\n');

interface Shown {
  theme: DemoThemeId;
  font?: DemoThemeId;
}

/**
 * Variant 2: theme and font chips above one large table. A change
 * crossfades the table into the new theme through a view transition; the
 * caption below names the theme, font and radius on screen. Without the
 * API, or under reduced motion, the theme swaps at once.
 */
export function Stage() {
  const { theme, paused, select, resume, ref } = useThemeCycle();
  const [font, setFont] = useState<DemoThemeId>();
  // what the table shows; trails the picked theme by one transition
  const [shown, setShown] = useState<Shown>({ theme: theme.id });
  const animate = useSyncExternalStore(
    subscribeReducedMotion,
    getAnimate,
    getServerAnimate,
  );

  useEffect(() => {
    if (!animate || (shown.theme === theme.id && shown.font === font)) return;
    const next = { theme: theme.id, font };
    // the browser snapshots the old frame, then runs the update
    document.startViewTransition(() => flushSync(() => setShown(next)));
  }, [animate, theme.id, font, shown]);

  const current = animate ? shown : { theme: theme.id, font };
  const active = DEMO_THEMES.find((t) => t.id === current.theme)!;
  const fontLabel = DEMO_THEMES.find(
    (t) => t.id === (current.font ?? current.theme),
  )?.fontLabel;

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <style href="theme-demo-stage" precedence="default">
        {STAGE_CSS}
      </style>

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <ThemeChips
          value={theme.id}
          onSelect={select}
          showFonts
          font={font}
          onFontSelect={setFont}
        />
        {paused ? (
          <button
            type="button"
            onClick={resume}
            className="text-xs text-(--dh-ink-muted) underline underline-offset-4 hover:text-(--dh-ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--dh-focus)"
          >
            Resume autoplay
          </button>
        ) : (
          <p className="flex items-center gap-2 text-xs text-(--dh-ink-muted)">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-(--dh-accent)"
            />
            Cycling themes
          </p>
        )}
      </div>

      <figure ref={ref} className="m-0 flex min-w-0 flex-col gap-3">
        <ThemeScope
          theme={current.theme}
          font={current.font}
          className="min-w-0 overflow-hidden rounded-2xl border p-2 shadow-sm [view-transition-name:theme-stage] sm:p-6"
        >
          <ThemeTable />
        </ThemeScope>
        <figcaption
          aria-live={paused ? 'polite' : 'off'}
          className="flex flex-wrap items-baseline gap-x-5 gap-y-1 px-1 font-mono text-xs text-(--dh-ink-muted)"
        >
          <span>
            Theme <span className="text-(--dh-ink)">{active.label}</span>
          </span>
          <span>
            Font <span className="text-(--dh-ink)">{fontLabel}</span>
          </span>
          <span>
            Radius <span className="text-(--dh-ink)">{active.radius}</span>
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
