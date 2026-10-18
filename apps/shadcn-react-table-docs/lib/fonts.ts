import { Archivo } from 'next/font/google';

/**
 * Display face shared with the landing page: Archivo, variable on weight and
 * width. Loaded on <html> (app/layout.tsx); the docs headings read it through
 * --font-display (app/global.css).
 */
export const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
});
