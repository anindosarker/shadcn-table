import {
  JetBrains_Mono,
  Source_Serif_4,
  Space_Grotesk,
} from 'next/font/google';

/**
 * Demo theme faces, imported only by components/theme-demo, so they never
 * load from the root layout. Not preloaded: on the homepage the demo mounts
 * below the fold, and a face downloads only once a theme uses it. The themes
 * read `style.fontFamily` (the literal family name), not a CSS variable:
 * portalled menus render under <body>, outside any element a variable class
 * could sit on, and a family name resolves anywhere once its @font-face is
 * loaded.
 */
export const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});
