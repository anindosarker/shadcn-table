'use client';

import dynamic from 'next/dynamic';
import {
  useId,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { LockIcon, PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react';
import {
  DEMO_THEMES,
  type DemoTheme,
  type DemoThemeId,
  type DemoTokenName,
} from '@/components/theme-demo/demo-themes';
import { ThemeScope } from '@/components/theme-demo/theme-scope';
import { useThemeCycle } from '@/components/theme-demo/use-theme-cycle';
import { Badge } from '@/components/ui-radix/badge';
import { Button } from '@/components/ui-radix/button';
import { Input } from '@/components/ui-radix/input';
import { cn } from '@/lib/cn';

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

type Mode = 'light' | 'dark';

// each demo theme, presented as somebody else's site
const SITES: Readonly<Record<DemoThemeId, { domain: string; name: string }>> = {
  neutral: { domain: 'acme.dev', name: 'Acme' },
  paper: { domain: 'paper.blog', name: 'Paper' },
  brutal: { domain: 'kernel.sh', name: 'Kernel' },
  ocean: { domain: 'tide.app', name: 'Tide' },
  candy: { domain: 'sprinkle.shop', name: 'Sprinkle' },
};

const FIRST = DEMO_THEMES[0];
const LAST = DEMO_THEMES[DEMO_THEMES.length - 1];

// the colour tokens the diff lists, after --radius and --font-sans
const SHOWN: readonly DemoTokenName[] = [
  'background',
  'foreground',
  'primary',
  'primary-foreground',
  'accent',
  'border',
];

// where the blocks sit in a stock shadcn/ui globals.css
const ROOT_LINE = 50;
const DARK_LINE = 85;

// one changed pair every STEP_MS; its + line lands ADD_MS after its - line
const STEP_MS = 90;
const ADD_MS = 140;

type Row =
  | { kind: 'hunk'; text: string }
  | {
      kind: 'ctx' | 'del' | 'add';
      line: number;
      /** A declaration, or a selector or brace line when prop is absent. */
      prop?: string;
      value: string;
      swatch?: string;
      step: number;
    };

interface Diff {
  rows: Row[];
  changed: number;
}

interface Decl {
  prop: string;
  from: string;
  to: string;
  swatch?: boolean;
}

const fontValue = (t: DemoTheme) =>
  `"${t.fontLabel}", ${t.font.split(',').at(-1)?.trim()}`;

/** The globals.css hunks from one theme to the next: radius, font and the
 * light colours in :root; in dark mode the colours move to .dark, as in a
 * shadcn/ui app. */
function diffCss(from: DemoTheme, to: DemoTheme, mode: Mode): Diff {
  const shared: Decl[] = [
    { prop: 'radius', from: from.radius, to: to.radius },
    { prop: 'font-sans', from: fontValue(from), to: fontValue(to) },
  ];
  const colors: Decl[] = SHOWN.map((name) => ({
    prop: name,
    from: from[mode][name],
    to: to[mode][name],
    swatch: true,
  }));
  const blocks =
    mode === 'light'
      ? [{ start: ROOT_LINE, selector: ':root', decls: [...shared, ...colors] }]
      : [
          { start: ROOT_LINE, selector: ':root', decls: shared },
          { start: DARK_LINE, selector: '.dark', decls: colors },
        ];

  const rows: Row[] = [];
  let step = 0;
  for (const { start, selector, decls } of blocks) {
    const size = decls.length + 2;
    rows.push({
      kind: 'hunk',
      text: `@@ -${start},${size} +${start},${size} @@`,
    });
    let line = start;
    rows.push({ kind: 'ctx', line: line++, value: `${selector} {`, step });
    for (const d of decls) {
      if (d.from === d.to) {
        rows.push({
          kind: 'ctx',
          line: line++,
          prop: d.prop,
          value: d.to,
          swatch: d.swatch ? d.to : undefined,
          step,
        });
        continue;
      }
      rows.push({
        kind: 'del',
        line,
        prop: d.prop,
        value: d.from,
        swatch: d.swatch ? d.from : undefined,
        step,
      });
      rows.push({
        kind: 'add',
        line: line++,
        prop: d.prop,
        value: d.to,
        swatch: d.swatch ? d.to : undefined,
        step: step++,
      });
    }
    rows.push({ kind: 'ctx', line: line++, value: '}', step });
  }
  return { rows, changed: step };
}

const DATA_TABLE_TSX = `'use client';

import {
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { columns, type Member } from './columns';

type Props = { data: Member[] };

export function DataTable({ data }: Props) {
  const table = useShadcnTable({ columns, data });

  return <ShadcnTable table={table} />;
}`;

// keywords, strings and JSX tags; the rest stays plain
const TOKEN =
  /('[^']*'|\b(?:import|from|export|function|const|return|type)\b|<\/?[A-Z]\w*|\/>)/g;

/* del: fades in from the left; add: sweeps in after it; ping: the
 * "unchanged" ring, at rest invisible; fade: the URL and the counts. Under
 * reduced motion everything sits at its final state. */
const CSS = `
@keyframes ed-del{from{opacity:0;transform:translateX(-6px)}}
@keyframes ed-add{from{clip-path:inset(0 100% 0 0)}}
@keyframes ed-ping{from{opacity:.7;transform:scale(1)}to{opacity:0;transform:scale(1.35)}}
@keyframes ed-fade{from{opacity:0;transform:translateY(2px)}}
.ed-del{animation:ed-del 240ms cubic-bezier(.2,.8,.2,1) var(--ed-d) both}
.ed-add{animation:ed-add 380ms cubic-bezier(.2,.8,.2,1) calc(var(--ed-d) + ${ADD_MS}ms) both}
.ed-ping{opacity:0;animation:ed-ping 900ms ease-out 1}
.ed-fade{animation:ed-fade 320ms cubic-bezier(.2,.8,.2,1) both}
@media (prefers-reduced-motion:reduce){.ed-del,.ed-add,.ed-ping,.ed-fade{animation:none}}
`;

/** Light and dark versions of an inline value, switched by the site mode
 * in CSS, so the server render needs no mode. */
function PerMode({ light, dark }: { light: ReactNode; dark: ReactNode }) {
  return (
    <>
      <span className="dark:hidden">{light}</span>
      <span className="hidden dark:inline">{dark}</span>
    </>
  );
}

function DiffRow({ row }: { row: Row }) {
  if (row.kind === 'hunk')
    return (
      <div className="w-max min-w-full bg-sky-500/5 py-0.5 pr-4 pl-13 text-sky-300/70 sm:pl-18">
        {row.text}
      </div>
    );
  const sign = { ctx: ' ', del: '-', add: '+' }[row.kind];
  return (
    <div
      className={cn(
        'flex w-max min-w-full items-center pr-4',
        row.kind === 'del' && 'ed-del bg-red-500/15 text-red-200',
        row.kind === 'add' && 'ed-add bg-emerald-500/15 text-emerald-100',
      )}
      style={{ '--ed-d': `${row.step * STEP_MS}ms` } as CSSProperties}
    >
      <span
        aria-hidden="true"
        className="w-9 shrink-0 pr-2 text-right sm:w-12 sm:pr-3 text-zinc-600 select-none"
      >
        {row.line}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'w-4 shrink-0 text-center select-none sm:w-6',
          row.kind === 'del' && 'text-red-400',
          row.kind === 'add' && 'text-emerald-400',
        )}
      >
        {sign}
      </span>
      {row.prop ? (
        <span className="whitespace-pre">
          {'  '}
          <span className={row.kind === 'ctx' ? 'text-sky-300' : undefined}>
            --{row.prop}
          </span>
          : {row.value}
          <span className="text-zinc-500">;</span>
        </span>
      ) : (
        <span className="whitespace-pre text-fuchsia-300">{row.value}</span>
      )}
      {row.swatch ? (
        <span
          aria-hidden="true"
          className="ml-2 size-2.5 shrink-0 rounded-[3px] ring-1 ring-white/20"
          style={{ backgroundColor: row.swatch }}
        />
      ) : null}
    </div>
  );
}

