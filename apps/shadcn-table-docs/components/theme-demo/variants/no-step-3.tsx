'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { ArrowUpRightIcon, RotateCcwIcon, ShuffleIcon } from 'lucide-react';
import { applyThemePreset } from '@/components/theme-preset-switcher';
import { cn } from '@/lib/cn';
import { installDir, namespaceAddCommand } from '@/lib/install';
import {
  DEFAULT_THEME,
  isThemePreset,
  THEME_PRESETS,
  type ThemePreset,
} from '@/lib/theme-presets';

const ThemeTable = dynamic(
  () => import('@/components/theme-demo/theme-table'),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        className="flex min-h-[22rem] items-center justify-center text-sm text-muted-foreground"
      >
        Loading table
      </div>
    ),
  },
);

type Line =
  | { kind: 'cmd'; text: string }
  | { kind: 'out'; text: string }
  // git's empty output, with the annotation that explains it
  | { kind: 'empty' }
  | { kind: 'comment'; text: string };

const SCRIPT: readonly Line[] = [
  { kind: 'cmd', text: namespaceAddCommand(undefined, 'npm') },
  { kind: 'out', text: `Installed ${installDir}` },
  { kind: 'cmd', text: 'git diff --stat -- app/globals.css' },
  { kind: 'empty' },
  {
    kind: 'comment',
    text: '# no step 3: no theme file, no wrapper, no config',
  },
];
const DONE = SCRIPT.length;

/* a beat before each command, one letter per charMs (capped near a second
 * per command), a beat for Enter, then each output line; the empty diff
 * holds longer so the silence reads */
const LEAD_MS = 500;
const ENTER_MS = 320;
const OUT_MS = 280;
const EMPTY_MS = 900;
const charMs = (text: string) => Math.min(38, 1000 / text.length);

// caret blink; a static caret under reduced motion
const CSS = `
@keyframes ns-blink{50%{opacity:0}}
.ns-caret{animation:ns-blink 1s steps(1) infinite}
@media (prefers-reduced-motion:reduce){.ns-caret{animation:none}}
`;

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** The site preset, read from `<html data-theme>`: the nav picker writes it,
 * so an observer on the attribute catches every pick, ours or the nav's. */
