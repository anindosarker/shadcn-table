'use client';

import dynamic from 'next/dynamic';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import {
  DEMO_THEMES,
  type DemoTheme,
  type DemoTokenName,
} from '../demo-themes';
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

const TOKEN_NAMES = Object.keys(DEMO_THEMES[0].light) as DemoTokenName[];

// the tokens that cover the most pixels of the table, kept when the list collapses
const VISIBLE = new Set<DemoTokenName>([
  'background',
  'foreground',
  'primary',
  'secondary',
  'muted-foreground',
  'border',
]);

// the utilities whose bare form (no variant, optional /opacity) paints a token
const UTILITIES = ['bg', 'text', 'border', 'ring', 'outline', 'fill', 'stroke'];
// sides of the bare `border` utility, which paints var(--border) from the base layer
const BARE_BORDER = /^border(-[trblxy])?$/;
// a border-* class that is not a side, width or style sets its own colour
const BORDER_COLOUR =
  /^border-(?!(?:[trblxy](?:-|$))|\d|solid|dashed|dotted|double|none)/;
const MAX_OUTLINES = 60;

/* The flash replays on remount (rows are keyed by theme) and only for the
 * site mode whose value changed: a row lists the modes that changed in
 * data-flash, `.dark` picks which one counts. */
const CSS = `
@keyframes theme-demo-token-row{from{background-color:color-mix(in oklab,var(--color-foreground) 10%,transparent)}to{background-color:transparent}}
@keyframes theme-demo-token-swatch{from{transform:scale(1.35)}to{transform:scale(1)}}
@media (prefers-reduced-motion:no-preference){
[data-flash~='light']{animation:theme-demo-token-row 1.4s ease-out}
[data-flash~='light'] [data-swatch]{animation:theme-demo-token-swatch .5s cubic-bezier(.3,1.6,.5,1)}
.dark [data-flash]:not([data-flash~='dark']),.dark [data-flash]:not([data-flash~='dark']) [data-swatch]{animation:none}
.dark [data-flash~='dark']{animation:theme-demo-token-row 1.4s ease-out}
.dark [data-flash~='dark'] [data-swatch]{animation:theme-demo-token-swatch .5s cubic-bezier(.3,1.6,.5,1)}
}`;

interface Outline {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: string;
}

const usesToken = (el: Element, token: DemoTokenName) => {
  const classes = Array.from(el.classList).filter((c) => !c.includes(':'));
  return (
    classes.some((c) =>
      UTILITIES.some(
        (u) => c === `${u}-${token}` || c.startsWith(`${u}-${token}/`),
      ),
    ) ||
    (token === 'border' &&
      classes.some((c) => BARE_BORDER.test(c)) &&
      !classes.some((c) => BORDER_COLOUR.test(c)))
  );
};

/** Boxes, relative to `pane`, around what in the scope paints `token`. */
function measure(pane: HTMLElement, token: DemoTokenName): Outline[] {
  const scope = pane.querySelector<HTMLElement>('[data-demo-theme]');
  if (!scope) return [];
  const els =
    token === 'background'
      ? [scope]
      : Array.from(scope.querySelectorAll('[class]')).filter((el) =>
          usesToken(el, token),
        );
  const base = pane.getBoundingClientRect();
  return els
    .slice(0, MAX_OUTLINES)
    .map((el) => ({ box: el.getBoundingClientRect(), el }))
    .filter(({ box }) => box.width > 0 && box.height > 0)
    .map(({ box, el }) => ({
      x: box.left - base.left,
      y: box.top - base.top,
      width: box.width,
      height: box.height,
      radius: getComputedStyle(el).borderRadius,
    }));
}

const changedModes = (
  previous: DemoTheme | undefined,
  theme: DemoTheme,
  name: DemoTokenName,
) =>
  previous
    ? [
        previous.light[name] !== theme.light[name] ? 'light' : '',
        previous.dark[name] !== theme.dark[name] ? 'dark' : '',
      ]
        .filter(Boolean)
        .join(' ') || undefined
    : undefined;

interface TokenRowProps {
  name: string;
  swatch: ReactNode;
  value: ReactNode;
  flash?: string;
  collapsible?: boolean;
  onHover?: (hovering: boolean) => void;
}

function TokenRow({
  name,
  swatch,
  value,
  flash,
  collapsible = false,
  onHover,
}: TokenRowProps) {
  return (
    <li
      data-flash={flash}
      onPointerEnter={onHover ? () => onHover(true) : undefined}
      onPointerLeave={onHover ? () => onHover(false) : undefined}
      className={cn(
        'grid h-7 grid-cols-[1rem_minmax(0,1fr)_auto] items-center gap-2.5 rounded-md px-2 font-mono text-[11px] transition-colors hover:bg-accent/60',
        collapsible && 'max-lg:hidden max-lg:group-data-expanded:grid',
      )}
    >
      <span data-swatch className="flex size-4 items-center justify-center">
        {swatch}
      </span>
      <span className="truncate text-foreground">{name}</span>
      <span className="truncate text-right text-muted-foreground tabular-nums">
        {value}
      </span>
    </li>
  );
}

