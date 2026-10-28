import { createElement, Fragment } from 'react';
import { IconButton } from 'storybook/internal/components';
import { addons, types, useStorybookState } from 'storybook/manager-api';
import {
  EDITION_LABELS,
  EDITIONS,
  ST_BASE,
  ST_DEV,
  staticEditionRoot,
  type Edition,
} from './themes';

const ADDON_ID = 'shadcn-table/edition';

/**
 * Another edition's URL for the same story. Static builds sit side by side
 * (radix at the root, the others under <edition>/), so the link is relative;
 * `storybook dev` serves the editions on consecutive ports in EDITIONS order
 * (6006, 6007 and 6008 in package.json), so the link shifts the port.
 * `path` is the manager's `?path=` value, which Storybook does not encode.
 */
export function editionHref(
  target: Edition,
  path: string,
  location: Location = window.location,
) {
  const query = `?path=${path}`;
  if (!ST_DEV) return `${staticEditionRoot(target)}${query}`;
  const port =
    Number(location.port) +
    EDITIONS.indexOf(target) -
    EDITIONS.indexOf(ST_BASE);
  return `${location.protocol}//${location.hostname}:${port}/${query}`;
}

/**
 * Three-way edition switch: the current edition marked active, the other two
 * linking to the same story in their own Storybook.
 */
function EditionTool() {
  const { path } = useStorybookState();
  return createElement(
    Fragment,
    null,
    ...EDITIONS.map((edition) =>
      edition === ST_BASE
        ? createElement(
            IconButton,
            {
              key: edition,
              active: true,
              ariaLabel: false,
              title: `This story in the ${EDITION_LABELS[edition]} edition`,
              'aria-current': 'page',
              'data-edition-current': '',
            },
            EDITION_LABELS[edition],
          )
        : createElement(
            IconButton,
            { key: edition, asChild: true, ariaLabel: false },
            createElement(
              'a',
              {
                href: editionHref(edition, path),
                target: '_top',
                title: `Open this story in the ${EDITION_LABELS[edition]} edition`,
                'data-edition-link': edition,
              },
              EDITION_LABELS[edition],
            ),
          ),
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
