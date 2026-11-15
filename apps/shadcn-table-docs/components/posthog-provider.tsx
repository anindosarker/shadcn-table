'use client';

import { useEffect, type ReactNode } from 'react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { useBase } from '@/components/base-selector';
import { trackSearchUsed } from '@/lib/analytics';
import { register, schedule } from '@/lib/posthog-client';

/**
 * PostHog for the docs app, mounted inside fumadocs' RootProvider
 * (app/layout.tsx). It renders its children and keeps posthog-js out of the
 * first script load: on mount it schedules the load in lib/posthog-client.ts,
 * which fetches posthog-js on the first idle moment or interaction and replays
 * what was raised before. Without `NEXT_PUBLIC_POSTHOG_KEY` nothing loads. The
 * selected base is a super property, so every report can break down by base.
 * fumadocs exposes the search dialog's open state through its context, which
 * is where `search_used` comes from.
 */
export const PostHogProvider = ({ children }: { children: ReactNode }) => {
  const base = useBase();
  const { open: searchOpen } = useSearchContext();

  useEffect(() => {
    schedule();
  }, []);

  useEffect(() => {
    register({ base });
  }, [base]);

  useEffect(() => {
    if (searchOpen) trackSearchUsed();
  }, [searchOpen]);

  return children;
};
