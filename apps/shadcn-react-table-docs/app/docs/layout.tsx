import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { SidebarSection } from '@/components/sidebar-section';
import { SidebarSeparator } from '@/components/sidebar-separator';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const { nav, ...base } = baseOptions();

  // The Radix TooltipProvider the examples need sits in app/layout.tsx, so
  // the home page's example panels are covered as well.
  return (
    <DocsLayout
      {...base}
      nav={{ ...nav, mode: 'top' }}
      tabs={false}
      tree={source.getPageTree()}
      sidebar={{
        collapsible: false,
        components: { Folder: SidebarSection, Separator: SidebarSeparator },
      }}
    >
      {children}
    </DocsLayout>
  );
}
