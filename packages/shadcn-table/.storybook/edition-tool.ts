import { createElement } from 'react';
import { Select } from 'storybook/internal/components';
import { addons, types, useStorybookState } from 'storybook/manager-api';
import {
  EDITION_LABELS,
  EDITION_PORTS,
  EDITIONS,
  ST_BASE,
  ST_DEV,
  staticEditionRoot,
  type Edition,
} from './themes';

const ADDON_ID = 'shadcn-table/edition';

/**
 * Another edition's URL for the same story. Static builds sit side by side
 * under <edition>/, so the link is relative; `storybook dev` serves each
 * edition on its own port (EDITION_PORTS, the package.json
 * `storybook:<edition>` scripts), so the link swaps the port.
 * `path` is the manager's `?path=` value, which Storybook does not encode.
 */
export function editionHref(
  target: Edition,
  path: string,
  location: Location = window.location,
) {
  const query = `?path=${path}`;
  if (!ST_DEV) return `${staticEditionRoot(target)}${query}`;
  return `${location.protocol}//${location.hostname}:${EDITION_PORTS[target]}/${query}`;
}

const OPTIONS = EDITIONS.map((edition) => ({
  value: edition,
  title: EDITION_LABELS[edition],
}));

/**
 * Edition switch: Storybook's own toolbar Select (the one behind the
 * viewport and background pickers), the current edition preselected.
 * Choosing another edition opens the same story in that edition's
 * Storybook, in the top frame.
 */
function EditionTool() {
  const { path } = useStorybookState();
  return createElement(Select, {
    ariaLabel: 'Edition',
    size: 'small',
    options: OPTIONS,
    defaultOptions: ST_BASE,
    onSelect: (value) => {
      const target = EDITIONS.find((edition) => edition === value);
      if (!target || target === ST_BASE) return;
      (window.top ?? window).location.assign(editionHref(target, path));
    },
  });
}

addons.register(ADDON_ID, () => {
  addons.add(`${ADDON_ID}/tool`, {
    type: types.TOOL,
    title: 'Edition',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => createElement(EditionTool),
  });
});
