'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckIcon, HandIcon, RotateCcwIcon } from 'lucide-react';
import type { SignalTableProps, SignalTableState } from './signal-table';

const SignalTable = dynamic(() => import('./signal-table'), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      className="flex min-h-[26rem] items-center justify-center text-sm text-(--dh-ink-muted)"
    >
      Loading table
    </div>
  ),
});

/** What a beat can do to the table on screen. */
interface Replay {
  /** The table wrapper; popovers render in portals outside it. */
  root: HTMLElement;
  set: (update: (s: SignalTableState) => SignalTableState) => void;
  edit: (editing: SignalTableProps['editing']) => void;
  /** Clicks a popover trigger, which the step closes again at its end. */
  open: (trigger: HTMLElement | null) => void;
}

/** One timed action of a step: it runs `wait` ms after the previous one. */
type Beat = [wait: number, run: (r: Replay) => void];

interface Step {
  /** Feature name for the status line. */
  feature: string;
  title: string;
  code: string;
  /** The interaction, played before the state lands. */
  beats: readonly Beat[];
  /** Final table state once the item has played. */
  apply: (s: SignalTableState) => SignalTableState;
}

const BASE: SignalTableState = {
  sorting: [],
  columnFilters: [],
  globalFilter: '',
  showGlobalFilter: false,
  columnOrder: [],
  viewSettings: { striped: false },
  estimateEdits: {},
};

/* The edit item closes the search first, so search shows only in its own
 * item. It then opens the estimate of "Review onboarding flow" (task-40,
 * second in the due date sort, and In Review, so it survives the filter),
 * types a new value, then saves it. */
const EDIT_ROW = 'task-40';
const EDIT_FROM = '4';
const EDIT_TO = '16';
const SEARCH = 'billing';

/* One-shot accent pulse (v12.css), on the control a step is about to use. */
const PULSE = 'v12-cue';
const PULSE_MS = 1200;

const pulse = (el: Element | null | undefined) => {
  if (!el) return;
  el.classList.remove(PULSE);
  // restart the animation when the same control pulses twice
  void (el as HTMLElement).offsetWidth;
  el.classList.add(PULSE);
  setTimeout(() => el.classList.remove(PULSE), PULSE_MS);
};

/** A toolbar button by its accessible name, outside the table itself. */
const toolbarButton = (root: HTMLElement, label: string) =>
  [...root.querySelectorAll<HTMLElement>(`button[aria-label="${label}"]`)].find(
    (button) => !button.closest('table'),
  ) ?? null;

/** An option of the open popover (a column picker or a select list). */
const option = (text: string) =>
  [
    ...document.querySelectorAll<HTMLElement>(
      '[data-slot="popover-content"] [role="option"], [data-slot="select-content"] [role="option"]',
    ),
  ].find((el) => el.textContent?.trim() === text) ?? null;

const headerCell = (root: HTMLElement, id: string) =>
  root.querySelector<HTMLElement>(`thead th[data-flip-column="${id}"]`);

const estimateCell = (root: HTMLElement) =>
  root.querySelector<HTMLElement>(
    `tbody tr[data-row-id="${EDIT_ROW}"] td[data-flip-column="estimate"]`,
  );

const clearSearch = (s: SignalTableState): SignalTableState => ({
  ...s,
  globalFilter: '',
  showGlobalFilter: false,
});

// reading pace for the replay's typing
const CHAR_MS = 140;

/** Beats that type `text` one letter at a time through `at`. */
const typeBeats = (
  text: string,
  at: (r: Replay, partial: string) => void,
): Beat[] =>
  [...text].map((_, i) => [
    CHAR_MS,
    (r: Replay) => at(r, text.slice(0, i + 1)),
  ]);