function DiffBody({ diff }: { diff: Diff }) {
  return diff.rows.map((row, i) => <DiffRow key={i} row={row} />);
}

function Code({ code }: { code: string }) {
  return code.split('\n').map((text, i) => (
    <div key={i} className="flex w-max min-w-full pr-4">
      <span
        aria-hidden="true"
        className="w-9 shrink-0 pr-2 text-right sm:w-12 sm:pr-3 text-zinc-600 select-none"
      >
        {i + 1}
      </span>
      <span className="w-4 shrink-0 sm:w-6" />
      <span className="whitespace-pre">
        {text.split(TOKEN).map((part, j) =>
          j % 2 === 0 ? (
            part
          ) : (
            <span
              key={j}
              className={
                part.startsWith("'")
                  ? 'text-amber-200'
                  : /^<|\/>/.test(part)
                    ? 'text-sky-300'
                    : 'text-fuchsia-300'
              }
            >
              {part}
            </span>
          ),
        )}
      </span>
    </div>
  ));
}

/** git's stat bar: one + per insertion, one - per deletion. */
function StatBar({ n }: { n: number }) {
  return (
    <span aria-hidden="true">
      <span className="text-emerald-400">{'+'.repeat(n)}</span>
      <span className="text-red-400">{'-'.repeat(n)}</span>
    </span>
  );
}

