'use client';

import { useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui-radix/tabs';

export interface ExampleTab {
  label: string;
  /** Example page slug under /docs/examples; also the panel key. */
  value: string;
}

export interface ExampleTabsProps {
  /** Tabs that switch between the panels, in order. */
  tabs: Array<ExampleTab>;
  /** Live example per tab value, rendered on the server. */
  panels: Record<string, ReactNode>;
  /**
   * On an example page the active tab follows the route and switching tabs
   * navigates; elsewhere (guides) the tabs are local state.
   */
  isPage?: boolean;
  defaultValue?: string;
}

/**
 * Example group tab strip shared by example-groups/*. Mirrors MRT's
 * `<Tabs>` groups: tab values are example page slugs.
 */
export const ExampleTabs = ({
  tabs,
  panels,
  isPage = false,
  defaultValue,
}: ExampleTabsProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(defaultValue ?? tabs[0]?.value);
  const routeTab = pathname.split('/').pop() ?? '';
  const value = isPage ? routeTab : activeTab;

  return (
    <div className="not-prose flex flex-col gap-2">
      <Tabs
        value={value}
        onValueChange={(next) =>
          isPage ? router.push(`/docs/examples/${next}`) : setActiveTab(next)
        }
      >
        <TabsList
          variant="line"
          className="h-auto w-full flex-wrap justify-start gap-x-1 gap-y-1 border-b border-border p-0 pb-1"
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-8 flex-none px-3"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div>{panels[value]}</div>
    </div>
  );
};
