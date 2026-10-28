'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type RefCallback,
} from 'react';
import {
  CheckIcon,
  FileCodeIcon,
  LockIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
} from 'lucide-react';
import { InstallCommand } from '@/components/dev-home/shared/install-command';
import { cn } from '@/lib/cn';
import { namespaceAddCommand } from '@/lib/install';
import { DEMO_THEMES, type DemoThemeId } from '../demo-themes';
import { ThemeScope } from '../theme-scope';
import { ExistingApp } from './matches-app';
import {
  EXAMPLE_THEME,
  PastePanel,
  useScopeTokens,
  type PastedTheme,
} from './matches-paste';

// the words describe the visitor's app, not our theme names
const PERSONA: Record<DemoThemeId, string> = {
  neutral: 'minimal',
  paper: 'editorial',
  brutal: 'brutal',
  ocean: 'calm',
  candy: 'playful',
};

// the last step, after the five themes
const YOURS = DEMO_THEMES.length;
const HOLD_MS = 3800;

const SENTENCE = `Your app is ${DEMO_THEMES.map((t) => PERSONA[t.id]).join(', ')} or yours. Add the table. It already matches.`;

/* Colours ease between themes; base layer, so a part's own transition
 * utility still wins. The bar under the frame fills over one hold. */
const CSS = [
  `@layer base{@media (prefers-reduced-motion:no-preference){.matches-scope,.matches-scope :where(*){transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke;transition-duration:250ms;transition-timing-function:ease}}}`,
  `@keyframes matches-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}`,
].join('\n');

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
const getServerReducedMotion = () => false;

/* The site mode and page background, as one string: next-themes toggles
 * html.dark and the preset picker html[data-theme]. */
function subscribeSite(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme', 'style'],
  });
  return () => observer.disconnect();
}

const getSite = () => {
  const html = document.documentElement;
  const background = getComputedStyle(html)
    .getPropertyValue('--background')
    .trim();
  return `${html.classList.contains('dark') ? 'dark' : 'light'}|${background}`;
};
// the site defaults to dark; no background, so no contrast fallback
const getServerSite = () => 'dark|';

const rgbCache = new Map<string, number[] | null>();

// any CSS colour as sRGB bytes, by painting one canvas pixel
function toRgb(color: string) {
  if (!rgbCache.has(color)) {
    const ctx = document
      .createElement('canvas')
      .getContext('2d', { willReadFrequently: true });
    let rgb: number[] | null = null;
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      rgb = [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)];
    }
    rgbCache.set(color, rgb);
  }
  return rgbCache.get(color) ?? null;
}

const luminance = (rgb: number[]) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// below 3:1 on the page, the minimum for large text
function lowContrast(color: string, background: string) {
  if (!background) return false;
  const a = toRgb(color);
  const b = toRgb(background);
  if (!a || !b) return false;
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05) < 3;
}

type Mode = 'auto' | 'paused' | 'playing';

/**
 * Variant 5, "It already matches": a headline word describing the
 * visitor's app ("Your app is brutal.") over a browser frame holding a
 * small app of stock shadcn/ui parts and the table, in one ThemeScope. One
 * step index drives both, so the word and the demo change in the same
 * render. After the five themes it lands on "Your app is yours." with a
 * form that applies a pasted theme. Hover or focus on either tier holds
 * the rotation; reduced motion turns autoplay off.
 */
