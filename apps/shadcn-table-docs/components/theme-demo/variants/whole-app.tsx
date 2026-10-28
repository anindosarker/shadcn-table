'use client';

import {
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  LockIcon,
  MessageSquareIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  SparklesIcon,
} from 'lucide-react';
import {
  DEMO_THEMES,
  type DemoTheme,
  type DemoThemeId,
  type DemoTokenName,
} from '@/components/theme-demo/demo-themes';
import { ThemeScope } from '@/components/theme-demo/theme-scope';
import { useThemeCycle } from '@/components/theme-demo/use-theme-cycle';
import { cn } from '@/lib/cn';
import { WholeAppSite } from './whole-app-site';

type Mode = 'light' | 'dark';

// each demo theme, presented as somebody else's site
const SITES: Readonly<Record<DemoThemeId, { domain: string; name: string }>> = {
  neutral: { domain: 'acme.dev', name: 'Acme' },
  paper: { domain: 'paper.blog', name: 'Paper' },
  brutal: { domain: 'kernel.sh', name: 'Kernel' },
  ocean: { domain: 'tide.app', name: 'Tide' },
  candy: { domain: 'sprinkle.shop', name: 'Sprinkle' },
};

// what somebody would type to get each theme; always the whole app, never
// the table
const PROMPTS: Readonly<Record<DemoThemeId, string>> = {
  neutral: 'Back to a clean, neutral look.',
  paper: 'Restyle my whole app like a calm blog: serif type, warm paper tones.',
  brutal: 'Give my app a bold brutalist look: square corners, mono font.',
  ocean: 'Cool, techy look for the app: blue accents, crisp sans.',
  candy: 'Make the app feel playful: pink accents, rounder corners.',
};

const FIRST = DEMO_THEMES[0];
const LAST = DEMO_THEMES[DEMO_THEMES.length - 1];
const BEFORE_LAST = DEMO_THEMES[DEMO_THEMES.length - 2];
const byId = (id: DemoThemeId) => DEMO_THEMES.find((t) => t.id === id) ?? FIRST;

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

// the prompt types one character every CHAR_MS, sits SEND_MS before it is
// sent, and the reply lands THINK_MS later, with the repaint
const CHAR_MS = 22;
const SEND_MS = 300;
const THINK_MS = 700;

// long enough to read the reply after the repaint
const CYCLE_MS = 6000;

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

