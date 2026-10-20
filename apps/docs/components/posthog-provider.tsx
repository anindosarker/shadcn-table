'use client';

import { useEffect, type ReactNode } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PostHogClientProvider } from 'posthog-js/react';
import { useBase } from '@/components/base-selector';

/** Project key; unset locally and in previews without the Vercel env. */
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * PostHog for the docs app, mounted inside fumadocs' RootProvider
 * (app/layout.tsx). Without `NEXT_PUBLIC_POSTHOG_KEY` it renders its children
 * and loads nothing. With the key it initialises posthog-js once against the
 * `/ingest` reverse proxy (next.config.mjs), with automatic page views on
 * history changes and no autocapture: the custom events in lib/analytics.ts
 * are the signal. The selected base is a super property, so every report can
 * break down by base. Nothing calls `identify`.
 */
export const PostHogProvider = ({ children }: { children: ReactNode }) => {
  const base = useBase();

  useEffect(() => {
    if (!POSTHOG_KEY || posthog.__loaded) return;
    posthog.init(POSTHOG_KEY, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      capture_pageview: 'history_change',
      capture_pageleave: true,
      person_profiles: 'identified_only',
      autocapture: false,
    });
  }, []);

  useEffect(() => {
    if (POSTHOG_KEY) posthog.register({ base });
  }, [base]);

  if (!POSTHOG_KEY) return children;
  return (
    <PostHogClientProvider client={posthog}>{children}</PostHogClientProvider>
  );
};
