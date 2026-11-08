/** The color tokens the theme CSS emits per mode, in the order of the shadcn
 * token set (the Colors tab lists them in this order). */
export const TOKENS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const;

export type Token = (typeof TOKENS)[number];

export type Mode = 'light' | 'dark';

/** Per-mode token values that replace what the preset and theme give. */
export type TokenOverrides = Record<Mode, Partial<Record<Token, string>>>;

export const EMPTY_OVERRIDES: TokenOverrides = { light: {}, dark: {} };

export function isToken(value: unknown): value is Token {
  return (TOKENS as readonly unknown[]).includes(value);
}

/** True when the browser parses `value` as a color (checked with CSS.supports,
 * so oklch, hex, rgb and named colors all pass). */
export function isColorValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /[;{}]/.test(trimmed)) return false;
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('color', trimmed);
}

/** Keeps only known tokens with string values, for both modes. */
export function normalizeOverrides(input: unknown): TokenOverrides {
  const result: TokenOverrides = { light: {}, dark: {} };
  if (!input || typeof input !== 'object') return result;
  for (const mode of ['light', 'dark'] as const) {
    const values = (input as Record<string, unknown>)[mode];
    if (!values || typeof values !== 'object') continue;
    for (const [key, value] of Object.entries(values)) {
      if (isToken(key) && typeof value === 'string' && !/[;{}]/.test(value)) {
        result[mode][key] = value;
      }
    }
  }
  return result;
}
