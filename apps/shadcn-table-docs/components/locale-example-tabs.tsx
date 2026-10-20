'use client';

import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface LocaleExampleTabsProps {
  /** Locale codes in display order. */
  locales: string[];
  /** Rendered example wrapper per locale (server components are fine). */
  panels: Record<string, ReactNode>;
}

/**
 * Locale switcher for example-groups/LocaleExamples.tsx: one tab per locale,
 * `es` by default, `?locale=` read once the client is hydrated and kept in the URL
 * like MRT's LocaleExamples.
 */

//read-once store: `null` on the server and during hydration so both render the `es` tab
const subscribeToNothing = () => () => {};
const getUrlLocale = () =>
  new URLSearchParams(window.location.search).get('locale');
const getServerUrlLocale = () => null;
export function LocaleExampleTabs({ locales, panels }: LocaleExampleTabsProps) {
  const pathname = usePathname();
  const urlLocale = useSyncExternalStore(
    subscribeToNothing,
    getUrlLocale,
    getServerUrlLocale,
  );
  const [selectedLocale, setSelectedLocale] = useState<string | null>(null);
  const currentLocale =
    selectedLocale ?? (urlLocale && urlLocale in panels ? urlLocale : 'es');

  const setCurrentLocale = (locale: string) => {
    setSelectedLocale(locale);
    window.history.replaceState(null, '', `${pathname}?locale=${locale}`);
  };

  return (
    <Tabs
      value={currentLocale}
      onValueChange={setCurrentLocale}
      className="not-prose my-4 gap-4"
    >
      <div className="scrollbar-none overflow-x-auto overflow-y-hidden border-b">
        <TabsList variant="line" className="h-auto">
          {locales.map((locale) => (
            <TabsTrigger key={locale} value={locale} className="px-3 py-1.5">
              {locale}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value={currentLocale}>{panels[currentLocale]}</TabsContent>
    </Tabs>
  );
}
