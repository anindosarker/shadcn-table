/** Design system config for the theme customizer, mirroring ui.shadcn.com/create
 * (shadcn-ui apps/v4/registry/config.ts and app/(app)/(create)). Shared by the
 * pre-paint script in app/layout.tsx (server) and the provider (client). */
import { decodePreset } from 'shadcn/preset';

import {
  COLOR_PRESETS,
  findColorPreset,
} from '@/lib/design-system/color-presets';
import { THEMES, type RegistryTheme } from '@/lib/design-system/themes';
import {
  EMPTY_OVERRIDES,
  normalizeOverrides,
  TOKENS,
  type TokenOverrides,
} from '@/lib/design-system/tokens';

export const STYLES = [
  { name: 'vega', title: 'Vega', description: 'Clean, neutral, and familiar' },
  { name: 'nova', title: 'Nova', description: 'Reduced padding and margins' },
  {
    name: 'maia',
    title: 'Maia',
    description: 'Rounded, with generous spacing',
  },
  {
    name: 'lyra',
    title: 'Lyra',
    description: 'Boxy and sharp. For mono fonts',
  },
  { name: 'mira', title: 'Mira', description: 'Made for compact interfaces' },
  { name: 'luma', title: 'Luma', description: 'Fluid, luminous, and soft' },
  { name: 'sera', title: 'Sera', description: 'Editorial and typographic' },
  { name: 'rhea', title: 'Rhea', description: 'Like Luma but compact' },
] as const;

export type StyleName = (typeof STYLES)[number]['name'];

const BASE_COLOR_NAMES = [
  'neutral',
  'stone',
  'zinc',
  'mauve',
  'olive',
  'mist',
  'taupe',
] as const;

export const BASE_COLORS = THEMES.filter((t) =>
  (BASE_COLOR_NAMES as readonly string[]).includes(t.name),
);

/** Themes valid for a base color: the base color itself plus every accent theme. */
export function getThemesForBaseColor(baseColor: string) {
  return THEMES.filter(
    (t) =>
      t.name === baseColor ||
      !(BASE_COLOR_NAMES as readonly string[]).includes(t.name),
  );
}

/** Fonts in create's order; `variable` is the next/font variable from lib/design-system/fonts.ts. */
export const FONTS = [
  {
    value: 'geist',
    title: 'Geist',
    variable: '--font-geist-sans',
    family: "'Geist Variable', sans-serif",
  },
  {
    value: 'inter',
    title: 'Inter',
    variable: '--font-inter',
    family: "'Inter Variable', sans-serif",
  },
  {
    value: 'noto-sans',
    title: 'Noto Sans',
    variable: '--font-noto-sans',
    family: "'Noto Sans Variable', sans-serif",
  },
  {
    value: 'nunito-sans',
    title: 'Nunito Sans',
    variable: '--font-nunito-sans',
    family: "'Nunito Sans Variable', sans-serif",
  },
  {
    value: 'figtree',
    title: 'Figtree',
    variable: '--font-figtree',
    family: "'Figtree Variable', sans-serif",
  },
  {
    value: 'roboto',
    title: 'Roboto',
    variable: '--font-roboto',
    family: "'Roboto Variable', sans-serif",
  },
  {
    value: 'raleway',
    title: 'Raleway',
    variable: '--font-raleway',
    family: "'Raleway Variable', sans-serif",
  },
  {
    value: 'dm-sans',
    title: 'DM Sans',
    variable: '--font-dm-sans',
    family: "'DM Sans Variable', sans-serif",
  },
  {
    value: 'public-sans',
    title: 'Public Sans',
    variable: '--font-public-sans',
    family: "'Public Sans Variable', sans-serif",
  },
  {
    value: 'outfit',
    title: 'Outfit',
    variable: '--font-outfit',
    family: "'Outfit Variable', sans-serif",
  },
  {
    value: 'oxanium',
    title: 'Oxanium',
    variable: '--font-oxanium',
    family: "'Oxanium Variable', sans-serif",
  },
  {
    value: 'manrope',
    title: 'Manrope',
    variable: '--font-manrope',
    family: "'Manrope Variable', sans-serif",
  },
  {
    value: 'space-grotesk',
    title: 'Space Grotesk',
    variable: '--font-space-grotesk',
    family: "'Space Grotesk Variable', sans-serif",
  },
  {
    value: 'montserrat',
    title: 'Montserrat',
    variable: '--font-montserrat',
    family: "'Montserrat Variable', sans-serif",
  },
  {
    value: 'ibm-plex-sans',
    title: 'IBM Plex Sans',
    variable: '--font-ibm-plex-sans',
    family: "'IBM Plex Sans Variable', sans-serif",
  },
  {
    value: 'source-sans-3',
    title: 'Source Sans 3',
    variable: '--font-source-sans-3',
    family: "'Source Sans 3 Variable', sans-serif",
  },
  {
    value: 'instrument-sans',
    title: 'Instrument Sans',
    variable: '--font-instrument-sans',
    family: "'Instrument Sans Variable', sans-serif",
  },
  {
    value: 'geist-mono',
    title: 'Geist Mono',
    variable: '--font-geist-mono',
    family: "'Geist Mono Variable', monospace",
  },
  {
    value: 'jetbrains-mono',
    title: 'JetBrains Mono',
    variable: '--font-jetbrains-mono',
    family: "'JetBrains Mono Variable', monospace",
  },
  {
    value: 'noto-serif',
    title: 'Noto Serif',
    variable: '--font-noto-serif',
    family: "'Noto Serif Variable', serif",
  },
  {
    value: 'roboto-slab',
    title: 'Roboto Slab',
    variable: '--font-roboto-slab',
    family: "'Roboto Slab Variable', serif",
  },
  {
    value: 'merriweather',
    title: 'Merriweather',
    variable: '--font-merriweather',
    family: "'Merriweather Variable', serif",
  },
  {
    value: 'lora',
    title: 'Lora',
    variable: '--font-lora',
    family: "'Lora Variable', serif",
  },
  {
    value: 'playfair-display',
    title: 'Playfair Display',
    variable: '--font-playfair-display',
    family: "'Playfair Display Variable', serif",
  },
  {
    value: 'eb-garamond',
    title: 'EB Garamond',
    variable: '--font-eb-garamond',
    family: "'EB Garamond Variable', serif",
  },
  {
    value: 'instrument-serif',
    title: 'Instrument Serif',
    variable: '--font-instrument-serif',
    family: "'Instrument Serif', serif",
  },
] as const;

