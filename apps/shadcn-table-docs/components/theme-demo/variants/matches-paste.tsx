'use client';

import { useId, useLayoutEffect, useState, type RefObject } from 'react';
import { Button } from '@/components/ui-radix/button';
import { Textarea } from '@/components/ui-radix/textarea';
import { DEMO_THEMES } from '../demo-themes';

export type Tokens = Readonly<Record<string, string>>;

export interface PastedTheme {
  readonly light: Tokens;
  readonly dark: Tokens;
}

const MAX_BYTES = 10 * 1024;

/* The only names a paste may set, each with the property CSS.supports
 * checks its value against: the colour tokens the table and the stock parts
 * read, the radius and the sans face. */
const PROPERTY: Readonly<Record<string, string>> = {
  ...Object.fromEntries(
    Object.keys(DEMO_THEMES[0].light).map((name) => [name, 'color']),
  ),
  radius: 'border-radius',
  'font-sans': 'font-family',
};

// shadcn/ui before Tailwind v4 wrote bare HSL triples: 222.2 84% 4.9%
const HSL_TRIPLE =
  /^-?[\d.]+(?:deg)?\s+-?[\d.]+%\s+-?[\d.]+%(?:\s*\/\s*[\d.]+%?)?$/;
const UNSAFE = /url\(|[\\{}<>;@]/i;

function cleanValue(name: string, raw: string): string | null {
  const property = PROPERTY[name];
  let value = raw.replace(/\s*!important\s*$/i, '').trim();
  if (!property || !value || value.length > 200 || UNSAFE.test(value)) {
    return null;
  }
  if (property === 'color' && HSL_TRIPLE.test(value)) value = `hsl(${value})`;
  // the example is parsed at import, also on the server, where CSS is absent
  if (typeof CSS !== 'undefined' && !CSS.supports(property, value)) {
    return null;
  }
  return value;
}

export type ParseResult =
  | { ok: true; theme: PastedTheme; count: number; skipped: number }
  | { ok: false; error: string };

/**
 * Reads the shadcn variables out of a pasted `:root {}` and `.dark {}`
 * pair (a bare list of declarations counts as `:root`). Other blocks, such
 * as `@theme inline`, unknown names and values that are not a valid colour,
 * radius or font list are skipped. Dark falls back to light per token.
 */
export function parseTheme(css: string): ParseResult {
  if (new Blob([css]).size > MAX_BYTES) {
    return { ok: false, error: 'That is over 10 KB. Paste just the theme.' };
  }
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = [...text.matchAll(/([^{}]*)\{([^{}]*)\}/g)].map(
    (m) => [m[1], m[2]] as const,
  );
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};
  let skipped = 0;

  for (const [selector, body] of blocks.length ? blocks : [[':root', text]]) {
    const target = /\.dark\b/.test(selector)
      ? dark
      : /:root|\bhtml\b/.test(selector)
        ? light
        : null;
    if (!target) continue;
    for (const declaration of body.split(';')) {
      const match = /^\s*--([\w-]+)\s*:([\s\S]*)$/.exec(declaration);
      if (!match) continue;
      const name = match[1].toLowerCase();
      const value = cleanValue(name, match[2]);
      if (value) target[name] = value;
      else skipped++;
    }
  }

  const count = new Set([...Object.keys(light), ...Object.keys(dark)]).size;
  if (count === 0) {
    return {
      ok: false,
      error:
        'No shadcn variables found. Paste a :root { } block with --primary and friends.',
    };
  }
  return {
    ok: true,
    theme: { light, dark: { ...light, ...dark } },
    count,
    skipped,
  };
}

/* Mixed formats on purpose: hex, hsl, a bare HSL triple, oklch and rgb. */
export const EXAMPLE = `:root {
  --radius: 0.375rem;
  --font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
  --background: #fbfaf5;
  --foreground: hsl(150 25% 12%);
  --card: #ffffff;
  --card-foreground: hsl(150 25% 12%);
  --popover: #ffffff;
  --popover-foreground: hsl(150 25% 12%);
  --primary: oklch(0.52 0.12 155);
  --primary-foreground: #f4fbf6;
  --secondary: 100 25% 92%;
  --secondary-foreground: hsl(150 25% 18%);
  --muted: hsl(90 20% 94%);
  --muted-foreground: hsl(150 10% 38%);
  --accent: hsl(45 90% 88%);
  --accent-foreground: hsl(35 60% 22%);
  --destructive: rgb(200, 52, 40);
  --border: hsl(90 15% 86%);
  --input: hsl(90 15% 80%);
  --ring: oklch(0.52 0.12 155);
}

.dark {
  --background: oklch(0.19 0.02 160);
  --foreground: oklch(0.95 0.015 120);
  --card: oklch(0.23 0.025 160);
  --card-foreground: oklch(0.95 0.015 120);
  --popover: oklch(0.23 0.025 160);
  --popover-foreground: oklch(0.95 0.015 120);
  --primary: oklch(0.78 0.15 150);
  --primary-foreground: oklch(0.2 0.03 160);
  --secondary: oklch(0.3 0.03 160);
  --secondary-foreground: oklch(0.95 0.015 120);
  --muted: oklch(0.27 0.025 160);
  --muted-foreground: oklch(0.74 0.03 140);
  --accent: oklch(0.4 0.07 90);
  --accent-foreground: oklch(0.96 0.03 95);
  --destructive: rgb(239, 98, 82);
  --border: oklch(0.34 0.03 160);
  --input: oklch(0.4 0.03 160);
  --ring: oklch(0.78 0.15 150);
}`;