/**
 * Variant 3: the current theme's tokens beside the table they paint. Chips
 * on top, rows flash when a switch changes their value, and hovering a
 * colour row outlines what in the table uses it. Values follow the site's
 * light or dark mode, as the scope does.
 */
export function TokensDemo() {
  const { theme, paused, select, resume, ref } = useThemeCycle();
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState<DemoTokenName>();
  const [outlines, setOutlines] = useState<Outline[]>([]);
  const paneRef = useRef<HTMLDivElement>(null);

  // the theme shown before the last switch, so rows know what changed
  const [shown, setShown] = useState<{
    theme: DemoTheme;
    previous?: DemoTheme;
  }>({ theme });
  if (shown.theme !== theme) setShown({ theme, previous: shown.theme });
  const previous = shown.previous;

  // measured a frame after a hover or a switch, once the new radius and font laid out
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const pane = paneRef.current;
      setOutlines(hovered && pane ? measure(pane, hovered) : []);
    });
    return () => cancelAnimationFrame(frame);
  }, [hovered, theme]);

  const hover = (name: DemoTokenName) => (hovering: boolean) =>
    setHovered(hovering ? name : undefined);

  return (
    <div className="flex flex-col gap-5">
      <style href="theme-demo-tokens" precedence="default">
        {CSS}
      </style>

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
        ) : null}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[21.5rem_minmax(0,1fr)]">
        <section
          aria-label={`${theme.label} theme tokens`}
          data-expanded={expanded || undefined}
          className="group rounded-xl border bg-card/40 p-1.5"
        >
          <header className="flex items-center justify-between px-2 pt-1.5 pb-2">
            <span className="font-mono text-xs text-foreground">
              <span className="text-muted-foreground">
                <span className="dark:hidden">:root</span>
                <span className="hidden dark:inline">.dark</span>
              </span>{' '}
              {theme.label.toLowerCase()}
            </span>
            <span className="text-[11px] text-muted-foreground">
              <span className="max-lg:hidden">{TOKEN_NAMES.length}</span>
              <span className="lg:hidden group-data-expanded:hidden">
                {VISIBLE.size} of {TOKEN_NAMES.length}
              </span>
              <span className="hidden max-lg:group-data-expanded:inline">
                {TOKEN_NAMES.length}
              </span>{' '}
              colours
            </span>
          </header>

          <ul className="grid gap-px sm:max-lg:grid-cols-2 sm:max-lg:gap-x-2">
            {TOKEN_NAMES.map((name) => (
              <TokenRow
                key={`${theme.id}:${name}`}
                name={`--${name}`}
                flash={changedModes(previous, theme, name)}
                collapsible={!VISIBLE.has(name)}
                onHover={hover(name)}
                swatch={
                  <span
                    className="size-4 rounded-[5px] border border-foreground/15 bg-(--swatch-light) dark:bg-(--swatch-dark)"
                    style={
                      {
                        '--swatch-light': theme.light[name],
                        '--swatch-dark': theme.dark[name],
                      } as CSSProperties
                    }
                  />
                }
                value={
                  <>
                    <span className="dark:hidden">{theme.light[name]}</span>
                    <span className="hidden dark:inline">
                      {theme.dark[name]}
                    </span>
                  </>
                }
              />
            ))}
            <TokenRow
              key={`${theme.id}:radius`}
              name="--radius"
              flash={
                previous && previous.radius !== theme.radius
                  ? 'light dark'
                  : undefined
              }
              swatch={
                <span
                  className="size-3.5 translate-x-0.5 translate-y-0.5 border-t-2 border-l-2 border-foreground/60"
                  style={{ borderTopLeftRadius: theme.radius }}
                />
              }
              value={theme.radius}
            />
            <TokenRow
              key={`${theme.id}:font`}
              name="--font-sans"
              flash={
                previous && previous.font !== theme.font
                  ? 'light dark'
                  : undefined
              }
              swatch={
                <span
                  className="text-xs leading-none text-foreground"
                  style={{ fontFamily: theme.font }}
                >
                  Aa
                </span>
              }
              value={theme.fontLabel}
            />
          </ul>

          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
            className="mt-1 w-full rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-accent/60 hover:text-foreground lg:hidden"
          >
            {expanded
              ? 'Show fewer tokens'
              : `Show all ${TOKEN_NAMES.length} colours`}
          </button>
        </section>

        <div ref={paneRef} className="relative min-w-0">
          <div ref={ref}>
            <ThemeScope
              theme={theme.id}
              className="overflow-hidden rounded-xl border p-3"
            >
              <ThemeTable />
            </ThemeScope>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-xl"
          >
            {outlines.map((o, i) => (
              <span
                key={i}
                className="absolute outline-2 outline-offset-1 outline-sky-500 outline-dashed"
                style={{
                  left: o.x,
                  top: o.y,
                  width: o.width,
                  height: o.height,
                  borderRadius: o.radius,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
