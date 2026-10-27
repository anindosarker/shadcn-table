import {
  JetBrains_Mono,
  Source_Serif_4,
  Space_Grotesk,
} from 'next/font/google';

/**
 * Demo theme faces, imported only by components/theme-demo, so they load on
 * the /dev/theme routes and never from the root layout. The themes read
 * `style.fontFamily` (the literal family name), not a CSS variable: portalled
 * menus render under <body>, outside any element a variable class could sit
 * on, and a family name resolves anywhere once its @font-face is loaded.
 */
export const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});
