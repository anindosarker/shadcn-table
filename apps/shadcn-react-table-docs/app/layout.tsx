import { RootProvider } from 'fumadocs-ui/provider/next';
import { TooltipProvider } from '@/components/ui/tooltip';
import './global.css';
import { Inter } from 'next/font/google';
import { archivo } from '@/lib/fonts';
import {
  DEFAULT_THEME,
  RANDOMIZE_DEFAULT_THEME,
  THEME_PRESETS,
  THEME_STORAGE_KEY,
} from '@/lib/theme-presets';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

/**
 * Applies the saved theme preset (`data-theme` on <html>) before first paint.
 * Without a saved pick it rolls a random preset (RANDOMIZE_DEFAULT_THEME), unsaved.
 * React never renders the attribute, so there is nothing to mismatch on hydration.
 */
const themePresetScript = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}var p=${JSON.stringify(THEME_PRESETS.map((p) => p.name))};if(p.indexOf(t)===-1)t=${RANDOMIZE_DEFAULT_THEME ? 'p[Math.floor(Math.random()*p.length)]' : JSON.stringify(DEFAULT_THEME)};d.setAttribute('data-theme',t)})()`;

/** Search-match highlight; see the note in app/global.css (Lightning CSS rejects ::highlight()). */
const searchHighlightStyle = `::highlight(fd-search){color:var(--color-fd-primary);text-decoration-line:underline}`;

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivo.variable} ${inter.className}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themePresetScript }} />
        <style dangerouslySetInnerHTML={{ __html: searchHighlightStyle }} />
        {/* SRT sub-components (SRT_TopToolbar, SRT_ToggleFiltersButton, row
            drag handles, ...) and the example playground render Radix
            tooltips, which throw without a provider. <ShadcnReactTable>
            mounts its own; standalone compositions (custom-headless,
            external-toolbar, row ordering) and the home page examples need
            this one. */}
        <RootProvider theme={{ defaultTheme: 'dark', enableSystem: false }}>
          <TooltipProvider skipDelayDuration={0}>{children}</TooltipProvider>
        </RootProvider>
      </body>
    </html>
  );
}