export type FontValue = (typeof FONTS)[number]['value'];
export type FontHeadingValue = 'inherit' | FontValue;

export const RADII = [
  { name: 'default', title: 'Default', value: '' },
  { name: 'none', title: 'None', value: '0' },
  { name: 'small', title: 'Small', value: '0.45rem' },
  { name: 'medium', title: 'Medium', value: '0.625rem' },
  { name: 'large', title: 'Large', value: '0.875rem' },
] as const;

export type RadiusValue = (typeof RADII)[number]['name'];

export const MENU_ACCENTS = [
  { value: 'subtle', title: 'Subtle' },
  { value: 'bold', title: 'Bold' },
] as const;

export const MENU_COLORS = [
  { value: 'default', title: 'Default' },
  { value: 'inverted', title: 'Inverted' },
  { value: 'default-translucent', title: 'Default Translucent' },
  { value: 'inverted-translucent', title: 'Inverted Translucent' },
] as const;

/** The icon sets the registry ships an edition for (titles as lib/install.ts); the
 * Icon Library select applies the pick to every example table (spec 14, D27). */
export const ICON_LIBRARIES = [
  { name: 'lucide', title: 'Lucide' },
  { name: 'tabler', title: 'Tabler' },
  { name: 'phosphor', title: 'Phosphor' },
  { name: 'hugeicons', title: 'Hugeicons' },
  { name: 'remixicon', title: 'Remix Icon' },
] as const;

export type IconLibraryName = (typeof ICON_LIBRARIES)[number]['name'];

export type MenuAccentValue = (typeof MENU_ACCENTS)[number]['value'];
export type MenuColorValue = (typeof MENU_COLORS)[number]['value'];

export type DesignSystemConfig = {
  style: StyleName;
  baseColor: string;
  theme: string;
  chartColor: string;
  font: FontValue;
  fontHeading: FontHeadingValue;
  radius: RadiusValue;
  menuAccent: MenuAccentValue;
  menuColor: MenuColorValue;
  /** The example tables' icon set (components/example-icons.tsx); the docs chrome stays
   * Lucide. */
  iconLibrary: IconLibraryName;
  /** A full palette from lib/design-system/color-presets.ts that replaces the base color,
   * theme and chart tokens, or "none". Not part of create's preset codes. */
  colorPreset: string;
  /** Per-token values from the Colors tab, applied after every other color. */
  overrides: TokenOverrides;
};

