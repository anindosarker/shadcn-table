import { themes, type ThemeVars } from 'storybook/theming';
import {
  EDITION_LABELS,
  EDITIONS,
  resolveEdition,
  type Edition,
} from '../scripts/registry/editions.mjs';

/**
 * Every edition and its label (scripts/registry/editions.mjs), in the order
 * of the `storybook dev` ports in package.json (6006, 6007, 6008). Static
 * builds sit side by side under storybook-static/<edition>/
 * (`storybook:build`, `storybook:build:base`, `storybook:build:aria`); no
 * edition lives at the root, which redirects to DEFAULT_EDITION in
 * production (vercel.json).
 */
export { EDITION_LABELS, EDITIONS, type Edition };

/**
 * The edition this Storybook was built for, set on the window by main.ts
 * (`managerHead` / `previewHead`) from ST_BASE. The reference when unset.
 */
export const ST_BASE: Edition = resolveEdition(
  (globalThis as { __ST_BASE__?: string }).__ST_BASE__,
);

export const ST_BASE_LABEL = EDITION_LABELS[ST_BASE];

/** The other editions, the ones the manager's edition buttons open. */
export const ST_OTHER_EDITIONS = EDITIONS.filter(
  (edition) => edition !== ST_BASE,
);

/**
 * Relative URL of another edition's static build from this one: every
 * edition is a sibling folder, so the link climbs one level.
 */
export function staticEditionRoot(target: Edition) {
  return `../${target}/`;
}

/**
 * Whether this manager runs under `storybook dev` (set by main.ts on the
 * window from the build's config type). Static builds leave it false.
 */
export const ST_DEV: boolean =
  (globalThis as { __ST_DEV__?: boolean }).__ST_DEV__ === true;

/** Manager title: "shadcn-table (Radix UI)", "(Base UI)" or "(React Aria)". */
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
