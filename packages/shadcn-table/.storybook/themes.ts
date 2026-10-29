import { themes, type ThemeVars } from 'storybook/theming';
import {
  BASE_LABELS,
  BASE_PORTS,
  BASES,
  resolveBase,
  type Base,
} from '../scripts/registry/bases.mjs';

/**
 * Every base and its label (scripts/registry/bases.mjs), in reader
 * order (Base UI, Radix UI, React Aria). Static builds sit side by side
 * under storybook-static/<base>/ (`storybook:build:base`,
 * `storybook:build:radix`, `storybook:build:aria`); no
 * base lives at the root, which redirects to DEFAULT_BASE in
 * production (vercel.json).
 */
export { BASE_LABELS, BASE_PORTS, BASES, type Base };

/**
 * The base this Storybook was built for, set on the window by main.ts
 * (`managerHead` / `previewHead`) from ST_BASE. The default base when unset.
 */
export const ST_BASE: Base = resolveBase(
  (globalThis as { __ST_BASE__?: string }).__ST_BASE__,
);

export const ST_BASE_LABEL = BASE_LABELS[ST_BASE];

/** The other bases, the ones the preview banner links to. */
export const ST_OTHER_BASES = BASES.filter((base) => base !== ST_BASE);

/**
 * Relative URL of another base's static build from this one: every
 * base is a sibling folder, so the link climbs one level.
 */
export function staticBaseRoot(target: Base) {
  return `../${target}/`;
}

/**
 * Whether this manager runs under `storybook dev` (set by main.ts on the
 * window from the build's config type). Static builds leave it false.
 */
export const ST_DEV: boolean =
  (globalThis as { __ST_DEV__?: boolean }).__ST_DEV__ === true;

/** Manager title: "shadcn-table (Base UI)", "(Radix UI)" or "(React Aria)". */
const brandTitle = `shadcn-table (${ST_BASE_LABEL})`;

/**
 * Shared manager/docs themes. The dark surfaces match the shadcn `.dark`
 * `--background` (oklch(0.145 0 0) ~ #252525) so the manager chrome, the docs
 * page and the table all read as one surface, like material-react-table.dev.
 */
export const darkTheme: ThemeVars = {
  ...themes.dark,
  brandTitle,
  appBg: '#252525',
  appContentBg: '#252525',
  appPreviewBg: '#252525',
  barBg: '#252525',
};

export const lightTheme: ThemeVars = { ...themes.light, brandTitle };

/** localStorage key storybook-dark-mode persists the user's choice under. */
export const DARK_MODE_STORAGE_KEY = 'sb-addon-themes-3';

/**
 * Read the persisted storybook-dark-mode choice. Defaults to dark on a fresh
 * browser so the first paint is dark instead of following the OS scheme.
 */
export function readStoredMode(): 'dark' | 'light' {
  try {
    const raw = globalThis.localStorage?.getItem(DARK_MODE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { current?: string };
      if (parsed.current === 'light') return 'light';
    }
  } catch {
    // Ignore unreadable storage and fall through to the default.
  }
  return 'dark';
}