/** The docs' own setup: components.json (radix-nova, neutral, lucide, menuColor default,
 * menuAccent subtle) in Inter, with the Emerald palette (the `default` color preset). */
export const DEFAULT_CONFIG: DesignSystemConfig = {
  style: 'nova',
  baseColor: 'neutral',
  theme: 'neutral',
  chartColor: 'neutral',
  font: 'inter',
  fontHeading: 'inherit',
  radius: 'default',
  menuAccent: 'subtle',
  menuColor: 'default',
  iconLibrary: 'lucide',
  colorPreset: 'default',
  overrides: EMPTY_OVERRIDES,
};

function pick<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function isTranslucentMenuColor(value: MenuColorValue) {
  return value === 'default-translucent' || value === 'inverted-translucent';
}

/** Validates every field and applies create's cross-field rules
 * (search-params.ts normalizeDesignSystemParams, design-system-provider.tsx radius rules). */
export function normalizeConfig(
  input: Partial<Record<keyof DesignSystemConfig, unknown>>,
): DesignSystemConfig {
  const d = DEFAULT_CONFIG;
  const style = pick(
    input.style,
    STYLES.map((s) => s.name),
    d.style,
  );
  const baseColor = pick(
    input.baseColor,
    BASE_COLORS.map((c) => c.name),
    'neutral',
  );
  const available = getThemesForBaseColor(baseColor).map((t) => t.name);
  const theme = pick(input.theme, available, available[0]);
  // create (search-params.ts) falls back to the first valid entry, the base color.
  const chartColor = pick(input.chartColor, available, available[0]);
  const font = pick(
    input.font,
    FONTS.map((f) => f.value),
    d.font,
  );
  let fontHeading = pick<FontHeadingValue>(
    input.fontHeading,
    ['inherit', ...FONTS.map((f) => f.value)],
    'inherit',
  );
  if (fontHeading === font) fontHeading = 'inherit';
  let radius = pick(
    input.radius,
    RADII.map((r) => r.name),
    d.radius,
  );
  if (style === 'lyra' || style === 'sera') radius = 'none';
  if (style === 'rhea' && radius === 'large') radius = 'default';
  const menuColor = pick(
    input.menuColor,
    MENU_COLORS.map((m) => m.value),
    d.menuColor,
  );
  let menuAccent = pick(
    input.menuAccent,
    MENU_ACCENTS.map((m) => m.value),
    d.menuAccent,
  );
  if (menuAccent === 'bold' && isTranslucentMenuColor(menuColor)) {
    menuAccent = 'subtle';
  }
  const iconLibrary = pick(
    input.iconLibrary,
    ICON_LIBRARIES.map((l) => l.name),
    d.iconLibrary,
  );
  const colorPreset = pick(
    input.colorPreset,
    ['none', ...COLOR_PRESETS.map((p) => p.name)],
    d.colorPreset,
  );
  const overrides = normalizeOverrides(input.overrides);

  return {
    style,
    baseColor,
    theme,
    chartColor,
    font,
    fontHeading,
    radius,
    menuAccent,
    menuColor,
    iconLibrary,
    colorPreset,
    overrides,
  };
}

function findTheme(name: string): RegistryTheme | undefined {
  return THEMES.find((t) => t.name === name);
}

function fontFamily(value: FontValue) {
  const font = FONTS.find((f) => f.value === value) ?? FONTS[0];
  return `var(${font.variable}), ${font.family}`;
}

/** Light and dark token sets for a config (registry/config.ts buildRegistryTheme).
 * A color preset replaces the base color, theme and chart tokens; its radius is what the
 * "Default" radius shows. Menu accent, radius and fonts still apply on top. */