/** --radius in words, for people who do not read rem. */
function corners(radius: string) {
  const r = parseFloat(radius);
  if (r === 0) return 'square';
  if (r <= 0.5) return 'soft';
  if (r <= 0.75) return 'rounded';
  return 'extra round';
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
 * "unchanged" ring, at rest invisible; fade: the URL, the counts and the
 * plain rows; pop: a chat message; caret: the composer's block cursor,
 * hard on and off; dots: thinking.
 * Under reduced motion everything sits at its final state. */
const CSS = `
@keyframes wa-del{from{opacity:0;transform:translateX(-6px)}}
@keyframes wa-add{from{clip-path:inset(0 100% 0 0)}}
@keyframes wa-ping{from{opacity:.7;transform:scale(1)}to{opacity:0;transform:scale(1.35)}}
@keyframes wa-fade{from{opacity:0;transform:translateY(2px)}}
@keyframes wa-pop{from{opacity:0;transform:translateY(6px) scale(.98)}}
@keyframes wa-caret{50%{opacity:0}}
@keyframes wa-dot{0%,80%,100%{opacity:.25}40%{opacity:1}}
.wa-del{animation:wa-del 240ms cubic-bezier(.2,.8,.2,1) var(--wa-d) both}
.wa-add{animation:wa-add 380ms cubic-bezier(.2,.8,.2,1) calc(var(--wa-d) + ${ADD_MS}ms) both}
.wa-ping{opacity:0;animation:wa-ping 900ms ease-out 1}
.wa-fade{animation:wa-fade 320ms cubic-bezier(.2,.8,.2,1) var(--wa-d,0ms) both}
.wa-pop{animation:wa-pop 280ms cubic-bezier(.2,.8,.2,1) both}
.wa-caret{animation:wa-caret 1s steps(1) infinite}
.wa-dot{animation:wa-dot 1.2s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.wa-del,.wa-add,.wa-ping,.wa-fade,.wa-pop,.wa-caret,.wa-dot{animation:none}}
`;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

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
      <div className="w-max min-w-full bg-sky-500/5 py-0.5 pr-4 pl-13 text-sky-700/80 sm:pl-18 dark:text-sky-300/70">
        {row.text}
      </div>
    );
  const sign = { ctx: ' ', del: '-', add: '+' }[row.kind];
  return (
    <div
      className={cn(
        'flex w-max min-w-full items-center pr-4',
        row.kind === 'del' &&
          'wa-del bg-red-500/10 text-red-800 dark:bg-red-500/15 dark:text-red-200',
        row.kind === 'add' &&
          'wa-add bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-100',
      )}
      style={{ '--wa-d': `${row.step * STEP_MS}ms` } as CSSProperties}
    >
      <span
        aria-hidden="true"
        className="w-9 shrink-0 pr-2 text-right text-(--dh-ink-muted) opacity-60 select-none sm:w-12 sm:pr-3"
      >
        {row.line}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'w-4 shrink-0 text-center select-none sm:w-6',
          row.kind === 'del' && 'text-red-600 dark:text-red-400',
          row.kind === 'add' && 'text-emerald-600 dark:text-emerald-400',
        )}
      >
        {sign}
      </span>
      {row.prop ? (
        <span className="whitespace-pre">
          {'  '}
          <span
            className={
              row.kind === 'ctx' ? 'text-sky-700 dark:text-sky-300' : undefined
            }
          >
            --{row.prop}
          </span>
          : {row.value}
          <span className="text-(--dh-ink-muted)">;</span>
        </span>
      ) : (
        <span className="whitespace-pre text-fuchsia-700 dark:text-fuchsia-300">
          {row.value}
        </span>
      )}
      {row.swatch ? (
        <span
          aria-hidden="true"
          className="ml-2 size-2.5 shrink-0 rounded-[2px] ring-1 ring-(--dh-rule-strong)"
          style={{ backgroundColor: row.swatch }}
        />
      ) : null}
    </div>
  );
}

function DiffBody({ diff }: { diff: Diff }) {
  return diff.rows.map((row, i) => <DiffRow key={i} row={row} />);
}

/** A colour token as a chip, its light or dark value by the site mode. */
function Swatch({ theme, name }: { theme: DemoTheme; name: DemoTokenName }) {
  return (
    <span
      aria-hidden="true"
      className="size-4 shrink-0 rounded-[2px] bg-(--sw-l) ring-1 ring-(--dh-rule-strong) dark:bg-(--sw-d)"
      style={
        {
          '--sw-l': theme.light[name],
          '--sw-d': theme.dark[name],
        } as CSSProperties
      }
    />
  );
}

/** A top-left corner drawn with the theme's radius, scaled to fit. */
function Corner({ radius }: { radius: string }) {
  return (
    <span
      aria-hidden="true"
      className="size-3.5 shrink-0 border-t-2 border-l-2 border-current"
      style={{
        borderTopLeftRadius: `${Math.min(parseFloat(radius) * 8, 10)}px`,
      }}
    />
  );
}

function FontSample({ theme }: { theme: DemoTheme }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="text-[0.9375rem] leading-none"
        style={{ fontFamily: theme.font }}
      >
        Aa
      </span>
      {theme.fontLabel}
    </>
  );
}

const sameColor = (a: DemoTheme, b: DemoTheme, name: DemoTokenName) =>
  a.light[name] === b.light[name] && a.dark[name] === b.dark[name];

/** globals.css in plain words: the same token data as the diff, as the
 * four things a person would notice. */
