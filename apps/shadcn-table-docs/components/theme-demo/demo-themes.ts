import { jetbrainsMono, sourceSerif, spaceGrotesk } from './fonts';

export type DemoTokenName =
  | 'background'
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'destructive'
  | 'border'
  | 'input'
  | 'ring';

export interface DemoTheme {
  readonly id: 'neutral' | 'paper' | 'brutal' | 'ocean' | 'candy';
  readonly label: string;
  /** CSS value for --font-sans: a next/font family name plus fallbacks. */
  readonly font: string;
  readonly fontLabel: string;
  readonly radius: string;
  readonly light: Readonly<Record<DemoTokenName, string>>;
  readonly dark: Readonly<Record<DemoTokenName, string>>;
}

export type DemoThemeId = DemoTheme['id'];

// the site face, set on <html> by app/layout.tsx
const INTER = 'var(--font-inter), ui-sans-serif, system-ui, sans-serif';

/**
 * Five themes that differ on every axis the table reads: surfaces, primary,
 * accent, border weight, font and radius. A dedicated set, unrelated to the
 * site presets (lib/theme-presets.ts, themes/*.css), which only change hue.
 */
export const DEMO_THEMES: readonly DemoTheme[] = [
  {
    // stock shadcn/ui neutral
    id: 'neutral',
    label: 'Neutral',
    font: INTER,
    fontLabel: 'Inter',
    radius: '0.625rem',
    light: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.145 0 0)',
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.145 0 0)',
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.145 0 0)',
      primary: 'oklch(0.205 0 0)',
      'primary-foreground': 'oklch(0.985 0 0)',
      secondary: 'oklch(0.97 0 0)',
      'secondary-foreground': 'oklch(0.205 0 0)',
      muted: 'oklch(0.97 0 0)',
      'muted-foreground': 'oklch(0.556 0 0)',
      accent: 'oklch(0.97 0 0)',
      'accent-foreground': 'oklch(0.205 0 0)',
      destructive: 'oklch(0.577 0.245 27.325)',
      border: 'oklch(0.922 0 0)',
      input: 'oklch(0.922 0 0)',
      ring: 'oklch(0.708 0 0)',
    },
    dark: {
      background: 'oklch(0.145 0 0)',
      foreground: 'oklch(0.985 0 0)',
      card: 'oklch(0.205 0 0)',
      'card-foreground': 'oklch(0.985 0 0)',
      popover: 'oklch(0.205 0 0)',
      'popover-foreground': 'oklch(0.985 0 0)',
      primary: 'oklch(0.922 0 0)',
      'primary-foreground': 'oklch(0.205 0 0)',
      secondary: 'oklch(0.269 0 0)',
      'secondary-foreground': 'oklch(0.985 0 0)',
      muted: 'oklch(0.269 0 0)',
      'muted-foreground': 'oklch(0.708 0 0)',
      accent: 'oklch(0.269 0 0)',
      'accent-foreground': 'oklch(0.985 0 0)',
      destructive: 'oklch(0.704 0.191 22.216)',
      border: 'oklch(1 0 0 / 10%)',
      input: 'oklch(1 0 0 / 15%)',
      ring: 'oklch(0.556 0 0)',
    },
  },
  {
    // warm off-white paper, terracotta primary
    id: 'paper',
    label: 'Paper',
    font: `${sourceSerif.style.fontFamily}, ui-serif, Georgia, serif`,
    fontLabel: 'Source Serif 4',
    radius: '0.5rem',
    light: {
      background: 'oklch(0.975 0.012 80)',
      foreground: 'oklch(0.27 0.03 50)',
      card: 'oklch(0.987 0.009 80)',
      'card-foreground': 'oklch(0.27 0.03 50)',
      popover: 'oklch(0.987 0.009 80)',
      'popover-foreground': 'oklch(0.27 0.03 50)',
      primary: 'oklch(0.58 0.15 40)',
      'primary-foreground': 'oklch(0.98 0.01 80)',
      secondary: 'oklch(0.93 0.025 75)',
      'secondary-foreground': 'oklch(0.32 0.04 50)',
      muted: 'oklch(0.94 0.02 78)',
      'muted-foreground': 'oklch(0.5 0.035 55)',
      accent: 'oklch(0.92 0.04 60)',
      'accent-foreground': 'oklch(0.3 0.05 45)',
      destructive: 'oklch(0.55 0.2 25)',
      border: 'oklch(0.88 0.025 75)',
      input: 'oklch(0.86 0.03 70)',
      ring: 'oklch(0.58 0.15 40)',
    },
    dark: {
      background: 'oklch(0.2 0.015 55)',
      foreground: 'oklch(0.93 0.02 80)',
      card: 'oklch(0.24 0.018 55)',
      'card-foreground': 'oklch(0.93 0.02 80)',
      popover: 'oklch(0.24 0.018 55)',
      'popover-foreground': 'oklch(0.93 0.02 80)',
      primary: 'oklch(0.68 0.15 42)',
      'primary-foreground': 'oklch(0.18 0.02 50)',
      secondary: 'oklch(0.3 0.02 55)',
      'secondary-foreground': 'oklch(0.93 0.02 80)',
      muted: 'oklch(0.28 0.018 55)',
      'muted-foreground': 'oklch(0.72 0.03 70)',
      accent: 'oklch(0.33 0.04 50)',
      'accent-foreground': 'oklch(0.94 0.02 80)',
      destructive: 'oklch(0.66 0.19 25)',
      border: 'oklch(0.34 0.02 55)',
      input: 'oklch(0.38 0.025 55)',
      ring: 'oklch(0.68 0.15 42)',
    },
  },
  {
    // high contrast: black (white in dark) borders, square corners, yellow
    id: 'brutal',
    label: 'Brutal',
    font: `${jetbrainsMono.style.fontFamily}, ui-monospace, monospace`,
    fontLabel: 'JetBrains Mono',
    radius: '0rem',
    light: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0 0 0)',
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0 0 0)',
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0 0 0)',
      primary: 'oklch(0.88 0.18 98)',
      'primary-foreground': 'oklch(0 0 0)',
      secondary: 'oklch(0.2 0 0)',
      'secondary-foreground': 'oklch(0.98 0 0)',
      muted: 'oklch(0.95 0 0)',
      'muted-foreground': 'oklch(0.35 0 0)',
      accent: 'oklch(0.92 0.16 98)',
      'accent-foreground': 'oklch(0 0 0)',
      destructive: 'oklch(0.6 0.24 28)',
      border: 'oklch(0 0 0)',
      input: 'oklch(0 0 0)',
      ring: 'oklch(0 0 0)',
    },
    dark: {
      background: 'oklch(0.12 0 0)',
      foreground: 'oklch(1 0 0)',
      card: 'oklch(0.12 0 0)',
      'card-foreground': 'oklch(1 0 0)',
      popover: 'oklch(0.12 0 0)',
      'popover-foreground': 'oklch(1 0 0)',
      primary: 'oklch(0.9 0.18 100)',
      'primary-foreground': 'oklch(0 0 0)',
      secondary: 'oklch(0.95 0 0)',
      'secondary-foreground': 'oklch(0 0 0)',
      muted: 'oklch(0.22 0 0)',
      'muted-foreground': 'oklch(0.8 0 0)',
      accent: 'oklch(0.9 0.18 100)',
      'accent-foreground': 'oklch(0 0 0)',
      destructive: 'oklch(0.68 0.22 28)',
      border: 'oklch(1 0 0)',
      input: 'oklch(1 0 0)',
      ring: 'oklch(0.9 0.18 100)',
    },
  },
  {
    // cool blue surfaces, cyan primary
    id: 'ocean',
    label: 'Ocean',
    font: `${spaceGrotesk.style.fontFamily}, ui-sans-serif, system-ui, sans-serif`,
    fontLabel: 'Space Grotesk',
    radius: '0.75rem',
    light: {
      background: 'oklch(0.97 0.015 230)',
      foreground: 'oklch(0.25 0.05 250)',
      card: 'oklch(0.985 0.01 230)',
      'card-foreground': 'oklch(0.25 0.05 250)',
      popover: 'oklch(0.985 0.01 230)',
      'popover-foreground': 'oklch(0.25 0.05 250)',
      primary: 'oklch(0.62 0.13 215)',
      'primary-foreground': 'oklch(0.98 0.01 220)',
      secondary: 'oklch(0.92 0.03 230)',
      'secondary-foreground': 'oklch(0.3 0.06 250)',
      muted: 'oklch(0.93 0.025 230)',
      'muted-foreground': 'oklch(0.5 0.05 245)',
      accent: 'oklch(0.9 0.05 215)',
      'accent-foreground': 'oklch(0.28 0.06 245)',
      destructive: 'oklch(0.6 0.21 20)',
      border: 'oklch(0.87 0.03 235)',
      input: 'oklch(0.85 0.035 235)',
      ring: 'oklch(0.62 0.13 215)',
    },
    dark: {
      background: 'oklch(0.2 0.04 250)',
      foreground: 'oklch(0.94 0.02 220)',
      card: 'oklch(0.24 0.045 250)',
      'card-foreground': 'oklch(0.94 0.02 220)',
      popover: 'oklch(0.24 0.045 250)',
      'popover-foreground': 'oklch(0.94 0.02 220)',
      primary: 'oklch(0.78 0.13 210)',
      'primary-foreground': 'oklch(0.2 0.04 250)',
      secondary: 'oklch(0.3 0.05 250)',
      'secondary-foreground': 'oklch(0.94 0.02 220)',
      muted: 'oklch(0.28 0.045 250)',
      'muted-foreground': 'oklch(0.72 0.04 230)',
      accent: 'oklch(0.34 0.06 230)',
      'accent-foreground': 'oklch(0.95 0.02 220)',
      destructive: 'oklch(0.68 0.19 20)',
      border: 'oklch(0.34 0.05 250)',
      input: 'oklch(0.38 0.05 250)',
      ring: 'oklch(0.78 0.13 210)',
    },
  },
  {
    // pink primary, lilac secondary and accent, very round
    id: 'candy',
    label: 'Candy',
    font: INTER,
    fontLabel: 'Inter',
    radius: '1.25rem',
    light: {
      background: 'oklch(0.99 0.008 330)',
      foreground: 'oklch(0.3 0.06 320)',
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.3 0.06 320)',
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.3 0.06 320)',
      primary: 'oklch(0.66 0.21 355)',
      'primary-foreground': 'oklch(0.99 0.01 350)',
      secondary: 'oklch(0.94 0.04 300)',
      'secondary-foreground': 'oklch(0.35 0.1 300)',
      muted: 'oklch(0.96 0.02 320)',
      'muted-foreground': 'oklch(0.52 0.06 320)',
      accent: 'oklch(0.92 0.06 300)',
      'accent-foreground': 'oklch(0.35 0.12 300)',
      destructive: 'oklch(0.6 0.22 25)',
      border: 'oklch(0.91 0.03 320)',
      input: 'oklch(0.89 0.04 320)',
      ring: 'oklch(0.66 0.21 355)',
    },
    dark: {
      background: 'oklch(0.21 0.04 310)',
      foreground: 'oklch(0.96 0.02 330)',
      card: 'oklch(0.25 0.05 310)',
      'card-foreground': 'oklch(0.96 0.02 330)',
      popover: 'oklch(0.25 0.05 310)',
      'popover-foreground': 'oklch(0.96 0.02 330)',
      primary: 'oklch(0.74 0.18 355)',
      'primary-foreground': 'oklch(0.2 0.04 330)',
      secondary: 'oklch(0.32 0.07 300)',
      'secondary-foreground': 'oklch(0.95 0.02 320)',
      muted: 'oklch(0.3 0.05 310)',
      'muted-foreground': 'oklch(0.75 0.05 320)',
      accent: 'oklch(0.38 0.09 300)',
      'accent-foreground': 'oklch(0.96 0.02 320)',
      destructive: 'oklch(0.68 0.2 22)',
      border: 'oklch(0.35 0.06 310)',
      input: 'oklch(0.4 0.06 310)',
      ring: 'oklch(0.74 0.18 355)',
    },
  },
];
