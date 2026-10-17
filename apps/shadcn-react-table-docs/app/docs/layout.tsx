import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { getDocsTabs } from '@/lib/docs-tabs';
import { SidebarSection } from '@/components/sidebar-section';
import { SidebarSeparator } from '@/components/sidebar-separator';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const tree = source.getPageTree();
  const { nav, ...base } = baseOptions();

  return (
    <DocsLayout
      {...base}
      nav={{ ...nav, mode: 'top' }}
      tabMode="navbar"
      tabs={getDocsTabs(tree)}
      tree={tree}
      sidebar={{
        collapsible: false,
        components: { Folder: SidebarSection, Separator: SidebarSeparator },
      }}
    >
      {children}
    </DocsLayout>
  );
}
