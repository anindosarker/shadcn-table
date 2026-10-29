'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import type {
  DemoTheme,
  DemoTokenName,
} from '@/components/theme-demo/demo-themes';
import { ThemeChips } from '@/components/theme-demo/theme-chips';
import { ThemeScope } from '@/components/theme-demo/theme-scope';
import { useThemeCycle } from '@/components/theme-demo/use-theme-cycle';
import { cn } from '@/lib/cn';
import {
  defaultBase,
  initCommand,
  installDir,
  libraryAddCommand,
} from '@/lib/install';

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
  // the globals.css block, live for the current theme
  | { kind: 'css' };

// The commands run on the edition a reader sees first (defaultBase, the
// library's DEFAULT_EDITION).
const SCRIPT: readonly Line[] = [
  { kind: 'cmd', text: initCommand(defaultBase, 'npm') },
  { kind: 'out', text: 'Created components.json' },
  { kind: 'out', text: 'Updated app/globals.css' },
  { kind: 'cmd', text: libraryAddCommand(defaultBase, 'npm') },
  { kind: 'out', text: `Installed ${installDir}` },
  { kind: 'cmd', text: 'cat app/globals.css' },
  { kind: 'css' },
];
const DONE = SCRIPT.length;

/* a beat before each command, one letter per charMs (a long URL types
 * faster, so no command takes more than about a second), a beat for Enter, then
 * each output line */
const LEAD_MS = 400;
const ENTER_MS = 300;
const OUT_MS = 260;
const charMs = (text: string) => Math.min(32, 900 / text.length);

// the colour tokens the block lists, then --radius and --font-sans
const SHOWN: readonly DemoTokenName[] = [
  'background',
  'foreground',
  'primary',
  'primary-foreground',
  'accent',
  'border',
];

/* swap: a changed value types itself in and glows; caret: blinks. Both
 * hold still under reduced motion. */
const CSS = `
@keyframes tt-type{from{clip-path:inset(0 100% 0 0)}}
@keyframes tt-glow{from{background-color:rgb(255 255 255/.14)}}
@keyframes tt-blink{50%{opacity:0}}
.tt-swap{display:inline-block;border-radius:2px;animation:tt-type 360ms steps(var(--tt-n),end) both,tt-glow 1100ms ease-out}
.tt-caret{animation:tt-blink 1s steps(1) infinite}
@media (prefers-reduced-motion:reduce){.tt-swap,.tt-caret{animation:none}}
`;

function Caret() {
  return (
    <span
      aria-hidden="true"
      className="tt-caret ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-zinc-300"
    />
  );
}

/** A value that types itself in again whenever the theme changes. */
function Swap({ id, text }: { id: string; text: string }) {
  return (
    <span
      key={id}
      className="tt-swap text-amber-200"
      style={{ '--tt-n': text.length } as CSSProperties}
    >
      {text}
    </span>
  );
}

function Decl({
  name,
  swatch,
  children,
}: {
  name: string;
  swatch: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 pl-4">
      <span className="text-sky-300">--{name}:</span>
      <span className="flex items-center gap-2 whitespace-nowrap">
        {swatch}
        <span>{children}</span>
      </span>
    </div>
  );
}

function ColorDecls({
  theme,
  mode,
}: {
  theme: DemoTheme;
  mode: 'light' | 'dark';
}) {
  return SHOWN.map((name) => (
    <Decl
      key={name}
      name={name}
      swatch={
        <span
          aria-hidden="true"
          className="size-3 shrink-0 rounded-[3px] ring-1 ring-white/20 transition-colors duration-300"
          style={{ backgroundColor: theme[mode][name] }}
        />
      }
    >
      <Swap id={`${theme.id}-${mode}`} text={theme[mode][name]} />
      <span className="text-zinc-500">;</span>
    </Decl>
  ));
}

/** The globals.css block: :root carries radius, font and the light colours;
 * in dark mode the colours move to a .dark block, as in a shadcn/ui app. */
