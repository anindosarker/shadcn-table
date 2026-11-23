import type { PostHogConfig } from 'posthog-js';

/**
 * The posthog-js init options, reached only through the dynamic `import()` in
 * lib/posthog-client.ts, so they load beside posthog-js after hydration and
 * not in the first script load. posthog-js talks to the `/ingest` reverse
 * proxy (next.config.mjs). The dated defaults follow PostHog's Next.js install
 * guide; page views on history changes come from them. Autocapture stays off:
 * the custom events in lib/analytics.ts are the signal. Session replay follows
 * the PostHog project setting; nothing calls `identify`.
 */
export const initOptions: Partial<PostHogConfig> = {
  api_host: '/ingest',
  ui_host: 'https://us.posthog.com',
  defaults: '2026-08-30',
  capture_pageleave: true,
  person_profiles: 'identified_only',
  autocapture: false,
};
