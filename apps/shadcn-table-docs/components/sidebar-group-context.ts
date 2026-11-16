'use client';

import { createContext } from 'react';

/**
 * True inside a separator group's own element (components/sidebar-separator.tsx,
 * components/sidebar-subgroup.tsx). A page that belongs to a group renders
 * only there (components/sidebar-item.tsx), not again in the flat list
 * fumadocs renders, so each group is one element and its sticky label stops
 * at the group's end.
 */
export const SidebarGroupContext = createContext(false);
