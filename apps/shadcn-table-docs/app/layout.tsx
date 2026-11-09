import type { Metadata, Viewport } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { TooltipProvider } from '@/components/ui-radix/tooltip';
import { PostHogProvider } from '@/components/posthog-provider';
import { DesignSystemProvider } from '@/components/design-system-provider';
import { ExampleIcons } from '@/components/example-icons';
import { SearchDialog } from '@/components/search-dialog';
import './global.css';
import { Inter } from 'next/font/google';
import { archivo } from '@/lib/fonts';
import { designSystemScript } from '@/lib/design-system/config';
import { designSystemFontVariables } from '@/lib/design-system/fonts';
import { siteName, siteUrl } from '@/lib/shared';

export const metadata: Metadata = {
  title: { default: siteName, template: `%s | ${siteName}` },
  description:
    'A production-ready table library built with TanStack Table and shadcn/ui. Sorting, filtering, grouping, pinning, virtualization, and more, all built in.',
  metadataBase: new URL(siteUrl),
  // './' resolves per route against metadataBase: every page names its own
  // slash-less URL as canonical (D53).
  alternates: { canonical: './' },
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

/** Search-match highlight; see the note in app/global.css (Lightning CSS rejects ::highlight()). */
const searchHighlightStyle = `::highlight(fd-search){color:var(--color-fd-primary);text-decoration-line:underline}`;

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivo.variable} ${designSystemFontVariables}`}
      suppressHydrationWarning
    >
      <head>
        {/* The stored design system (or the default) before first paint,
            the active style's sheet included (D29): lib/design-system/config.ts,
            kept in sync by DesignSystemProvider. */}
        <script dangerouslySetInnerHTML={{ __html: designSystemScript }} />
      </head>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <style dangerouslySetInnerHTML={{ __html: searchHighlightStyle }} />
        {/* ST sub-components (ST_TopToolbar, ST_ToggleFiltersButton, row
            drag handles, ...) and the example playground render Radix
            tooltips, which throw without a provider. <ShadcnTable>
            mounts its own; standalone compositions (custom-headless,
            external-toolbar, row ordering) and the home page examples need
            this one. */}
        {/* The search dialog renders only in the browser:
            components/search-dialog.tsx. */}
        <RootProvider
          theme={{ defaultTheme: 'dark', enableSystem: false }}
          search={{ SearchDialog }}
        >
          {/* Analytics (components/posthog-provider.tsx); a no-op without
              NEXT_PUBLIC_POSTHOG_KEY. */}
          <PostHogProvider>
            <TooltipProvider skipDelayDuration={0}>
              <DesignSystemProvider>
                {/* The Icon Library pick for every example table, one
                    ST_DefaultsProvider per base copy
                    (components/example-icons.tsx). */}
                <ExampleIcons>{children}</ExampleIcons>
              </DesignSystemProvider>
            </TooltipProvider>
          </PostHogProvider>
        </RootProvider>
      </body>
    </html>
  );
}