export function buildThemeVars(config: DesignSystemConfig) {
  const preset = findColorPreset(config.colorPreset);
  const base = findTheme(config.baseColor);
  const theme = findTheme(config.theme);
  const light: Record<string, string> = preset
    ? { ...preset.light }
    : { ...base?.cssVars.light, ...theme?.cssVars.light };
  const dark: Record<string, string> = preset
    ? { ...preset.dark }
    : { ...base?.cssVars.dark, ...theme?.cssVars.dark };

  const chart = preset ? undefined : findTheme(config.chartColor);
  for (let i = 1; i <= 5; i++) {
    const key = `chart-${i}`;
    if (chart?.cssVars.light[key]) light[key] = chart.cssVars.light[key];
    if (chart?.cssVars.dark[key]) dark[key] = chart.cssVars.dark[key];
  }

  if (config.menuAccent === 'bold') {
    light.accent = light.primary;
    light['accent-foreground'] = light['primary-foreground'];
    dark.accent = dark.primary;
    dark['accent-foreground'] = dark['primary-foreground'];
  }

  for (const token of TOKENS) {
    const lightValue = config.overrides.light[token];
    const darkValue = config.overrides.dark[token];
    if (lightValue) light[token] = lightValue;
    if (darkValue) dark[token] = darkValue;
  }

  const radius = RADII.find((r) => r.name === config.radius);
  if (radius?.value) light.radius = radius.value;

  light['font-sans'] = fontFamily(config.font);
  light['font-heading'] =
    config.fontHeading === 'inherit'
      ? light['font-sans']
      : fontFamily(config.fontHeading);

  return { light, dark };
}

/** Attribute the pre-paint script and provider set on <html>; the theme rules key on it
 * so they outrank the fallback tokens in app/global.css regardless of stylesheet order. */
export const DESIGN_SYSTEM_ATTRIBUTE = 'data-design-system';
export const THEME_STYLE_ELEMENT_ID = 'design-system-theme-vars';
export const STORAGE_KEY = 'st-design-system';

