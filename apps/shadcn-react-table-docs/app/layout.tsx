import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import {
  DEFAULT_THEME,
  THEME_PRESETS,
  THEME_STORAGE_KEY,
} from '@/lib/theme-presets';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

/**
 * Applies the saved theme preset (`data-theme` on <html>) before first paint.
 * React never renders the attribute, so there is nothing to mismatch on hydration.
 */
const themePresetScript = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}d.setAttribute('data-theme',${JSON.stringify(THEME_PRESETS.map((p) => p.name))}.indexOf(t)===-1?${JSON.stringify(DEFAULT_THEME)}:t)})()`;

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter.className}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: themePresetScript }} />
        <RootProvider theme={{ defaultTheme: 'dark' }}>{children}</RootProvider>
      </body>
    </html>
  );
}
