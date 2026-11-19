import { createElement } from 'react';
import { Button } from 'storybook/internal/components';
import { addons, types } from 'storybook/manager-api';
import { ST_VERSION } from './themes';

const ADDON_ID = 'shadcn-table/version';

/** The GitHub releases page, the target of the docs header label (D147). */
const RELEASES_URL = 'https://github.com/anindosarker/shadcn-table/releases';

/**
 * Library version, `v<version>` (D150): Storybook's own ghost toolbar button
 * as a link to the GitHub releases, opened in a new tab like the toolbar's
 * isolation mode. Registered after the base switch (manager.ts), so it sits
 * right after it.
 */
function VersionTool() {
  return createElement(
    Button,
    {
      asChild: true,
      // the text names the link, as on Storybook's own text links
      ariaLabel: false,
      variant: 'ghost',
      size: 'small',
      padding: 'small',
    },
    createElement(
      'a',
      { href: RELEASES_URL, target: '_blank', rel: 'noopener noreferrer' },
      `v${ST_VERSION}`,
    ),
  );
}

addons.register(ADDON_ID, () => {
  addons.add(`${ADDON_ID}/tool`, {
    type: types.TOOL,
    title: 'Version',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => createElement(VersionTool),
  });
});