function PlainDiff({ from, to }: { from: DemoTheme; to: DemoTheme }) {
  const color = (name: DemoTokenName, label: string) => ({
    label,
    same: sameColor(from, to, name),
    old: <Swatch theme={from} name={name} />,
    now: <Swatch theme={to} name={name} />,
    words: `${label} colour`,
  });
  const rows = [
    color('primary', 'Primary'),
    {
      label: 'Corners',
      same: corners(from.radius) === corners(to.radius),
      old: (
        <>
          <Corner radius={from.radius} />
          {corners(from.radius)}
        </>
      ),
      now: (
        <>
          <Corner radius={to.radius} />
          {corners(to.radius)}
        </>
      ),
      words: `Corners ${corners(from.radius)} to ${corners(to.radius)}`,
    },
    {
      label: 'Font',
      same: from.fontLabel === to.fontLabel,
      old: <FontSample theme={from} />,
      now: <FontSample theme={to} />,
      words: `Font ${from.fontLabel} to ${to.fontLabel}`,
    },
    color('background', 'Background'),
  ];

  return (
    <section
      aria-label="What changed, in plain words"
      className="mx-4 mb-3 rounded-[2px] border border-dashed border-(--v12-dash) bg-(--dh-paper-2) px-3 py-2.5 font-sans text-[0.8125rem]"
    >
      <h3 className="mb-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-(--dh-ink-muted) uppercase">
        In plain words
      </h3>
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-1.5">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className="wa-fade col-span-2 grid grid-cols-subgrid items-center"
            style={{ '--wa-d': `${i * 80}ms` } as CSSProperties}
          >
            <dt className="text-(--dh-ink-muted)">{r.label}</dt>
            <dd
              aria-label={r.same ? `${r.label} unchanged` : r.words}
              className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1"
            >
              {r.same ? (
                <span className="flex items-center gap-1.5 text-(--dh-ink-muted)">
                  {r.now}
                  <span>no change</span>
                </span>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 text-(--dh-ink-muted)">
                    {r.old}
                  </span>
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-(--dh-ink-muted)"
                  />
                  <span className="flex items-center gap-1.5 text-(--dh-ink)">
                    {r.now}
                  </span>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Code({ code }: { code: string }) {
  return code.split('\n').map((text, i) => (
    <div key={i} className="flex w-max min-w-full pr-4">
      <span
        aria-hidden="true"
        className="w-9 shrink-0 pr-2 text-right text-(--dh-ink-muted) opacity-60 select-none sm:w-12 sm:pr-3"
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
                  ? 'text-amber-700 dark:text-amber-200'
                  : /^<|\/>/.test(part)
                    ? 'text-sky-700 dark:text-sky-300'
                    : 'text-fuchsia-700 dark:text-fuchsia-300'
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
      <span className="text-emerald-600 dark:text-emerald-400">
        {'+'.repeat(n)}
      </span>
      <span className="text-red-600 dark:text-red-400">{'-'.repeat(n)}</span>
    </span>
  );
}

/** The prompt so far, one character every CHAR_MS; remount to restart. */
function Typing({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((i) => i + 1), CHAR_MS);
    return () => clearInterval(t);
  }, []);
  return text.slice(0, n);
}

/* typing: the next prompt fills the composer; thinking: it is sent and the
 * assistant works; done: the reply is in and the frame shows the result */
type Phase = 'typing' | 'thinking' | 'done';

/** One request and the theme it led to. */
interface Exchange {
  from: DemoThemeId;
  to: DemoThemeId;
  key: string;
}

// exchanges kept in the chat, the newest last
const LOG_SIZE = 3;

interface Chat {
  /** The theme before the applied one, which the diff starts from. */
  prev: DemoThemeId;
  /** The theme the frame shows. */
  id: DemoThemeId;
  /** The theme being asked for; equals id once done. */
  target: DemoThemeId;
  phase: Phase;
  /** Bumped per request; keys the typing and the exchange it becomes. */
  run: number;
  /** Bumped per repaint, to restart the diff's motion. */
  paint: number;
  log: readonly Exchange[];
}

/** The chat once `chat.target` is applied. */
function apply(chat: Chat): Chat {
  return {
    ...chat,
    prev: chat.id,
    id: chat.target,
    phase: 'done',
    paint: chat.paint + 1,
    log: [
      ...chat.log,
      { from: chat.id, to: chat.target, key: `x${chat.run}` },
    ].slice(-LOG_SIZE),
  };
}

/** A new request: typed out, or applied at once under reduced motion. */
function ask(sent: Chat, to: DemoThemeId, instant: boolean): Chat {
  // a request already sent still lands; one being typed is dropped
  const chat = sent.phase === 'thinking' ? apply(sent) : sent;
  if (to === chat.id) return { ...chat, target: to, phase: 'done' };
  const asked = { ...chat, target: to, run: chat.run + 1 };
  return instant ? apply(asked) : { ...asked, phase: 'typing' };
}

function advance(chat: Chat): Chat {
  if (chat.phase === 'typing') return { ...chat, phase: 'thinking' };
  if (chat.phase === 'thinking') return apply(chat);
  return chat;
}

const tokens = (n: number) => `${n} ${n === 1 ? 'token' : 'tokens'}`;

/** The assistant's answer to an applied exchange. */
function Reply({ exchange }: { exchange: Exchange }) {
  const from = byId(exchange.from);
  const to = byId(exchange.to);
  return (
    <div className="wa-pop flex min-w-0 flex-col gap-1.5 pt-0.5">
      <span className="sr-only">Assistant: </span>
      <p className="flex items-start gap-2">
        <CheckIcon
          aria-hidden="true"
          className="mt-0.5 size-3.5 shrink-0 text-(--dh-accent)"
        />
        <span>
          Updated{' '}
          <span className="font-mono text-(--dh-ink)">app/globals.css</span> (
          <PerMode
            light={tokens(diffCss(from, to, 'light').changed)}
            dark={tokens(diffCss(from, to, 'dark').changed)}
          />
          ). Your buttons, cards, inputs and badges now use the new theme.
        </span>
      </p>
      <p className="flex items-start gap-2">
        <LockIcon
          aria-hidden="true"
          className="mt-0.5 size-3.5 shrink-0 text-(--dh-accent)"
        />
        <span>
          <span className="font-mono text-(--dh-ink)">
            components/data-table.tsx
          </span>
          : no changes needed. It already reads the same tokens.
        </span>
      </p>
    </div>
  );
}

function Thinking() {
  return (
    <p className="wa-pop flex items-center gap-1 pt-0.5 text-(--dh-ink-muted)">
      <span className="sr-only">Assistant: </span>
      Editing <span className="font-mono text-(--dh-ink)">app/globals.css</span>
      <span aria-hidden="true" className="flex gap-0.5 pl-0.5">
        {[0, 150, 300].map((ms) => (
          <span
            key={ms}
            className="wa-dot size-1 rounded-full bg-current"
            style={{ animationDelay: `${ms}ms` }}
          />
        ))}
      </span>
    </p>
  );
}

/** A request bubble and the assistant's line under it. */
function Turn({
  to,
  faded,
  children,
}: {
  to: DemoThemeId;
  faded: boolean;
  children: ReactNode;
}) {
  return (
    <li
      className={cn(
        'flex flex-col gap-3 text-(--dh-ink-muted) transition-opacity duration-300',
        faded && 'opacity-40',
      )}
    >
      <p className="wa-pop ml-auto max-w-[85%] rounded-[2px] border border-dashed border-(--v12-dash) bg-(--dh-paper-2) px-3.5 py-2 text-(--dh-ink)">
        <span className="sr-only">You: </span>
        {PROMPTS[to]}
      </p>
      <div className="flex gap-2.5">
        <span
          aria-hidden="true"
          className="grid size-6 shrink-0 place-items-center rounded-full border border-dashed border-(--v12-dash) bg-(--dh-paper-2) text-(--dh-accent)"
        >
          <SparklesIcon className="size-3.5" />
        </span>
        {children}
      </div>
    </li>
  );
}

/** The composer's cursor: a terminal block in the editor ink, one line
 * tall. */
const CARET = (
  <span className="wa-caret ml-px inline-block h-[1lh] w-[0.6em] bg-(--dh-ink) align-top" />
);

/** The prompt pane: a short chat with a generic coding assistant, newest at
 * the bottom, and the composer the next request types into. */
function PromptPane({ chat }: { chat: Chat }) {
  const thinking = chat.phase === 'thinking';
  const last = chat.log.length - 1;

  return (
    <div className="absolute inset-0 flex flex-col gap-4 p-4 font-sans text-[0.8125rem] leading-5">
      <ol
        aria-label="Chat"
        // older turns fade out under the top edge instead of cutting a line
        className="flex min-h-0 flex-1 flex-col justify-end gap-5 overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_4rem)]"
      >
        {chat.log.map((e, i) => (
          <Turn key={e.key} to={e.to} faded={thinking || i < last}>
            <Reply exchange={e} />
          </Turn>
        ))}
        {thinking ? (
          <Turn key={`x${chat.run}`} to={chat.target} faded={false}>
            <Thinking />
          </Turn>
        ) : null}
      </ol>

      <div
        aria-hidden="true"
        className="flex items-end gap-2 rounded-[2px] border border-dashed border-(--v12-dash) bg-(--dh-paper-2) py-2 pr-2 pl-3.5"
      >
        <p className="flex min-h-5 min-w-0 flex-1 gap-2 py-1">
          <span className="shrink-0 text-(--dh-ink-muted) select-none">›</span>
          {chat.phase === 'typing' ? (
            <span className="text-(--dh-ink)">
              <Typing key={chat.run} text={PROMPTS[chat.target]} />
              {CARET}
            </span>
          ) : (
            // idle: the caret waits where the next prompt starts
            <span>
              {CARET}
              <span className="ml-1 text-(--dh-ink-muted)">
                Describe a new look for your app
              </span>
            </span>
          )}
        </p>
        <span
          className={cn(
            'grid size-7 shrink-0 place-items-center rounded-[2px] transition-colors',
            chat.phase === 'typing'
              ? 'bg-(--dh-ink) text-(--dh-paper)'
              : 'bg-(--dh-paper-3) text-(--dh-ink-muted)',
          )}
        >
          <ArrowUpIcon className="size-3.5" />
        </span>
      </div>
    </div>
  );
}

const TABS = ['prompt', 'css', 'tsx'] as const;
type Tab = (typeof TABS)[number];

/** The editor pane: the prompt that asks for the theme, globals.css as a
 * diff from the last site's theme in plain words and in code, data-table.tsx
 * locked, and the stat that sums them up. `home`: as tall as the frame
 * beside it, or a short strip under it, without the stat on phones. */
function Editor({
  chat,
  light,
  dark,
  home,
}: {
  chat: Chat;
  light: Diff;
  dark: Diff;
  home: boolean;
}) {
  const [tab, setTab] = useState<Tab>('prompt');
  const id = useId();
  const tabId = (t: Tab) => `${id}-tab-${t}`;
  const panelId = (t: Tab) => `${id}-panel-${t}`;
  const paint = chat.paint;

  const onKeyDown = (event: KeyboardEvent) => {
    const at = TABS.indexOf(tab);
    const next: Tab | undefined = (
      {
        ArrowLeft: TABS[(at + TABS.length - 1) % TABS.length],
        ArrowRight: TABS[(at + 1) % TABS.length],
        Home: TABS[0],
        End: TABS[TABS.length - 1],
      } as Record<string, Tab>
    )[event.key];
    if (!next) return;
    event.preventDefault();
    setTab(next);
    document.getElementById(tabId(next))?.focus();
  };

  const tabClass =
    'relative flex h-10 shrink-0 items-center gap-2 border-r border-dashed border-(--v12-dash) px-3 whitespace-nowrap text-(--dh-ink-muted) transition-colors hover:text-(--dh-ink) aria-selected:bg-(--dh-paper) aria-selected:text-(--dh-ink) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--dh-focus)';
  const tabProps = (t: Tab) => ({
    type: 'button' as const,
    role: 'tab',
    id: tabId(t),
    'aria-selected': tab === t,
    'aria-controls': panelId(t),
    tabIndex: tab === t ? 0 : -1,
    onClick: () => setTab(t),
    className: tabClass,
  });
  const panelProps = (t: Tab) => ({
    role: 'tabpanel',
    id: panelId(t),
    'aria-labelledby': tabId(t),
    // the next stop after the tabs, as in the ARIA tabs pattern
    tabIndex: 0,
  });

  return (
    <figure
      aria-label="Editor: a prompt asks for a new look for the app, the globals.css diff it makes, and data-table.tsx, unchanged"
      className={cn(
        'flex min-w-0 flex-col overflow-hidden bg-(--dh-paper) font-mono text-[0.75rem] leading-5 text-(--dh-ink)',
        // h-0 plus min-h-full: the frame alone sets the row's height
        home &&
          'order-last border-dashed border-(--v12-dash) max-xl:border-t xl:order-none xl:h-0 xl:min-h-full',
      )}
    >
      <div
        role="tablist"
        aria-label="Files"
        onKeyDown={onKeyDown}
        className={cn(
          'flex overflow-x-auto border-b border-dashed border-(--v12-dash) bg-(--dh-paper-2)',
          home && '[scrollbar-width:none]',
        )}
      >
        <button {...tabProps('prompt')}>
          <MessageSquareIcon aria-hidden="true" className="size-3.5" />
          Prompt
        </button>
        <button {...tabProps('css')}>
          globals.css
          <span key={paint} className="wa-fade flex gap-1 text-[0.6875rem]">
            <span className="text-emerald-600 dark:text-emerald-400">
              +<PerMode light={light.changed} dark={dark.changed} />
            </span>
            <span className="text-red-600 dark:text-red-400">
              -<PerMode light={light.changed} dark={dark.changed} />
            </span>
          </span>
        </button>
        <button {...tabProps('tsx')}>
          data-table.tsx
          <span className="relative flex items-center gap-1 rounded-full border border-dashed border-(--dh-accent) px-1.5 text-[0.6875rem] text-(--dh-accent)">
            <span
              key={paint}
              aria-hidden="true"
              className="wa-ping absolute inset-0 rounded-full border border-(--dh-accent)"
            />
            <LockIcon aria-hidden="true" className="size-3" />
            {/* beside the frame, the lock alone keeps the tabs in one row */}
            <span
              className={cn(
                'hidden sm:inline',
                home ? 'xl:hidden' : 'min-[90rem]:hidden',
              )}
            >
              unchanged
            </span>
          </span>
        </button>
      </div>

      {/* the panels share one cell, so a tab switch never changes the
       * pane's height; stacked above the frame, the cell gets a fixed
       * height and the panels scroll */}
      <div
        className={cn(
          'grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)]',
          home
            ? 'max-xl:h-[15rem] max-xl:flex-none'
            : 'max-[90rem]:h-[28rem] max-[90rem]:flex-none',
        )}
      >
        <div
          {...panelProps('prompt')}
          className={cn(
            'relative [grid-area:1/1] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--dh-focus)',
            tab !== 'prompt' && 'invisible',
          )}
        >
          {/* out of flow, so a long chat never grows the pane */}
          <PromptPane chat={chat} />
        </div>
        <div
          {...panelProps('css')}
          className={cn(
            'overflow-auto py-3 [grid-area:1/1] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--dh-focus)',
            tab !== 'css' && 'invisible',
          )}
        >
          <div key={paint}>
            <PlainDiff from={byId(chat.prev)} to={byId(chat.id)} />
            <div className="dark:hidden">
              <DiffBody diff={light} />
            </div>
            <div className="hidden dark:block">
              <DiffBody diff={dark} />
            </div>
          </div>
        </div>
        <div
          {...panelProps('tsx')}
          className={cn(
            'flex flex-col overflow-auto py-3 [grid-area:1/1] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--dh-focus)',
            tab !== 'tsx' && 'invisible',
          )}
        >
          <p className="mx-4 mb-3 flex items-center gap-2 rounded-[2px] border border-dashed border-(--dh-accent) bg-(--dh-accent-faint) px-3 py-1.5 text-(--dh-accent)">
            <LockIcon aria-hidden="true" className="size-3.5 shrink-0" />
            No changes. The same file on every site.
          </p>
          <Code code={DATA_TABLE_TSX} />
        </div>
      </div>

      <div
        className={cn(
          'border-t border-dashed border-(--v12-dash) bg-(--dh-paper-2) px-4 py-3',
          home && 'max-sm:hidden',
        )}
      >
        <p className="text-(--dh-ink-muted)">
          <span aria-hidden="true" className="text-(--dh-accent)">
            ${' '}
          </span>
          git diff --stat
        </p>
        <dl
          key={paint}
          className="wa-fade mt-1.5 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5"
        >
          <dt className="truncate">app/globals.css</dt>
          <dd className="flex items-center gap-2 tabular-nums">
            <span className="text-emerald-600 dark:text-emerald-400">
              +<PerMode light={light.changed} dark={dark.changed} />
            </span>
            <span className="text-red-600 dark:text-red-400">
              -<PerMode light={light.changed} dark={dark.changed} />
            </span>
            <span className="hidden sm:inline">
              <PerMode
                light={<StatBar n={light.changed} />}
                dark={<StatBar n={dark.changed} />}
              />
            </span>
          </dd>
          <dt className="truncate">components/data-table.tsx</dt>
          <dd className="flex items-center gap-2 text-(--dh-accent) tabular-nums">
            0
            <LockIcon aria-hidden="true" className="size-3" />
            <span className="hidden sm:inline">unchanged</span>
          </dd>
        </dl>
      </div>
    </figure>
  );
}

// the homepage's Replay pill: dashed hairline, solid once picked
const CHIP =
  'inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full whitespace-nowrap border border-dashed border-(--v12-dash) px-2.5 font-mono text-xs text-(--dh-ink-muted) transition-colors hover:border-(--dh-rule-strong) hover:bg-(--dh-paper-2) hover:text-(--dh-ink) aria-pressed:border-solid aria-pressed:border-(--dh-ink) aria-pressed:text-(--dh-ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--dh-focus)';

/**
 * Theme demo variant 9 (whole app): variant 8 (prompt diff) where each
 * request asks to restyle the whole app, not the table. When the reply lands,
 * globals.css changes (in plain words and as a diff), the whole mock app in
 * the browser frame repaints, the table with it, and data-table.tsx stays at
 * 0 changes. Autoplay
 * via useThemeCycle; a site pick or any interaction with the frame pauses
 * it. Under reduced motion it starts paused and every request applies at
 * once, without typing or motion. Borderless panes in the homepage's
 * tokens and dashed hairlines: the caller wraps it in a RiseFigure.
 */
export function WholeApp({
  home = false,
}: {
  /** The homepage cut: one screen tall on desktop, the frame first on
   * narrow screens, and a phone-sized footer. */
  home?: boolean;
} = {}) {
  const { theme, paused, select, resume, ref } = useThemeCycle({
    intervalMs: CYCLE_MS,
  });
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
  const [chat, setChat] = useState<Chat>({
    prev: LAST.id,
    id: FIRST.id,
    target: FIRST.id,
    phase: 'done',
    run: 0,
    paint: 0,
    log: [{ from: LAST.id, to: FIRST.id, key: 'x0' }],
  });

  if (chat.target !== theme.id) setChat(ask(chat, theme.id, reducedMotion));

  // typing, then sending, then the reply with the repaint
  useEffect(() => {
    if (chat.phase === 'done') return;
    const ms =
      chat.phase === 'typing'
        ? PROMPTS[chat.target].length * CHAR_MS + SEND_MS
        : THINK_MS;
    const t = setTimeout(() => setChat(advance), ms);
    return () => clearTimeout(t);
  }, [chat.phase, chat.run, chat.target]);

  const prev = byId(chat.prev);
  const shown = byId(chat.id);
  const light = diffCss(prev, shown, 'light');
  const dark = diffCss(prev, shown, 'dark');
  const site = SITES[shown.id];
  const done = chat.phase === 'done';

  const replay = () => {
    // back on the last site, so the first request types out again
    setChat(
      ask(
        {
          ...chat,
          prev: BEFORE_LAST.id,
          id: LAST.id,
          target: LAST.id,
          log: [{ from: BEFORE_LAST.id, to: LAST.id, key: `x${chat.run}` }],
        },
        FIRST.id,
        reducedMotion,
      ),
    );
    select(FIRST.id);
    resume();
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        // home: fills the screen under the sticky nav, within bounds
        home && 'xl:h-[clamp(36rem,calc(100svh-var(--v4-nav-h)-2rem),60rem)]',
      )}
    >
      <div
        className={cn(
          'grid items-stretch',
          home
            ? 'xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] xl:grid-rows-[minmax(0,1fr)]'
            : 'min-[90rem]:grid-cols-[minmax(0,1fr)_minmax(0,54.5rem)]',
        )}
      >
        <Editor chat={chat} light={light} dark={dark} home={home} />

        <div
          ref={ref}
          className={cn(
            'flex min-w-0 flex-col overflow-hidden border-dashed border-(--v12-dash) bg-(--dh-paper-2)',
            home ? 'xl:border-l' : 'max-[90rem]:border-t min-[90rem]:border-l',
          )}
        >
          <div className="flex items-center gap-3 border-b border-dashed border-(--v12-dash) px-3 py-2">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-(--dh-rule-strong)" />
              <span className="size-2.5 rounded-full bg-(--dh-rule-strong)" />
              <span className="size-2.5 rounded-full bg-(--dh-rule-strong)" />
            </span>
            <p
              aria-label="Address"
              className="flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-[2px] border border-dashed border-(--v12-dash) bg-(--dh-paper) px-2.5 font-mono text-xs"
            >
              <LockIcon
                aria-hidden="true"
                className="size-3 shrink-0 text-(--dh-ink-muted)"
              />
              <span key={site.domain} className="wa-fade truncate">
                <span className="text-(--dh-ink-muted)">https://</span>
                <span className="text-(--dh-ink)">{site.domain}</span>
                <span className="text-(--dh-ink-muted)">/members</span>
              </span>
            </p>
          </div>
          <ThemeScope theme={shown.id} className="flex flex-1 flex-col">
            <WholeAppSite name={site.name} home={home} />
          </ThemeScope>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-dashed border-(--v12-dash) px-(--v12-pad) py-3 text-sm text-(--dh-ink-muted)">
        <div
          role="group"
          aria-label="Site"
          className={cn(
            'flex flex-wrap gap-1.5',
            // phones: one row that scrolls
            home &&
              'max-sm:w-full max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:[scrollbar-width:none]',
          )}
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
                className="size-3 border border-(--dh-rule-strong) bg-(--swatch-light) dark:bg-(--swatch-dark)"
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

        <div
          className={cn(
            'flex flex-wrap items-center gap-x-4 gap-y-2',
            home && 'max-sm:w-full max-sm:flex-nowrap max-sm:justify-between',
          )}
        >
          <p
            className={cn(
              'flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 transition-opacity',
              !done && 'opacity-50',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'size-1.5 shrink-0 rounded-full',
                paused ? 'bg-(--dh-rule-strong)' : 'bg-(--dh-accent)',
              )}
            />
            <span
              className={cn(
                'flex items-center gap-1.5 text-(--dh-ink)',
                // the reply says it; keeps the footer to one row
                home && 'max-[90rem]:hidden',
              )}
            >
              <CheckIcon
                aria-hidden="true"
                className="size-4 text-(--dh-accent)"
              />
              App restyled
            </span>
            <span className="flex items-center gap-1.5 text-(--dh-ink)">
              <CheckIcon
                aria-hidden="true"
                className="size-4 text-(--dh-accent)"
              />
              Table followed
            </span>
            <span>
              <span className="font-semibold text-(--dh-ink) tabular-nums">
                0
              </span>{' '}
              lines of table code
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
              <span className={cn(home && 'max-sm:sr-only')}>
                {paused ? 'Play' : 'Pause'}
              </span>
            </button>
            <button
              type="button"
              onClick={replay}
              className={cn(CHIP, 'font-sans')}
            >
              <RotateCcwIcon aria-hidden="true" className="size-3" />
              <span className={cn(home && 'max-sm:sr-only')}>Replay</span>
            </button>
          </div>
        </div>
      </div>

      <style href="theme-demo-whole-app" precedence="default">
        {CSS}
      </style>
    </div>
  );
}
