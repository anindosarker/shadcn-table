'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckIcon, HandIcon, RotateCcwIcon } from 'lucide-react';
import type {
  SignalTableProps,
  SignalTableState,
} from '@/components/dev-home/v5/signal-table';

const SignalTable = dynamic(
  () => import('@/components/dev-home/v5/signal-table'),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        className="flex min-h-[26rem] items-center justify-center text-sm text-(--dh-ink-muted)"
      >
        Loading table
      </div>
    ),
  },
);

interface Step {
  /** Feature name for the status line. */
  feature: string;
  title: string;
  code: string;
  apply: (s: SignalTableState) => SignalTableState;
}

const BASE: SignalTableState = {
  sorting: [],
  columnFilters: [],
  columnPinning: { left: [], right: [] },
  grouping: [],
  expanded: {},
  showColumnFilters: false,
};

const STEPS: readonly Step[] = [
  {
    feature: 'Sorting',
    title: 'Sort by salary, highest first',
    code: "sorting: [{ id: 'salary', desc: true }]",
    apply: (s) => ({ ...s, sorting: [{ id: 'salary', desc: true }] }),
  },
  {
    feature: 'Filtering',
    title: 'Filter states starting with “New”',
    code: "columnFilters: [{ id: 'state', value: 'New' }]",
    apply: (s) => ({
      ...s,
      showColumnFilters: true,
      columnFilters: [{ id: 'state', value: 'New' }],
    }),
  },
  {
    feature: 'Pinning',
    title: 'Pin last name to the left',
    code: "columnPinning: { left: ['lastName'] }",
    apply: (s) => ({ ...s, columnPinning: { left: ['lastName'], right: [] } }),
  },
  {
    feature: 'Grouping',
    title: 'Group rows by state',
    code: "grouping: ['state']",
    apply: (s) => ({ ...s, grouping: ['state'], expanded: true }),
  },
];

/** Table state with steps 0..step applied; -1 is the untouched table. */
const stateAt = (step: number) =>
  STEPS.slice(0, step + 1).reduce((s, x) => x.apply(s), BASE);

const STEP_MS = 2600;
const HOLD_MS = 4200;
const REST_MS = 1400;

type Mode = 'playing' | 'paused' | 'user';

/** v5's replaying table with plain v12 copy. */
export function SignalDemo() {
  const [step, setStep] = useState(-1);
  // true once the replay has run through every item at least once
  const [finished, setFinished] = useState(false);
  const [mode, setMode] = useState<Mode>('playing');
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<SignalTableState>(BASE);
  const rootRef = useRef<HTMLDivElement>(null);

  // reduced motion: no autoplay, land on the finished table
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const last = STEPS.length - 1;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot read of a media query
      setStep(last);
      setState(stateAt(last));
      setFinished(true);
      setMode('paused');
    }
  }, []);

  // only play while the band is on screen
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = mode === 'playing' && visible;

  useEffect(() => {
    if (!running) return;
    const last = STEPS.length - 1;
    const wait = step === -1 ? REST_MS : step === last ? HOLD_MS : STEP_MS;
    const t = setTimeout(() => {
      const next = step === last ? -1 : step + 1;
      if (step === last) setFinished(true);
      setStep(next);
      setState(stateAt(next));
    }, wait);
    return () => clearTimeout(t);
  }, [running, step]);

  const onChange = useCallback<SignalTableProps['onChange']>(
    (key, updater) =>
      setState((s) => ({
        ...s,
        [key]:
          typeof updater === 'function'
            ? (updater as (old: unknown) => unknown)(s[key])
            : updater,
      })),
    [],
  );

  const takeControl = () => setMode((m) => (m === 'playing' ? 'user' : m));

  const replay = () => {
    setFinished(false);
    setStep(-1);
    setState(BASE);
    setMode('playing');
  };

  const jumpTo = (i: number) => {
    setFinished(false);
    setStep(i);
    setState(stateAt(i));
    setMode('paused');
  };

  const status =
    mode === 'user'
      ? 'Paused'
      : step === -1
        ? finished
          ? `Showed ${STEPS.length} features`
          : 'Starting'
        : mode === 'paused' && step === STEPS.length - 1 && finished
          ? `Showed ${STEPS.length} features`
          : `Now showing: ${STEPS[step].feature}`;

  return (
    <div ref={rootRef} className="v5-demo" data-running={running || undefined}>
      <div
        className="v5-demo-table min-w-0"
        onPointerDownCapture={takeControl}
        onKeyDownCapture={takeControl}
      >
        <SignalTable state={state} onChange={onChange} />
      </div>

      <aside className="v5-steps" aria-label="Demo items">
        <div className="flex items-center justify-between gap-3 border-b border-(--dh-rule) px-4 py-3">
          <p className="flex min-w-0 items-center gap-2 text-xs font-medium tracking-wide text-(--dh-ink-muted) uppercase">
            <span
              aria-hidden="true"
              className="v5-live-dot"
              data-on={running || undefined}
            />
            <span className="truncate" aria-live="polite">
              {status}
            </span>
          </p>
          <button type="button" onClick={replay} className="v5-replay">
            <RotateCcwIcon aria-hidden="true" className="size-3.5" />
            Replay
          </button>
        </div>

        <ol className="flex flex-col">
          {STEPS.map((s, i) => {
            const done = i < step || (i === step && mode !== 'playing');
            const active = i === step && mode === 'playing';
            return (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  className="v5-step"
                  data-state={active ? 'active' : i <= step ? 'done' : 'todo'}
                  aria-current={i === step ? 'step' : undefined}
                >
                  <span aria-hidden="true" className="v5-step-mark">
                    <CheckIcon className="v5-step-check size-3" />
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-sm text-(--dh-ink)">{s.title}</span>
                    <code className="v5-step-code">{s.code}</code>
                  </span>
                  {active ? (
                    <span
                      key={`${step}-${mode}`}
                      aria-hidden="true"
                      className="v5-step-progress"
                      style={{
                        animationDuration: `${
                          i === STEPS.length - 1 ? HOLD_MS : STEP_MS
                        }ms`,
                      }}
                    />
                  ) : null}
                  <span className="sr-only">{done ? ' (applied)' : ''}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <p className="mt-auto flex items-start gap-2 border-t border-(--dh-rule) px-4 py-3 text-xs leading-relaxed text-(--dh-ink-muted)">
          <HandIcon
            aria-hidden="true"
            className="mt-0.5 size-3.5 shrink-0 text-(--dh-accent)"
          />
          {mode === 'user'
            ? 'The replay is off. Use the table as you would in your app.'
            : 'Click the table to stop the replay. Click a step to jump to it.'}
        </p>
      </aside>
    </div>
  );
}