const STEPS: readonly Step[] = [
  {
    feature: 'Sorting',
    title: 'Sort by due date in the sort editor',
    code: "sorting: [{ id: 'due', desc: false }]",
    beats: [
      [0, (r) => pulse(toolbarButton(r.root, 'Sort'))],
      [600, (r) => r.open(toolbarButton(r.root, 'Sort'))],
      [700, () => pulse(option('Due'))],
      [500, (r) => option('Due')?.click() ?? r.set(STEPS[0].apply)],
    ],
    apply: (s) => ({ ...s, sorting: [{ id: 'due', desc: false }] }),
  },
  {
    feature: 'Search',
    title: 'Search all columns for “billing”',
    code: "globalFilter: 'billing'",
    beats: [
      [0, (r) => pulse(toolbarButton(r.root, 'Show/Hide search'))],
      [600, (r) => r.set((s) => ({ ...s, showGlobalFilter: true }))],
      ...typeBeats(SEARCH, (r, partial) =>
        r.set((s) => ({ ...s, globalFilter: partial })),
      ),
    ],
    apply: (s) => ({ ...s, showGlobalFilter: true, globalFilter: SEARCH }),
  },
  {
    feature: 'Editing',
    title: 'Edit an estimate to 16h',
    code: "enableEditing: true, editDisplayMode: 'cell'",
    beats: [
      [0, (r) => r.set(clearSearch)],
      [500, (r) => pulse(estimateCell(r.root))],
      [600, (r) => r.edit({ rowId: EDIT_ROW, value: EDIT_FROM })],
      [500, (r) => r.edit({ rowId: EDIT_ROW, value: '' })],
      ...typeBeats(EDIT_TO, (r, partial) =>
        r.edit({ rowId: EDIT_ROW, value: partial }),
      ),
    ],
    apply: (s) => ({
      ...clearSearch(s),
      estimateEdits: { [EDIT_ROW]: Number(EDIT_TO) },
    }),
  },
  {
    feature: 'Filtering',
    title: 'Filter the status with a chip',
    code: "columnFilters: [{ id: 'status', value: 'In Review' }]",
    beats: [
      [0, (r) => pulse(toolbarButton(r.root, 'Filter'))],
      [600, (r) => r.open(toolbarButton(r.root, 'Filter'))],
      [700, () => pulse(option('Status'))],
      [500, () => option('Status')?.click()],
      [
        700,
        () =>
          document
            .querySelector<HTMLElement>(
              '[data-slot="popover-content"] [data-slot="select-trigger"]',
            )
            ?.click(),
      ],
      [700, () => pulse(option('In Review'))],
      [500, (r) => option('In Review')?.click() ?? r.set(STEPS[3].apply)],
    ],
    apply: (s) => ({
      ...s,
      columnFilters: [{ id: 'status', value: 'In Review' }],
    }),
  },
  {
    feature: 'Column order',
    title: 'Move Project next to Name',
    code: "columnOrder: ['name', 'project', 'status', 'assignee', …]",
    beats: [
      [0, (r) => pulse(headerCell(r.root, 'project'))],
      [700, (r) => r.set(STEPS[4].apply)],
    ],
    apply: (s) => ({ ...s, columnOrder: ['project', 'status', 'assignee'] }),
  },
  {
    feature: 'View settings',
    title: 'Stripe the rows in the view settings',
    code: 'viewSettings: { striped: true }',
    beats: [
      [0, (r) => pulse(toolbarButton(r.root, 'View settings'))],
      [600, (r) => r.open(toolbarButton(r.root, 'View settings'))],
      [
        700,
        () =>
          pulse(
            document.querySelector(
              '[data-slot="popover-content"] [aria-label="Alternating row colors"]',
            ),
          ),
      ],
      [
        500,
        (r) => {
          const toggle = document.querySelector<HTMLElement>(
            '[data-slot="popover-content"] [aria-label="Alternating row colors"]',
          );
          if (toggle?.getAttribute('aria-checked') === 'false') toggle.click();
          r.set(STEPS[5].apply);
        },
      ],
    ],
    apply: (s) => ({ ...s, viewSettings: { striped: true } }),
  },
];

/** Table state with items 0..step applied; -1 is the untouched table. */
const stateAt = (step: number) =>
  STEPS.slice(0, step + 1).reduce((s, x) => x.apply(s), BASE);

// after its last beat, a step's open popover stays up this long, then the
// step's state lands and holds HOLD_MS (the 1200ms pulse fits well inside)
const SHOW_MS = 1200;
const HOLD_MS = 2200;
// the finished table holds this long before the replay starts over
const LAST_HOLD_MS = 3000;
const REST_MS = 1400;

const beatsMs = (step: number) =>
  (STEPS[step]?.beats ?? []).reduce((ms, [wait]) => ms + wait, 0) + SHOW_MS;

const holdMs = (step: number) =>
  step === -1 ? REST_MS : step === STEPS.length - 1 ? LAST_HOLD_MS : HOLD_MS;

