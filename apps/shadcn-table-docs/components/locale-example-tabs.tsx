'use client';

import { useEffect, useState, type ReactNode } from 'react';
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
 * `es` by default, `?locale=` read after mount and kept in the URL like MRT's
 * LocaleExamples.
 */
export function LocaleExampleTabs({ locales, panels }: LocaleExampleTabsProps) {
  const pathname = usePathname();
  const [currentLocale, _setCurrentLocale] = useState('es');

  //read ?locale= after mount so the server and client render the same tab
  useEffect(() => {
    const locale = new URLSearchParams(window.location.search).get('locale');
    _setCurrentLocale(locale && locale in panels ? locale : 'es');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCurrentLocale = (locale: string) => {
    _setCurrentLocale(locale);
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