function cssRule(selector: string, vars: Record<string, string>) {
  const body = Object.entries(vars)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${body}\n}\n`;
}

export function buildThemeCss(config: DesignSystemConfig) {
  const { light, dark } = buildThemeVars(config);
  const root = `:root[${DESIGN_SYSTEM_ATTRIBUTE}]`;
  // `${root} .dark` covers popups the inverted menu color marks `.dark`.
  return cssRule(root, light) + cssRule(`${root}.dark, ${root} .dark`, dark);
}

/** How long a stored choice applies: older entries are dropped on load. */
export const STORAGE_TTL_MS = 2 * 24 * 60 * 60 * 1000;

/** What localStorage holds: the config plus its CSS, so the pre-paint script
 * can apply it without shipping the theme table, and when it was saved. */
export type StoredDesignSystem = {
  config: DesignSystemConfig;
  css: string;
  savedAt: number;
};

function isFresh(savedAt: unknown, now: number) {
  return (
    typeof savedAt === 'number' &&
    now - savedAt >= 0 &&
    now - savedAt <= STORAGE_TTL_MS
  );
}

/** The stored config, or the default when nothing valid is stored. An entry
 * older than STORAGE_TTL_MS or without `savedAt` is removed. */
export function readStoredConfig(raw: string | null): DesignSystemConfig {
  if (!raw) return DEFAULT_CONFIG;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredDesignSystem>;
    if (!isFresh(parsed.savedAt, Date.now())) {
      localStorage.removeItem(STORAGE_KEY);
      return DEFAULT_CONFIG;
    }
    return normalizeConfig(parsed.config ?? {});
  } catch {
    return DEFAULT_CONFIG;
  }
}

/** Inline script for app/layout.tsx: applies the saved style class, theme tokens,
 * fonts and menu attributes before first paint, or the default when nothing fresh is
 * stored (a stale entry is removed). React never renders these, so hydration does not
 * mismatch. */
export const designSystemScript = `(function(){var d=document.documentElement,s=null;try{localStorage.removeItem("st-theme");s=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"null");var a=s&&s.savedAt,n=Date.now();if(s&&(typeof a!=="number"||n-a<0||n-a>${STORAGE_TTL_MS})){localStorage.removeItem(${JSON.stringify(STORAGE_KEY)});s=null}}catch(e){s=null}var c=s&&s.config,style=c&&c.style,css=s&&s.css;if(typeof style!=="string"||typeof css!=="string"){c=${JSON.stringify({ menuColor: DEFAULT_CONFIG.menuColor, menuAccent: DEFAULT_CONFIG.menuAccent })};style=${JSON.stringify(DEFAULT_CONFIG.style)};css=${JSON.stringify(buildThemeCss(DEFAULT_CONFIG))}}d.classList.add("style-"+style);d.setAttribute(${JSON.stringify(DESIGN_SYSTEM_ATTRIBUTE)},"");d.setAttribute("data-menu-color",String(c.menuColor||${JSON.stringify(DEFAULT_CONFIG.menuColor)}));d.setAttribute("data-menu-accent",String(c.menuAccent||${JSON.stringify(DEFAULT_CONFIG.menuAccent)}));var el=document.createElement("style");el.id=${JSON.stringify(THEME_STYLE_ELEMENT_ID)};el.textContent=css;document.head.appendChild(el)})()`;

/** Curated codes create's Shuffle picks from (apps/v4 app/(app)/(create)/lib/shuffle-presets.ts). */
const SHUFFLE_PRESETS = [
  'b6sUj34d9',
  'b2tqYzpa88',
  'b1W4tDrk',
  'b1aIuQ2XC',
  'b7jsW1RxJ5',
  'b870VEw0in',
  'b3Zheoix4U',
  'b1x9M2c4aI',
  'b1W7jDEW',
  'b51GFh7y6',
  'b2fms620zo',
  'b1Q5GC',
  'buKEvLs',
  'b5rR41Mtnc',
  'b6tOz2I0x',
  'b2hNTREGRN',
  'bdIJ7Sq',
  'b6TqMNb5Wb',
  'bJIirQ',
  'b4aRK5K0fb',
  'b5HCiD38LI',
  'bdHjvCi',
  'b7QDHijUjj',
  'b4ZVZIPi9h',
  'b1W4bcno',
];

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** One of the curated codes above as a normalized config (every one is a V2 code
 * and carries its chartColor). */
function curatedPreset(code: string): DesignSystemConfig {
  const decoded = decodePreset(code);
  if (!decoded) return DEFAULT_CONFIG;
  return normalizeConfig({ ...decoded, colorPreset: 'none' });
}

/** The fields a shuffle must change for the look to count as new. */
const LOOK_FIELDS = [
  'style',
  'baseColor',
  'theme',
  'chartColor',
  'iconLibrary',
  'font',
  'fontHeading',
  'radius',
  'menuAccent',
  'menuColor',
] as const;

function sameLook(a: DesignSystemConfig, b: DesignSystemConfig) {
  return LOOK_FIELDS.every((field) => a[field] === b[field]);
}

/** A random look: half the time one of create's curated presets, otherwise every field
 * picked on its own (style, colors, fonts, radius, menus), so shuffles rarely repeat.
 * The color preset is always re-rolled, and is "none" a fifth of the time so the base
 * color and theme pairs show up too. */
export function shuffleConfig(current: DesignSystemConfig): DesignSystemConfig {
  for (let attempt = 0; attempt < 10; attempt++) {
    const next =
      Math.random() < 0.5
        ? curatedPreset(randomItem(SHUFFLE_PRESETS))
        : randomFields();
    // Random does not change the icon library (spec 14): the curated presets
    // name one of their own, randomFields the default.
    const shuffled = {
      ...next,
      iconLibrary: current.iconLibrary,
      colorPreset: randomColorPreset(current.colorPreset),
    };
    if (!sameLook(shuffled, current)) return shuffled;
  }
  return { ...current, colorPreset: randomColorPreset(current.colorPreset) };
}

/** Every field picked independently, then cleaned up by create's cross-field rules. */
function randomFields(): DesignSystemConfig {
  const baseColor = randomItem(BASE_COLORS).name;
  const themes = getThemesForBaseColor(baseColor).map((t) => t.name);
  const font = randomItem(FONTS).value;
  return normalizeConfig({
    style: randomItem(STYLES).name,
    baseColor,
    theme: randomItem(themes),
    chartColor: randomItem(themes),
    font,
    fontHeading: Math.random() < 0.5 ? 'inherit' : randomItem(FONTS).value,
    radius: randomItem(RADII).name,
    menuAccent: randomItem(MENU_ACCENTS).value,
    menuColor: randomItem(MENU_COLORS).value,
    iconLibrary: DEFAULT_CONFIG.iconLibrary,
  });
}

/** A random color preset other than the current one, or "none" a fifth of the time. */
export function randomColorPreset(current: string) {
  if (current !== 'none' && Math.random() < 0.2) return 'none';
  return randomItem(COLOR_PRESETS.filter((p) => p.name !== current)).name;
}