const example = parseTheme(EXAMPLE);
export const EXAMPLE_THEME: PastedTheme = example.ok
  ? example.theme
  : { light: {}, dark: {} };

/* What Radix renders straight under <body>; the same list as PORTAL_ROOTS
 * in ../theme-scope.tsx, which does not export it. */
const PORTAL =
  "body > :is([data-radix-popper-content-wrapper], div:has(> [data-slot='select-content']), [data-slot='dialog-overlay'], [data-slot='dialog-content'])";
// set on <html> by ThemeScope while it owns the portals
const OWNER = 'data-demo-theme-owner';

/**
 * Sets `tokens` inline on the ThemeScope wrapper around `anchor`, where
 * they win over the scope's stylesheet, and on the portal roots (menus,
 * selects, dialogs) while that scope owns them. Inline custom properties
 * only: the pasted text never becomes a stylesheet. Assumes it is the only
 * ThemeScope on the page.
 */
export function useScopeTokens(
  anchor: RefObject<HTMLElement | null>,
  tokens: Tokens | null,
) {
  // before paint, so a step onto the pasted theme shows no base frame
  useLayoutEffect(() => {
    const scope = anchor.current?.closest<HTMLElement>('[data-demo-theme]');
    if (!scope || !tokens) return;
    const html = document.documentElement;
    const names = Object.keys(tokens);
    const set = (el: HTMLElement) =>
      names.forEach((name) => el.style.setProperty(`--${name}`, tokens[name]));
    const clear = (el: HTMLElement) =>
      names.forEach((name) => el.style.removeProperty(`--${name}`));
    const portals = () => document.querySelectorAll<HTMLElement>(PORTAL);
    const sync = () =>
      portals().forEach(html.hasAttribute(OWNER) ? set : clear);

    set(scope);
    sync();
    // a menu's content can mount a tick after its wrapper, hence subtree
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    observer.observe(html, { attributes: true, attributeFilter: [OWNER] });
    return () => {
      observer.disconnect();
      clear(scope);
      portals().forEach(clear);
    };
  }, [anchor, tokens]);
}

/**
 * The ending's form: a prefilled theme in a textarea and an Apply button.
 * Drawn in the site theme, outside the demo.
 */
export function PastePanel({
  onApply,
}: {
  onApply: (theme: PastedTheme) => void;
}) {
  const id = useId();
  const [text, setText] = useState(EXAMPLE);
  const [status, setStatus] = useState<{ error: boolean; message: string }>({
    error: false,
    message: 'Showing the example above. Replace it with yours.',
  });

  const apply = () => {
    const result = parseTheme(text);
    if (!result.ok) {
      setStatus({ error: true, message: result.error });
      return;
    }
    onApply(result.theme);
    setStatus({
      error: false,
      message: `Applied ${result.count} variables${result.skipped ? `, skipped ${result.skipped} the table does not read` : ''}.`,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10">
      <div className="flex flex-col gap-3">
        <p className="v12-label">Your theme</p>
        <h2 className="text-2xl font-semibold tracking-tight text-balance text-(--dh-ink) sm:text-3xl">
          Paste your theme.
        </h2>
        <p className="text-pretty text-(--dh-ink-muted)">
          Copy the <code className="font-mono text-[0.9em]">:root</code> and{' '}
          <code className="font-mono text-[0.9em]">.dark</code> blocks from your{' '}
          <code className="font-mono text-[0.9em]">globals.css</code>, tweakcn
          or shadcn/ui create. oklch, hsl, hex and rgb all work.
        </p>
        <p className="text-sm text-pretty text-(--dh-ink-muted)">
          Fonts load only where your app already loads them. Here a font your
          theme names falls back to the next one in its list.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button type="button" onClick={apply}>
            Apply
          </Button>
          <p
            id={`${id}-status`}
            role="status"
            className={
              status.error
                ? 'text-sm text-destructive'
                : 'text-sm text-(--dh-ink-muted)'
            }
          >
            {status.message}
          </p>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <label htmlFor={id} className="font-mono text-xs text-(--dh-ink-muted)">
          globals.css
        </label>
        <Textarea
          id={id}
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={MAX_BYTES}
          spellCheck={false}
          aria-invalid={status.error || undefined}
          aria-describedby={`${id}-status`}
          className="h-80 resize-y font-mono text-xs leading-relaxed field-sizing-fixed md:text-xs"
        />
      </div>
    </div>
  );
}
