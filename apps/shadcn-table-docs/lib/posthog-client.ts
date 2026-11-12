import type { PostHog } from 'posthog-js';

/**
 * Loads posthog-js after hydration and queues what is raised before it
 * arrives. Nothing here imports posthog-js statically, so the library stays
 * out of every page's first script load: `schedule()` fetches it on the first
 * idle moment or the first pointerdown, keydown or scroll, whichever comes
 * first, and initialises it with lib/posthog-options.ts. Calls to
 * `capture()` and `register()` made before then wait in a queue and are
 * replayed in order once the client is ready. Without
 * `NEXT_PUBLIC_POSTHOG_KEY` nothing loads and nothing is queued.
 */

/** Project key; unset locally and in previews without the Vercel env. */
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/** The longest wait for an idle moment before loading anyway. */
const IDLE_TIMEOUT_MS = 3000;

const INTERACTIONS = ['pointerdown', 'keydown', 'scroll'] as const;

type Pending = (client: PostHog) => void;

let client: PostHog | undefined;
let scheduled = false;
const queue: Pending[] = [];

const load = async () => {
  if (!POSTHOG_KEY) return;
  const [{ default: posthog }, { initOptions }] = await Promise.all([
    import('posthog-js'),
    import('./posthog-options'),
  ]);
  if (!posthog.__loaded) posthog.init(POSTHOG_KEY, initOptions);
  client = posthog;
  for (const call of queue.splice(0)) call(posthog);
};

const run = (call: Pending) => {
  if (!POSTHOG_KEY) return;
  if (client) call(client);
  else queue.push(call);
};

/** Start loading posthog-js on the first idle moment or interaction. */
export const schedule = () => {
  if (!POSTHOG_KEY || scheduled || typeof window === 'undefined') return;
  scheduled = true;

  let idleHandle: number | undefined;
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const fire = () => {
    for (const type of INTERACTIONS) window.removeEventListener(type, fire);
    if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
    if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
    void load();
  };

  for (const type of INTERACTIONS)
    window.addEventListener(type, fire, { once: true, passive: true });
  if (typeof window.requestIdleCallback === 'function')
    idleHandle = window.requestIdleCallback(fire, { timeout: IDLE_TIMEOUT_MS });
  else timeoutHandle = setTimeout(fire, 1);
};

/** Send an event now, or once posthog-js has loaded. */
export const capture = (event: string, properties?: Record<string, string>) =>
  run((posthog) => posthog.capture(event, properties));

/** Set super properties now, or once posthog-js has loaded. */
export const register = (properties: Record<string, string>) =>
  run((posthog) => posthog.register(properties));
