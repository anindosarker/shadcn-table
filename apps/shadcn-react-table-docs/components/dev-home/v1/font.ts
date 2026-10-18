import { Archivo } from 'next/font/google';

/** Display face for the Orbit wordmark: Archivo with its width axis, set wide. */
export const orbitDisplay = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--o1-font-display',
  display: 'swap',
});