function subscribePreset(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

function getPreset(): ThemePreset {
  const current = document.documentElement.dataset.theme;
  return isThemePreset(current) ? current : DEFAULT_THEME;
}

function Caret() {
  return (
    <span
      aria-hidden="true"
      className="ns-caret ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-zinc-300"
    />
  );
}

function Prompt() {
  return (
    <span aria-hidden="true" className="text-emerald-400">
      ${' '}
    </span>
  );
}

/** The annotation under the empty diff. Each token carries a swatch drawn
 * from the live site token, so the terminal shows the values it names. */
function EmptyDiff() {
  return (
    <div className="mt-1 flex flex-col gap-1.5">
      <span className="text-zinc-600 italic">(no output)</span>
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-zinc-500">
        <span>no changes: it already uses your</span>
        <span className="flex items-center gap-1.5 text-sky-300/80">
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-[2px] bg-primary transition-colors duration-300"
          />
          --primary,
        </span>
        <span className="flex items-center gap-1.5 text-sky-300/80">
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 border-t-2 border-l-2 border-zinc-400"
            style={{ borderTopLeftRadius: 'min(var(--radius), 0.5rem)' }}
          />
          --radius,
        </span>
        <span className="flex items-center gap-1.5 text-sky-300/80">
          <span
            aria-hidden="true"
            className="font-sans leading-none text-zinc-200"
          >
            Aa
          </span>
          --font-sans
        </span>
      </span>
    </div>
  );
}

/**
 * Theme demo variant 7 ("No step 3"): a terminal installs the table, then
 * diffs globals.css and finds nothing to change. The live table beside it
 * has no theme scope of its own: it follows the site preset and the
 * light/dark mode, so the nav picker, or the cycle button here, restyles it.
 * Reduced motion shows the finished terminal.
 */
export function NoStep3Demo() {
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
  const preset = useSyncExternalStore(
    subscribePreset,
    getPreset,
    () => DEFAULT_THEME,
  );
  const active =
    THEME_PRESETS.find((p) => p.name === preset) ?? THEME_PRESETS[0];

  // the line in progress; lines before it are complete
  const [step, setStep] = useState(0);
  // letters typed of the command in progress
  const [typed, setTyped] = useState(0);
  const shown = reduced ? DONE : step;

  useEffect(() => {
    if (reduced || step >= DONE) return;
    const line = SCRIPT[step];
    const typing = line.kind === 'cmd' && typed < line.text.length;
    const delay =
      line.kind === 'empty'
        ? EMPTY_MS
        : line.kind !== 'cmd'
          ? OUT_MS
          : typed === 0
            ? LEAD_MS
            : typing
              ? charMs(line.text)
              : ENTER_MS;
    const t = setTimeout(() => {
      if (typing) {
        setTyped(typed + 1);
        return;
      }
      setStep(step + 1);
      setTyped(0);
    }, delay);
    return () => clearTimeout(t);
  }, [reduced, step, typed]);

  const replay = () => {
    setStep(0);
    setTyped(0);
  };

  const cycle = () => {
    const i = THEME_PRESETS.findIndex((p) => p.name === preset);
    applyThemePreset(THEME_PRESETS[(i + 1) % THEME_PRESETS.length].name);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-[radial-gradient(color-mix(in_oklch,var(--primary)_22%,transparent)_1px,transparent_1px)] bg-size-[14px_14px] p-2 transition-colors duration-300 sm:p-4">
      <div className="grid items-stretch gap-2 sm:gap-4 min-[88rem]:grid-cols-[minmax(0,1fr)_minmax(0,52rem)]">
        <figure
          aria-label="Terminal: install shadcn-table, then diff globals.css"
          className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-lg shadow-black/10"
        >
          <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-2.5">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-zinc-700" />
              <span className="size-2.5 rounded-full bg-zinc-700" />
              <span className="size-2.5 rounded-full bg-zinc-700" />
            </span>
            <span className="font-mono text-xs text-zinc-500">~/my-app</span>
            {reduced ? null : (
              <button
                type="button"
                onClick={replay}
                disabled={shown < DONE}
                className="ml-auto flex items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:outline-none disabled:opacity-0"
              >
                <RotateCcwIcon aria-hidden="true" className="size-3" />
                Replay
              </button>
            )}
          </div>

          {/* the full transcript for screen readers; the typing is hidden */}
          <div className="sr-only">
            {SCRIPT.map((line, i) => (
              <p key={i}>
                {line.kind === 'empty'
                  ? 'No output. No changes: it already uses your --primary, --radius and --font-sans.'
                  : line.text}
              </p>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="flex-1 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-zinc-300"
          >
            {SCRIPT.map((line, i) => {
              if (i > shown) return null;
              if (line.kind === 'cmd')
                return (
                  <div
                    key={i}
                    className={cn('break-all text-zinc-100', i > 0 && 'mt-4')}
                  >
                    <Prompt />
                    {i < shown ? line.text : line.text.slice(0, typed)}
                    {i === shown ? <Caret /> : null}
                  </div>
                );
              if (i === shown) return null;
              if (line.kind === 'out')
                return (
                  <div key={i} className="flex gap-2">
                    <span className="text-emerald-400">✔</span>
                    {line.text}
                  </div>
                );
              if (line.kind === 'empty') return <EmptyDiff key={i} />;
              return (
                <div key={i} className="mt-4 text-zinc-500">
                  {line.text}
                </div>
              );
            })}
            {shown >= DONE ? (
              <div className="mt-4 text-zinc-100">
                <Prompt />
                <Caret />
              </div>
            ) : null}
          </div>
        </figure>

        <div className="flex min-w-0 flex-col gap-2 sm:gap-3">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border bg-background px-3 py-2 transition-colors duration-300">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full bg-primary transition-colors duration-300"
              />
              <span>
                Site theme:{' '}
                <span
                  aria-live="polite"
                  className="font-medium text-foreground"
                >
                  {active.label}
                </span>
              </span>
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                Try the theme picker up top
                <ArrowUpRightIcon aria-hidden="true" className="size-3.5" />
              </span>
              <button
                type="button"
                onClick={cycle}
                className="inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <ShuffleIcon aria-hidden="true" className="size-3.5" />
                Next theme
              </button>
            </div>
          </div>
          <div className="flex-1 rounded-xl bg-background shadow-lg shadow-black/5 transition-colors duration-300">
            <ThemeTable />
          </div>
        </div>
      </div>

      <style href="theme-demo-no-step-3" precedence="default">
        {CSS}
      </style>
    </div>
  );
}
