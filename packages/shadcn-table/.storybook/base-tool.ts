import { ChevronSmallDownIcon } from '@storybook/icons';
import { createElement } from 'react';
import { Select } from 'storybook/internal/components';
import { addons, types, useStorybookState } from 'storybook/manager-api';
import {
  BASE_LABELS,
  BASE_PORTS,
  BASES,
  ST_BASE,
  ST_DEV,
  staticBaseRoot,
  type Base,
} from './themes';

const ADDON_ID = 'shadcn-table/base';

/**
 * Another base's URL for the same story. Static builds sit side by side under
 * <base>/, so the link is relative; `storybook dev` serves each base on its own
 * port (BASE_PORTS, the package.json `storybook:<base>` scripts), so the link
 * swaps the port. `path` is the manager's `?path=` value, which Storybook does
 * not encode.
 */
export function baseHref(
  target: Base,
  path: string,
  location: Location = window.location,
) {
  const query = `?path=${path}`;
  if (!ST_DEV) return `${staticBaseRoot(target)}${query}`;
  return `${location.protocol}//${location.hostname}:${BASE_PORTS[target]}/${query}`;
}

const OPTIONS = BASES.map((base) => ({
  value: base,
  title: BASE_LABELS[base],
}));

/**
 * Base switch: Storybook's own toolbar Select (the one behind the viewport and
 * background pickers), the current base preselected; a chevron leads the label,
 * since Storybook's Select draws none. Choosing another base opens the same
 * story in that base's Storybook, in the top frame.
 */
function BaseTool() {
  const { path } = useStorybookState();
  return createElement(Select, {
    icon: createElement(ChevronSmallDownIcon),
    ariaLabel: 'Base',
    size: 'small',
    options: OPTIONS,
    defaultOptions: ST_BASE,
    onSelect: (value) => {
      const target = BASES.find((base) => base === value);
      if (!target || target === ST_BASE) return;
      (window.top ?? window).location.assign(baseHref(target, path));
    },
  });
}

addons.register(ADDON_ID, () => {
  addons.add(`${ADDON_ID}/tool`, {
    type: types.TOOL,
    title: 'Base',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => createElement(BaseTool),
  });
});
