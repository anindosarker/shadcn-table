'use client';

import { useEffect, useRef } from 'react';
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import {
  SidebarCollapseTrigger,
  useSidebar,
} from 'fumadocs-ui/components/sidebar/base';
import { SIDEBAR_COLLAPSED_KEY } from '@/lib/sidebar-state';

/**
 * Tab row button (components/section-tabs.tsx, desktop only) that hides and restores the desktop sidebar: fumadocs'
 * SidebarCollapseTrigger (the notebook layout only renders its own in nav
 * mode "auto"; this app uses "top"). fumadocs keeps `collapsed` in React
 * state, so it survives client navigation; this adds localStorage for
 * reloads. `data-sidebar-collapsed` on <html> (set early by the layout's
 * inline script) holds the collapsed layout until the state takes over.
 */
export function SidebarCollapseButton() {
  const { collapsed, setCollapsed } = useSidebar();
  const restored = useRef(false);

  useEffect(() => {
    if (!restored.current) {
      restored.current = true;
      if (readCollapsed() && !collapsed) {
        setCollapsed(true);
        return;
      }
    }
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0');
    } catch {}
    document.documentElement.toggleAttribute(
      'data-sidebar-collapsed',
      !!collapsed,
    );
  }, [collapsed, setCollapsed]);

  return (
    <SidebarCollapseTrigger
      aria-label={collapsed ? 'Show sidebar' : 'Hide sidebar'}
      title={collapsed ? 'Show sidebar' : 'Hide sidebar'}
      className="inline-grid size-8 place-items-center rounded-md text-fd-muted-foreground transition-colors hover:bg-(--docs-surface) hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-(--docs-accent) [&_svg]:size-3.5"
    >
      {/* the arrow shows where the sidebar goes */}
      {collapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
    </SidebarCollapseTrigger>
  );
}

function readCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';
  } catch {
    return false;
  }
}