type Tab = 'css' | 'tsx';

/** The editor pane: globals.css as a diff from the last site's theme,
 * data-table.tsx locked, and the stat that sums them up. */
function Editor({
  light,
  dark,
  run,
}: {
  light: Diff;
  dark: Diff;
  run: number;
}) {
  const [tab, setTab] = useState<Tab>('css');
  const id = useId();
  const tabId = (t: Tab) => `${id}-tab-${t}`;
  const panelId = (t: Tab) => `${id}-panel-${t}`;

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const next = tab === 'css' ? 'tsx' : 'css';
    setTab(next);
    document.getElementById(tabId(next))?.focus();
  };

  const tabClass =
    'relative flex h-10 shrink-0 items-center gap-2 border-r whitespace-nowrap border-zinc-800 px-4 text-zinc-500 transition-colors hover:text-zinc-200 aria-selected:bg-zinc-950 aria-selected:text-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-400';

  return (
    <figure
      aria-label="Editor: the globals.css diff between two sites, and data-table.tsx, unchanged"
      className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-[0.75rem] leading-5 text-zinc-300 shadow-lg shadow-black/10"
    >
      <div
        role="tablist"
        aria-label="Files"
        onKeyDown={onKeyDown}
        className="flex overflow-x-auto border-b border-zinc-800 bg-zinc-900/60"
      >
        <button
          type="button"
          role="tab"
          id={tabId('css')}
          aria-selected={tab === 'css'}
          aria-controls={panelId('css')}
          tabIndex={tab === 'css' ? 0 : -1}
          onClick={() => setTab('css')}
          className={tabClass}
        >
          globals.css
          <span key={run} className="ed-fade flex gap-1 text-[0.6875rem]">
            <span className="text-emerald-400">
              +<PerMode light={light.changed} dark={dark.changed} />
            </span>
            <span className="text-red-400">
              -<PerMode light={light.changed} dark={dark.changed} />
            </span>
          </span>
        </button>
        <button
          type="button"
          role="tab"
          id={tabId('tsx')}
          aria-selected={tab === 'tsx'}
          aria-controls={panelId('tsx')}
          tabIndex={tab === 'tsx' ? 0 : -1}
          onClick={() => setTab('tsx')}
          className={tabClass}
        >
          data-table.tsx
          <span className="relative flex items-center gap-1 rounded-full border border-emerald-500/30 px-1.5 text-[0.6875rem] text-emerald-300">
            <span
              key={run}
              aria-hidden="true"
              className="ed-ping absolute inset-0 rounded-full border border-emerald-400"
            />
            <LockIcon aria-hidden="true" className="size-3" />
            <span className="hidden sm:inline">unchanged</span>
          </span>
        </button>
      </div>

      {/* both panels share one cell, so a tab switch never changes the
       * pane's height */}
      <div className="grid flex-1">
        <div
          role="tabpanel"
          id={panelId('css')}
          aria-labelledby={tabId('css')}
          className={cn(
            'overflow-x-auto py-3 [grid-area:1/1]',
            tab !== 'css' && 'invisible',
          )}
        >
          <div key={run}>
            <div className="dark:hidden">
              <DiffBody diff={light} />
            </div>
            <div className="hidden dark:block">
              <DiffBody diff={dark} />
            </div>
          </div>
        </div>
        <div
          role="tabpanel"
          id={panelId('tsx')}
          aria-labelledby={tabId('tsx')}
          className={cn(
            'flex flex-col overflow-x-auto py-3 [grid-area:1/1]',
            tab !== 'tsx' && 'invisible',
          )}
        >
          <p className="mx-4 mb-3 flex items-center gap-2 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-emerald-200">
            <LockIcon aria-hidden="true" className="size-3.5 shrink-0" />
            No changes. The same file on every site.
          </p>
          <Code code={DATA_TABLE_TSX} />
        </div>
      </div>

      <div className="border-t border-zinc-800 bg-zinc-900/40 px-4 py-3">
        <p className="text-zinc-500">
          <span aria-hidden="true" className="text-emerald-400">
            ${' '}
          </span>
          git diff --stat
        </p>
        <dl
          key={run}
          className="ed-fade mt-1.5 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5"
        >
          <dt className="truncate text-zinc-200">app/globals.css</dt>
          <dd className="flex items-center gap-2 tabular-nums">
            <span className="text-emerald-400">
              +<PerMode light={light.changed} dark={dark.changed} />
            </span>
            <span className="text-red-400">
              -<PerMode light={light.changed} dark={dark.changed} />
            </span>
            <span className="hidden sm:inline">
              <PerMode
                light={<StatBar n={light.changed} />}
                dark={<StatBar n={dark.changed} />}
              />
            </span>
          </dd>
          <dt className="truncate text-zinc-200">components/data-table.tsx</dt>
          <dd className="flex items-center gap-2 text-emerald-300 tabular-nums">
            0
            <LockIcon aria-hidden="true" className="size-3" />
            <span className="hidden sm:inline">unchanged</span>
          </dd>
        </dl>
      </div>
    </figure>
  );
}

