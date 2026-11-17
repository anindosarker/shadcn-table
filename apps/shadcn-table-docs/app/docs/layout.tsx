import { sidebarTree } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { SidebarSection } from '@/components/sidebar-section';
import { SidebarSeparator } from '@/components/sidebar-separator';
import { SidebarItem } from '@/components/sidebar-item';
import { SidebarResizeHandle } from '@/components/sidebar-resize-handle';
import { SiteNav } from '@/components/site-nav';
import { IconLibraryProvider } from '@/components/icon-library-selector';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const { nav, ...base } = baseOptions();

  // The Radix TooltipProvider the examples need sits in app/layout.tsx, so
  // the home page's example panels are covered as well.
  return (
    <DocsLayout
      {...base}
      nav={{ ...nav, mode: 'top' }}
      tabs={false}
      // the landing page's top bar (components/site-nav.tsx)
      slots={{ ...base.slots, header: SiteNav }}
      tree={sidebarTree()}
      sidebar={{
        // the header's SidebarCollapseButton toggles it (Cmd/Ctrl+B too)
        collapsible: true,
        // the resize handle positions itself on the sidebar's end edge; as a
        // component it replaces fumadocs' padded banner box, which would
        // leave an empty gap above the first group
        banner: SidebarResizeHandle,
        components: {
          Folder: SidebarSection,
          Separator: SidebarSeparator,
          Item: SidebarItem,
        },
      }}
    >
      {/* The install commands of a page share one icon library pick. */}
      <IconLibraryProvider>{children}</IconLibraryProvider>
    </DocsLayout>
  );
}
