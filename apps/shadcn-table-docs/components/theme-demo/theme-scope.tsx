'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import {
  DEMO_THEMES,
  type DemoTheme,
  type DemoThemeId,
  type DemoTokenName,
} from './demo-themes';

export interface ThemeScopeProps {
  theme: DemoThemeId;
  /** Optional font override; defaults to the theme's font. */
  font?: DemoThemeId;
  className?: string;
  children: ReactNode;
}

/* What Radix renders straight under <body> for the radix edition of the
 * table, read from the live DOM: popper wrappers (dropdown menus, popovers,
 * tooltips, popper selects), the fixed wrapper of an item-aligned select
 * (rows per page) which carries no attribute of its own, and dialog overlay
 * and content. */
const PORTAL_ROOTS = [
  '[data-radix-popper-content-wrapper]',
  "div:has(> [data-slot='select-content'])",
  "[data-slot='dialog-overlay']",
  "[data-slot='dialog-content']",
].join(', ');
const PORTAL = `body > :is(${PORTAL_ROOTS})`;

const OWNER = 'data-demo-theme-owner';
const FONT_OWNER = 'data-demo-font-owner';

const tokens = (set: DemoTheme['light']) =>
  (Object.keys(set) as DemoTokenName[])
    .map((name) => `--${name}:${set[name]};`)
    .join('');

/* `@theme inline` (app/global.css) compiles utilities such as bg-primary
 * and rounded-lg to var(--primary) and var(--radius), which follow the
 * scope. The theme variables themselves (--color-primary, --radius-md,
 * ...) are computed once at :root, so a class that reads one directly,
 * like the button's rounded-[min(var(--radius-md),12px)] or the table's
 * drag outlines, would keep the site value; the scope derives them again. */
const DERIVED = [
  ...(Object.keys(DEMO_THEMES[0].light) as DemoTokenName[]).map(
    (name) => `--color-${name}:var(--${name});`,
  ),
  ...Object.entries({
    sm: 0.6,
    md: 0.8,
    lg: 1,
    xl: 1.4,
    '2xl': 1.8,
    '3xl': 2.2,
    '4xl': 2.6,
  }).map(([size, k]) => `--radius-${size}:calc(var(--radius) * ${k});`),
  '--font-heading:var(--font-sans);',
  'font-family:var(--font-sans);',
].join('');

/* One stylesheet for every theme: the wrapper reads data-demo-theme and
 * data-demo-font; portal roots read the same values from <html> while a
 * scope owns them. Font rules come last so an override wins over the
 * theme's own face. */
const CSS = [
  `[data-demo-theme]{background-color:var(--background);color:var(--foreground)}`,
  `[data-demo-theme],html[${OWNER}] ${PORTAL}{${DERIVED}}`,
  ...DEMO_THEMES.flatMap((t) => [
    `[data-demo-theme='${t.id}'],html[${OWNER}='${t.id}'] ${PORTAL}{--radius:${t.radius};${tokens(t.light)}}`,
    `.dark [data-demo-theme='${t.id}'],html.dark[${OWNER}='${t.id}'] ${PORTAL}{${tokens(t.dark)}}`,
  ]),
  ...DEMO_THEMES.map(
    (t) =>
      `[data-demo-font='${t.id}'],html[${FONT_OWNER}='${t.id}'] ${PORTAL}{--font-sans:${t.font}}`,
  ),
].join('\n');

// the scope whose theme the portal roots show; several scopes can share a page
let owner: object | null = null;

/**
 * Scopes a demo theme to its subtree, and to the menus, selects, tooltips
 * and dialogs it opens: those portal to <body>, so while this scope holds
 * the last pointer down, hover or focus, <html> carries its theme id and the
 * stylesheet above applies it to the portal roots. A pointer down or focus
 * anywhere else, outside those portals, hands them back to the site theme.
 */
export function ThemeScope({
  theme,
  font = theme,
  className,
  children,
}: ThemeScopeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const self = useRef<object>({});
  const current = useRef({ theme, font });

  useEffect(() => {
    current.current = { theme, font };
    if (owner !== self.current) return;
    document.documentElement.setAttribute(OWNER, theme);
    document.documentElement.setAttribute(FONT_OWNER, font);
  }, [theme, font]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const html = document.documentElement;
    const me = self.current;

    const own = () => {
      owner = me;
      html.setAttribute(OWNER, current.current.theme);
      html.setAttribute(FONT_OWNER, current.current.font);
    };
    const release = () => {
      if (owner !== me) return;
      owner = null;
      html.removeAttribute(OWNER);
      html.removeAttribute(FONT_OWNER);
    };

    const onOutside = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (el.contains(target)) own();
      else if (!target.closest(PORTAL_ROOTS)) release();
    };
    // tooltips open on hover alone; take the portals only while none is
    // open, so a menu another scope or the site opened keeps its theme
    const onHover = () => {
      if (owner !== me && !document.querySelector(PORTAL)) own();
    };

    document.addEventListener('pointerdown', onOutside, true);
    document.addEventListener('focusin', onOutside);
    el.addEventListener('pointerover', onHover);
    return () => {
      document.removeEventListener('pointerdown', onOutside, true);
      document.removeEventListener('focusin', onOutside);
      el.removeEventListener('pointerover', onHover);
      release();
    };
  }, []);

  return (
    <div
      ref={ref}
      data-demo-theme={theme}
      data-demo-font={font}
      className={className}
    >
      <style href="theme-demo-scope" precedence="default">
        {CSS}
      </style>
      {children}
    </div>
  );
}