/** Inside the frame: a small members page in the site's theme, stock
 * shadcn/ui parts around the table. */
function SiteApp({ site }: { site: (typeof SITES)[DemoThemeId] }) {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
        >
          {site.name[0]}
        </span>
        <span className="font-semibold">{site.name}</span>
        <Badge variant="outline">Team</Badge>
        <div className="ml-auto flex items-center gap-2">
          <Input
            type="search"
            aria-label="Search"
            placeholder="Search"
            className="hidden h-8 w-40 sm:block"
          />
          <Button size="sm" variant="secondary">
            Feedback
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Members</h3>
        <p className="text-sm text-muted-foreground">
          Everyone with access to {site.domain}.
        </p>
      </div>
      <ThemeTable />
    </>
  );
}

const CHIP =
  'inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground aria-pressed:border-foreground aria-pressed:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

/**
 * Theme demo variant 6 (empty diff): an editor diffs globals.css from one
 * site's theme to the next while data-table.tsx stays at 0 changes, beside
 * a browser frame showing that site with the table in it. Autoplay via
 * useThemeCycle; a site pick or any interaction with the frame pauses it.
 * Under reduced motion it starts paused and the diff shows without motion.
 */
export function EmptyDiff() {
  const { theme, paused, select, resume, ref } = useThemeCycle();
  // the theme the diff starts from, and a counter that restarts its motion
  const [shown, setShown] = useState({
    id: theme.id,
    prev: LAST.id,
    run: 0,
  });

  if (shown.id !== theme.id)
    setShown({ id: theme.id, prev: shown.id, run: shown.run + 1 });

  const prev = DEMO_THEMES.find((t) => t.id === shown.prev) ?? LAST;
  const light = diffCss(prev, theme, 'light');
  const dark = diffCss(prev, theme, 'dark');
  const site = SITES[theme.id];

  const replay = () => {
    setShown({ id: FIRST.id, prev: LAST.id, run: shown.run + 1 });
    select(FIRST.id);
    resume();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid items-stretch gap-4 min-[90rem]:grid-cols-[minmax(0,1fr)_minmax(0,54.5rem)]">
        <Editor light={light} dark={dark} run={shown.run} />

        <div className="flex min-w-0 flex-col gap-3">
          <div
            ref={ref}
            className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-(--dh-paper-2) shadow-lg shadow-black/5"
          >
            <div className="flex items-center gap-3 border-b px-3 py-2">
              <span aria-hidden="true" className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-(--dh-rule-strong)" />
                <span className="size-2.5 rounded-full bg-(--dh-rule-strong)" />
                <span className="size-2.5 rounded-full bg-(--dh-rule-strong)" />
              </span>
              <p
                aria-label="Address"
                className="flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-md border bg-(--dh-paper) px-2.5 font-mono text-xs"
              >
                <LockIcon
                  aria-hidden="true"
                  className="size-3 shrink-0 text-(--dh-ink-muted)"
                />
                <span key={site.domain} className="ed-fade truncate">
                  <span className="text-(--dh-ink-muted)">https://</span>
                  <span className="text-(--dh-ink)">{site.domain}</span>
                  <span className="text-(--dh-ink-muted)">
                    /settings/members
                  </span>
                </span>
              </p>
            </div>
            <ThemeScope
              theme={theme.id}
              className="flex flex-1 flex-col gap-4 p-3 sm:p-4"
            >
              <SiteApp site={site} />
            </ThemeScope>
          </div>

          <div
            role="group"
            aria-label="Site"
            className="flex flex-wrap gap-1.5"
          >
            {DEMO_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={t.id === theme.id}
                onClick={() => select(t.id)}
                className={CHIP}
              >
                <span
                  aria-hidden="true"
                  className="size-3 border border-foreground/15 bg-(--swatch-light) dark:bg-(--swatch-dark)"
                  style={
                    {
                      '--swatch-light': t.light.primary,
                      '--swatch-dark': t.dark.primary,
                      borderRadius: `min(${t.radius}, 6px)`,
                    } as CSSProperties
                  }
                />
                {SITES[t.id].domain}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border border-dashed border-(--v12-dash) px-3 py-2 text-sm text-(--dh-ink-muted)">
        <p className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              'size-1.5 shrink-0 rounded-full',
              paused ? 'bg-(--dh-rule-strong)' : 'bg-emerald-500',
            )}
          />
          <span>
            <span className="text-(--dh-ink)">{site.domain}</span>: globals.css
            changed <PerMode light={light.changed} dark={dark.changed} />{' '}
            tokens, data-table.tsx changed none.
          </span>
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={paused ? resume : () => select(theme.id)}
            className={cn(CHIP, 'font-sans')}
          >
            {paused ? (
              <PlayIcon aria-hidden="true" className="size-3" />
            ) : (
              <PauseIcon aria-hidden="true" className="size-3" />
            )}
            {paused ? 'Play' : 'Pause'}
          </button>
          <button
            type="button"
            onClick={replay}
            className={cn(CHIP, 'font-sans')}
          >
            <RotateCcwIcon aria-hidden="true" className="size-3" />
            Replay
          </button>
        </div>
      </div>

      <style href="theme-demo-empty-diff" precedence="default">
        {CSS}
      </style>
    </div>
  );
}
