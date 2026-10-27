import { Archivo } from 'next/font/google';

/**
 * Variant 4 display face: Archivo, variable on weight and width, so the
 * headlines can run heavy (800) and condensed (wdth 62..75). Roman only.
 */
export const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--v4-font-display',
});
