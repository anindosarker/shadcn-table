'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ExternalLinkIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface ExampleTab {
  label: string;
  /** Example page slug under /docs/examples; also the panel key. */
  value: string;
}

export interface ExampleLink {
  label: string;
  href: string;
}

export interface ExampleTabsProps {
  /** Tabs that switch between the panels, in order. */
  tabs: Array<ExampleTab>;
  /** Trailing tabs that navigate to another page (MRT's "more" tabs). */
  links?: Array<ExampleLink>;
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
  links = [],
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
        <TabsList className="w-full justify-start overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
          {links.map((link) => (
            <TabsTrigger key={link.href} value={`link:${link.href}`} asChild>
              <Link href={link.href}>
                {link.label}
                <ExternalLinkIcon className="size-3.5" />
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div>{panels[value]}</div>
    </div>
  );
};
