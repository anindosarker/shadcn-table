'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  links: {
    value: string;
    label: string;
  }[];
}

/**
 * MRT's OptionsSwitcher: a tab strip over sibling API pages. The active tab is
 * the current route's last segment; switching navigates to the sibling page.
 */
const OptionsSwitcher = ({ links }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const value = pathname.split('/').pop() ?? '';

  return (
    <div className="not-prose border-b">
      <Tabs
        value={value}
        onValueChange={(next) => router.push(pathname.replace(/[^/]+$/, next))}
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          {links.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default OptionsSwitcher;
