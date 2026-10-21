import type { Metadata, Viewport } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { TooltipProvider } from '@/components/ui-radix/tooltip';
import { PostHogProvider } from '@/components/posthog-provider';
import './global.css';
import { Inter } from 'next/font/google';
import { archivo } from '@/lib/fonts';
import {
  DEFAULT_THEME,
  RANDOMIZE_DEFAULT_THEME,
  THEME_PRESETS,
  THEME_STORAGE_KEY,
} from '@/lib/theme-presets';
import { siteName, siteUrl } from '@/lib/shared';

export const metadata: Metadata = {
  title: { default: siteName, template: `%s | ${siteName}` },
  description:
    'A production-ready table library built with TanStack Table and shadcn/ui. Sorting, filtering, grouping, pinning, virtualization, and more, all built in.',
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  openGraph: { siteName, type: 'website' },
  twitter: { card: 'summary_large_image' },
};

/** Dark is the default theme. */
export const viewport: Viewport = {
  themeColor: '#000000',
};

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
        {/* ST sub-components (ST_TopToolbar, ST_ToggleFiltersButton, row
            drag handles, ...) and the example playground render Radix
            tooltips, which throw without a provider. <ShadcnTable>
            mounts its own; standalone compositions (custom-headless,
            external-toolbar, row ordering) and the home page examples need
            this one. */}
        <RootProvider theme={{ defaultTheme: 'dark', enableSystem: false }}>
          {/* Analytics (components/posthog-provider.tsx); a no-op without
              NEXT_PUBLIC_POSTHOG_KEY. */}
          <PostHogProvider>
            <TooltipProvider skipDelayDuration={0}>{children}</TooltipProvider>
          </PostHogProvider>
        </RootProvider>
      </body>
    </html>
  );
}