function GlobalsCss({ theme }: { theme: DemoTheme }) {
  // the generic family the theme's stack ends on
  const generic = theme.font.split(',').at(-1)?.trim();
  return (
    <div className="mt-1 mb-3">
      <div className="text-zinc-500">{`/* ${theme.label} */`}</div>
      <div className="text-fuchsia-300">
        :root <span className="text-zinc-400">{'{'}</span>
      </div>
      <Decl
        name="radius"
        swatch={
          <span
            aria-hidden="true"
            className="size-3 shrink-0 border-t-2 border-l-2 border-zinc-300 transition-[border-radius] duration-300"
            style={{ borderTopLeftRadius: `min(${theme.radius}, 0.75rem)` }}
          />
        }
      >
        <Swap id={theme.id} text={theme.radius} />
        <span className="text-zinc-500">;</span>
      </Decl>
      <Decl
        name="font-sans"
        swatch={
          <span
            aria-hidden="true"
            className="w-3 shrink-0 text-center leading-none text-zinc-100"
            style={{ fontFamily: theme.font }}
          >
            Aa
          </span>
        }
      >
        <Swap id={theme.id} text={`"${theme.fontLabel}", ${generic}`} />
        <span className="text-zinc-500">;</span>
      </Decl>
      <div className="dark:hidden">
        <ColorDecls theme={theme} mode="light" />
      </div>
      <div className="text-zinc-400">{'}'}</div>
      <div className="hidden dark:block">
        <div className="text-fuchsia-300">
          .dark <span className="text-zinc-400">{'{'}</span>
        </div>
        <ColorDecls theme={theme} mode="dark" />
        <div className="text-zinc-400">{'}'}</div>
      </div>
    </div>
  );
}

/**
 * Theme demo variant 1: a terminal installs shadcn/ui and the table, then
 * prints a globals.css whose values swap with each theme, beside the live
 * table in that theme. Autoplay via useThemeCycle; a chip pick, or any
 * interaction with the table, takes over. Reduced motion, or a pick before
 * the replay ends, shows the finished terminal.
 */
export function TerminalDemo() {
  const { theme, paused, select, resume, ref } = useThemeCycle();
  // the line in progress; lines before it are complete
  const [step, setStep] = useState(0);
  // letters typed of the command in progress
  const [typed, setTyped] = useState(0);

  // paused (a pick, or reduced motion): land on the finished terminal
  if (paused && step < DONE) setStep(DONE);

  useEffect(() => {
    if (step >= DONE) return;
    const line = SCRIPT[step];
    const typing = line.kind === 'cmd' && typed < line.text.length;
    const delay =
      line.kind !== 'cmd'
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
  }, [step, typed]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ThemeChips value={theme.id} onSelect={select} />
        {paused ? (
          <button
            type="button"
            onClick={resume}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Resume autoplay
          </button>
        ) : (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-emerald-500"
            />
            Cycling themes
          </p>
        )}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <figure
          aria-label="Terminal: install shadcn/ui and shadcn-table, then the theme tokens in globals.css"
          className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-lg shadow-black/10"
        >
          <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-2.5">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-zinc-700" />
              <span className="size-2.5 rounded-full bg-zinc-700" />
              <span className="size-2.5 rounded-full bg-zinc-700" />
            </span>
            <span className="font-mono text-xs text-zinc-500">~/my-app</span>
          </div>

          <div className="min-h-0 flex-1 overflow-x-auto px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-zinc-300">
            {SCRIPT.map((line, i) => {
              if (i > step) return null;
              if (line.kind === 'out')
                return i < step ? (
                  <div key={i} className="flex gap-2">
                    <span aria-hidden="true" className="text-emerald-400">
                      ✔
                    </span>
                    {line.text}
                  </div>
                ) : null;
              if (line.kind === 'css')
                return i < step ? <GlobalsCss key={i} theme={theme} /> : null;
              return (
                <div
                  key={i}
                  className={cn('break-all text-zinc-100', i > 0 && 'mt-3')}
                >
                  <span aria-hidden="true" className="text-emerald-400">
                    ${' '}
                  </span>
                  {i < step ? line.text : line.text.slice(0, typed)}
                  {i === step ? <Caret /> : null}
                </div>
              );
            })}
            {step >= DONE ? (
              <div className="text-zinc-100">
                <span aria-hidden="true" className="text-emerald-400">
                  ${' '}
                </span>
                <Caret />
              </div>
            ) : null}
          </div>
        </figure>

        <div ref={ref} className="min-w-0">
          <ThemeScope
            theme={theme.id}
            className="overflow-hidden rounded-xl border p-3 transition-[border-radius] duration-300"
          >
            <ThemeTable />
          </ThemeScope>
        </div>
      </div>

      <style href="theme-demo-terminal" precedence="default">
        {CSS}
      </style>
    </div>
  );
}
