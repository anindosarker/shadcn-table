import { createElement } from 'react';
import { IconButton } from 'storybook/internal/components';
import { addons, types, useStorybookState } from 'storybook/manager-api';
import { ST_BASE, ST_DEV, ST_OTHER_BASE_LABEL } from './themes';

const ADDON_ID = 'shadcn-table/edition';

/**
 * The other edition's URL for the same story. Static builds sit side by
 * side, the Base UI one under base/ (`storybook:build:base`), so the link is
 * relative; `storybook dev` serves the Radix UI edition one port below the
 * Base UI one (6006 and 6007 in package.json), so the link swaps the port.
 * `path` is the manager's `?path=` value, which Storybook does not encode.
 */
export function editionHref(
  path: string,
  location: Location = window.location,
) {
  const query = `?path=${path}`;
  if (!ST_DEV) return `${ST_BASE === 'base' ? '../' : './base/'}${query}`;
  const port = Number(location.port) + (ST_BASE === 'base' ? -1 : 1);
  return `${location.protocol}//${location.hostname}:${port}/${query}`;
}

function EditionTool() {
  const { path } = useStorybookState();
  return createElement(
    IconButton,
    { asChild: true, ariaLabel: false },
    createElement(
      'a',
      {
        href: editionHref(path),
        target: '_top',
        title: `Open this story in the ${ST_OTHER_BASE_LABEL} edition`,
        'data-edition-link': '',
      },
      ST_OTHER_BASE_LABEL,
    ),
  );
}

addons.register(ADDON_ID, () => {
  addons.add(`${ADDON_ID}/tool`, {
    type: types.TOOL,
    title: 'Edition',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => createElement(EditionTool),
  });
});
