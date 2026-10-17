import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { SidebarSection } from '@/components/sidebar-section';
import { SidebarSeparator } from '@/components/sidebar-separator';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const { nav, ...base } = baseOptions();

  // SRT sub-components (SRT_TopToolbar, SRT_ToggleFiltersButton, row drag
  // handles, ...) render Radix tooltips, which throw without a provider.
  // <ShadcnReactTable> mounts its own; examples that compose sub-components
  // standalone (custom-headless, external-toolbar, row ordering) need this one.
  return (
    <TooltipProvider skipDelayDuration={0}>
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
    </TooltipProvider>
  );
}