type Mode = 'playing' | 'paused' | 'user';
/* beats: the step's interaction plays; hold: its state has landed */
type Phase = 'beats' | 'hold';

/** The replaying table for the homepage: six items on a loop, each one plays
 * its interaction on the table's own controls, then its state lands. */
export function SignalDemo() {
  const [step, setStep] = useState(-1);
  const [phase, setPhase] = useState<Phase>('hold');
  const [mode, setMode] = useState<Mode>('playing');
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<SignalTableState>(BASE);
  const [editing, setEditing] = useState<SignalTableProps['editing']>(null);
  // bumped on each restart so the table fades back in from its plain state
  const [resets, setResets] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  // the step the visitor or the loop moved to last, read by an interrupted
  // step's cleanup so it does not land over a newer jump
  const stepRef = useRef(-1);

  const goTo = (next: number, nextPhase: Phase) => {
    stepRef.current = next;
    setStep(next);
    setPhase(nextPhase);
  };

  // reduced motion: no autoplay, land on the finished table
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const last = STEPS.length - 1;
      stepRef.current = last;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot read of a media query
      setStep(last);
      setState(stateAt(last));
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

  // play the current step's beats, then land its state
  useEffect(() => {
    const root = tableRef.current;
    if (!running || phase !== 'beats' || step < 0 || !root) return;
    let opened: HTMLElement | null = null;
    let finished = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const replay: Replay = {
      root,
      set: (update) => setState(update),
      edit: setEditing,
      open: (trigger) => {
        if (!trigger) return;
        opened = trigger;
        trigger.click();
      },
    };
    // closes what the step opened and lands its state
    const land = () => {
      if (opened?.getAttribute('aria-expanded') === 'true') opened.click();
      opened = null;
      setEditing(null);
      if (stepRef.current !== step) return;
      setState(stateAt(step));
      setPhase('hold');
    };
    let at = 0;
    for (const [wait, run] of STEPS[step].beats) {
      at += wait;
      timers.push(setTimeout(() => run(replay), at));
    }
    timers.push(
      setTimeout(() => {
        finished = true;
        land();
      }, at + SHOW_MS),
    );
    return () => {
      timers.forEach(clearTimeout);
      // stopped part way (a click, a jump, or scrolled away): finish at once
      if (!finished) land();
    };
  }, [running, phase, step, resets]);

  // after a step's hold, start the next one
  useEffect(() => {
    if (!running || phase !== 'hold') return;
    const last = STEPS.length - 1;
    const t = setTimeout(() => {
      // after the last item, fade back to the plain table and start over
      if (step === last) {
        setResets((n) => n + 1);
        setState(BASE);
        goTo(-1, 'hold');
        return;
      }
      goTo(step + 1, 'beats');
    }, holdMs(step));
    return () => clearTimeout(t);
  }, [running, phase, step]);

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

  // a visitor's own pointer or key stops the replay; the replay's clicks
  // are not trusted events and pass
  const takeControl = (event: { isTrusted: boolean }) => {
    if (!event.isTrusted || mode !== 'playing') return;
    setMode('user');
  };

  // start over from the first item straight away
  const replay = () => {
    setResets((n) => n + 1);
    setEditing(null);
    setState(BASE);
    goTo(0, 'beats');
    setMode('playing');
  };

  const jumpTo = (i: number) => {
    setEditing(null);
    goTo(i, 'hold');
    setState(stateAt(i));
    setMode('paused');
  };

  const status =
    mode === 'user'
      ? 'Paused'
      : step === -1
        ? 'Starting'
        : `Now showing: ${STEPS[step].feature}`;

  return (
    <div ref={rootRef} className="v5-demo" data-running={running || undefined}>
      <div
        className={`v5-demo-table min-w-0 ${
          resets === 0 ? '' : resets % 2 ? 'v12-reset-a' : 'v12-reset-b'
        }`}
        ref={tableRef}
        onPointerDownCapture={takeControl}
        onKeyDownCapture={takeControl}
      >
        <SignalTable state={state} onChange={onChange} editing={editing} />
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

        <ol className="v12-step-list flex flex-col">
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
                      key={`${step}-${mode}-${resets}`}
                      aria-hidden="true"
                      className="v5-step-progress"
                      style={{
                        animationDuration: `${beatsMs(i) + holdMs(i)}ms`,
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
