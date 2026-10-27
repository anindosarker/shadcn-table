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
    ],
  },
];

export const DEV_PAGES: readonly DevPage[] = DEV_GROUPS.flatMap((g) => g.pages);
