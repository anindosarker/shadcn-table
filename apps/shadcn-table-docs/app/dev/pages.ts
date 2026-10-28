/** Every review page under /dev, grouped. The /dev index and the dev bar
 * (prev, next, back to index) both read this list, so a new page is one
 * entry here. */
export interface DevPage {
  href: string;
  name: string;
  description: string;
}

export interface DevGroup {
  title: string;
  pages: readonly DevPage[];
}

export const DEV_GROUPS: readonly DevGroup[] = [
  {
    title: 'Theme demo',
    pages: [
      {
        href: '/dev/theme/1',
        name: 'Terminal',
        description:
          'A terminal types the install and a globals.css block whose values swap per theme; the table follows.',
      },
      {
        href: '/dev/theme/2',
        name: 'Stage',
        description:
          'Theme chips above one large table that crossfades on change; a caption names theme, font and radius.',
      },
      {
        href: '/dev/theme/3',
        name: 'Tokens',
        description:
          'The current theme as a token list beside the table; changed tokens flash.',
      },
      {
        href: '/dev/theme/4',
        name: 'Grid',
        description:
          'Three compact tables in three themes at once, no autoplay.',
      },
      {
        href: '/dev/theme/5',
        name: 'Matches',
        description:
          'Rotating headline word drives a mock app whose stock parts and table repaint together; ends on pasting your own theme.',
      },
      {
        href: '/dev/theme/6',
        name: 'Empty diff',
        description:
          'globals.css diff animates while the table file stays at 0 changes, beside the live app.',
      },
      {
        href: '/dev/theme/8',
        name: 'Prompt diff',
        description:
          'Empty diff plus a Prompt tab where an AI restyles the app, a plain-words visual diff and a readable status line.',
      },
      {
        href: '/dev/theme/7',
        name: 'No step 3',
        description:
          'Terminal: install, then git diff prints nothing; the table follows the site theme picker.',
      },
    ],
  },
];

export const DEV_PAGES: readonly DevPage[] = DEV_GROUPS.flatMap((g) => g.pages);