export function Matches() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Mode>('auto');
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reached, setReached] = useState(false);
  const [pasted, setPasted] = useState<PastedTheme>(EXAMPLE_THEME);
  const anchor = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const site = useSyncExternalStore(subscribeSite, getSite, getServerSite);
  const [siteMode, background] = site.split('|');
  const dark = siteMode === 'dark';

  // the form, once shown, stays
  if (step === YOURS && !reached) setReached(true);

  const paused = mode === 'paused' || (mode === 'auto' && reducedMotion);
  const playing = !paused && step < YOURS;
  const running = playing && visible && !hover && !focus;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setStep((s) => s + 1), HOLD_MS);
    return () => clearTimeout(t);
  }, [running, step]);

  const tokens = step === YOURS ? (dark ? pasted.dark : pasted.light) : null;
  useScopeTokens(anchor, tokens);

  const theme = DEMO_THEMES[Math.min(step, YOURS - 1)];
  // under the pasted tokens, the base for anything the paste leaves out
  const scopeTheme = step === YOURS ? 'neutral' : theme.id;

  const go = (next: number) => {
    setStep(next);
    setMode('paused');
  };

  const toggle = () => {
    if (playing) {
      setMode('paused');
      return;
    }
    if (step === YOURS) setStep(0);
    setMode('playing');
  };

  const onApply = (next: PastedTheme) => {
    setPasted(next);
    go(YOURS);
  };

  const section = useCallback<RefCallback<HTMLElement>>((el) => {
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // a touch leaves no pointerleave to end the hold
  const holdHover = {
    onPointerEnter: (event: PointerEvent) =>
      event.pointerType === 'mouse' && setHover(true),
    onPointerLeave: () => setHover(false),
  };
  const holdFocus = {
    onFocus: () => setFocus(true),
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocus(false);
    },
  };

  const primaryOf = (id: DemoThemeId) => {
    const t = DEMO_THEMES.find((u) => u.id === id)!;
    return dark ? t.dark.primary : t.light.primary;
  };

  const words = [
    ...DEMO_THEMES.map((t) => ({
      key: t.id,
      word: PERSONA[t.id],
      color: primaryOf(t.id),
      font: t.font,
    })),
    {
      key: 'yours',
      word: 'yours',
      color: (dark ? pasted.dark : pasted.light).primary ?? '',
      font: 'var(--dh-font-sans)',
    },
  ];

  return (
    <section
      ref={section}
      aria-labelledby="matches-title"
      className="flex min-w-0 flex-col gap-10 sm:gap-14"
    >
      <style href="theme-demo-matches" precedence="default">
        {CSS}
      </style>

      <div {...holdHover} className="flex flex-col items-center text-center">
        <h1
          id="matches-title"
          className="flex flex-col items-center gap-3 sm:gap-4"
        >
          <span className="sr-only">{SENTENCE}</span>
          <span
            aria-hidden="true"
            className="v4-display text-[clamp(1.75rem,5vw,3.75rem)]"
          >
            Your app is
          </span>
          <span
            aria-hidden="true"
            className="grid max-w-full justify-items-center text-[clamp(3rem,11vw,8rem)] leading-[1.1]"
          >
            {words.map((w, i) => {
              const fallback = !w.color || lowContrast(w.color, background);
              return (
                <span
                  key={w.key}
                  className={cn(
                    'col-start-1 row-start-1 font-semibold tracking-[-0.03em] whitespace-nowrap transition-[opacity,translate] duration-[450ms] ease-out motion-reduce:transition-none',
                    i === step
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-[0.08em] opacity-0',
                  )}
                  style={{ fontFamily: w.font }}
                >
                  <span
                    className={cn(
                      fallback &&
                        'underline decoration-[0.06em] underline-offset-[0.12em]',
                    )}
                    style={
                      fallback
                        ? {
                            color: 'var(--dh-ink)',
                            textDecorationColor: w.color || 'var(--dh-accent)',
                          }
                        : { color: w.color }
                    }
                  >
                    {w.word}
                  </span>
                  <span className="text-(--dh-ink)">.</span>
                </span>
              );
            })}
          </span>
          <span
            aria-hidden="true"
            className="text-lg font-medium text-pretty text-(--dh-ink-muted) sm:text-2xl"
          >
            Add the table.{' '}
            <span className="text-(--dh-ink)">It already matches.</span>
          </span>
        </h1>
        <InstallCommand
          command={namespaceAddCommand()}
          className="mt-6 w-full max-w-md sm:mt-8"
        />
      </div>

      <figure className="v12-bleed m-0 min-w-0">
        <div className="overflow-hidden rounded-xl border border-(--dh-rule-strong) bg-(--dh-paper-2) shadow-[0_24px_60px_-30px_rgb(0_0_0/0.45)]">
          <div className="flex items-center gap-3 border-b border-(--dh-rule) px-3 py-2">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-(--dh-rule-strong)" />
              <span className="size-2.5 rounded-full bg-(--dh-rule-strong)" />
              <span className="size-2.5 rounded-full bg-(--dh-rule-strong)" />
            </span>
            <span className="mx-auto flex h-7 w-full max-w-xs min-w-0 items-center justify-center gap-1.5 rounded-md bg-(--dh-paper-3) px-3 font-mono text-xs text-(--dh-ink-muted)">
              <LockIcon aria-hidden="true" className="size-3 shrink-0" />
              yourapp.com
            </span>
            <span aria-hidden="true" className="w-[2.875rem] shrink-0" />
          </div>

          <div
            {...holdHover}
            {...holdFocus}
            onPointerDown={() => setMode('paused')}
          >
            <ThemeScope
              theme={scopeTheme}
              className="matches-scope min-w-0 p-3 sm:p-6"
            >
              <div ref={anchor}>
                <ExistingApp />
              </div>
            </ThemeScope>
          </div>

          <figcaption className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-(--dh-rule) px-3 py-2.5 sm:px-4">
            {running ? (
              <span
                key={step}
                aria-hidden="true"
                className="absolute inset-x-0 top-[-1px] h-px origin-left animate-[matches-fill_var(--matches-hold)_linear_forwards] bg-(--dh-accent) motion-reduce:hidden"
                style={{ '--matches-hold': `${HOLD_MS}ms` } as CSSProperties}
              />
            ) : null}
            <span className="flex items-center gap-2 font-mono text-xs text-(--dh-ink-muted)">
              <FileCodeIcon aria-hidden="true" className="size-3.5" />
              data-table.tsx:
              <span className="flex items-center gap-1 text-(--dh-ink)">
                <CheckIcon
                  aria-hidden="true"
                  className="size-3.5 text-(--dh-accent)"
                />
                0 changes
              </span>
            </span>

            <div className="flex items-center gap-3">
              <div
                role="group"
                aria-label="App theme"
                className="flex items-center gap-1"
              >
                {DEMO_THEMES.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-label={`${PERSONA[t.id]} (${t.label} theme)`}
                    aria-pressed={i === step}
                    onClick={() => go(i)}
                    className="group grid size-7 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-(--dh-focus)"
                  >
                    <span
                      aria-hidden="true"
                      className="size-3 rounded-full ring-(--dh-ink) ring-offset-2 ring-offset-(--dh-paper-2) transition-transform group-hover:scale-125 group-aria-pressed:ring-2"
                      style={{ backgroundColor: primaryOf(t.id) }}
                    />
                  </button>
                ))}
                <button
                  type="button"
                  aria-pressed={step === YOURS}
                  onClick={() => go(YOURS)}
                  className="ml-1 inline-flex h-7 items-center gap-1 rounded-full border border-dashed border-(--dh-rule-strong) px-2.5 text-xs font-medium text-(--dh-ink-muted) hover:text-(--dh-ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--dh-focus) aria-pressed:border-solid aria-pressed:border-(--dh-ink) aria-pressed:text-(--dh-ink)"
                >
                  <PlusIcon aria-hidden="true" className="size-3" />
                  Yours
                </button>
              </div>
              <button
                type="button"
                onClick={toggle}
                aria-label={
                  playing ? 'Pause theme rotation' : 'Play theme rotation'
                }
                className="grid size-7 place-items-center rounded-full border border-(--dh-rule-strong) text-(--dh-ink) hover:bg-(--dh-paper-3) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--dh-focus)"
              >
                {playing ? (
                  <PauseIcon aria-hidden="true" className="size-3.5" />
                ) : (
                  <PlayIcon aria-hidden="true" className="size-3.5" />
                )}
              </button>
            </div>
          </figcaption>
        </div>
      </figure>

      <div
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none',
          reached ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div inert={!reached} className="min-h-0 overflow-hidden">
          <PastePanel onApply={onApply} />
        </div>
      </div>
    </section>
  );
}
