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
  /** Short feature title in the step list. */
  title: string;
  code: string;
  /** The interaction, played before the state lands. */
  beats: readonly Beat[];
  /** How long what the step opened stays up after its last beat; SHOW_MS
   * when unset. */
  showMs?: number;
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

/** The "+ Filter" pill beside the chips (named by its text only), or the
 * toolbar filter button while the chips row has no pill yet. */
const addFilterButton = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>('button:not([aria-label])')].find(
    (button) =>
      !button.closest('table') && button.textContent?.trim() === 'Filter',
  ) ?? toolbarButton(root, 'Filter');

/** Closes the open popover the way a click outside it does. Clicking its
 * trigger again would hand focus back to the trigger: a focused toolbar
 * button keeps its tooltip and focus ring up into the next step and, off
 * screen, scrolls the page to itself. An open select inside the popover
 * closes first, so this repeats until the trigger reads closed. */
const clickOutside = (trigger: HTMLElement, tries = 3) => {
  if (!tries || trigger.getAttribute('aria-expanded') !== 'true') return;
  // Radix dismisses on the click that follows the pointerdown
  document.body.dispatchEvent(
    new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }),
  );
  document.body.click();
  setTimeout(() => clickOutside(trigger, tries - 1), 50);
};

/** An option of the open popover (a column picker or a select list). */
const option = (text: string) =>
  [
    ...document.querySelectorAll<HTMLElement>(
      '[data-slot="popover-content"] [role="option"], [data-slot="select-content"] [role="option"]',
    ),
  ].find((el) => el.textContent?.trim() === text) ?? null;

/* Where the replay's clicks move focus: the table and the popovers it opens
 * (portalled outside the table). An open select keeps its focus: it marks
 * the highlighted option, as for a visitor, and its focus trap fights a
 * blur until the select closes. */
const REPLAY_POPOVERS = '[data-slot="popover-content"]';
/* Text fields keep the focus the replay gives them: they show a caret, as
 * they do for a visitor. */
const TEXT_FIELD =
  'input:not([type="checkbox"], [type="radio"], [type="range"]), textarea';
/* Focus this soon after a visitor's own pointer or key press is theirs. */
const USER_FOCUS_MS = 300;

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

/** Beats that type `text` one letter at a time through `at`, the first one
 * `first` ms after the previous beat. */
const typeBeats = (
  text: string,
  at: (r: Replay, partial: string) => void,
  first = CHAR_MS,
): Beat[] =>
  [...text].map((_, i) => [
    i === 0 ? first : CHAR_MS,
    (r: Replay) => at(r, text.slice(0, i + 1)),
  ]);

const STEPS: readonly Step[] = [
  {
    feature: 'Sorting',
    title: 'Sort editor',
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
    title: 'Global search',
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
    title: 'Cell editing',
    code: "enableEditing: true, editDisplayMode: 'cell'",
    beats: [
      [0, (r) => r.set(clearSearch)],
      [500, (r) => pulse(estimateCell(r.root))],
      [600, (r) => r.edit({ rowId: EDIT_ROW, value: EDIT_FROM })],
      // the new value types over the old one, with no empty field between
      ...typeBeats(
        EDIT_TO,
        (r, partial) => r.edit({ rowId: EDIT_ROW, value: partial }),
        640,
      ),
    ],
    apply: (s) => ({
      ...clearSearch(s),
      estimateEdits: { [EDIT_ROW]: Number(EDIT_TO) },
    }),
  },
  {
    feature: 'Filtering',
    title: 'Filter chips',
    code: "columnFilters: [{ id: 'status', value: 'In Review' }]",
    beats: [
      // the "+ Filter" pill, so the cue, the picker and the new chip sit
      // together in the chips row
      [0, (r) => pulse(addFilterButton(r.root))],
      [600, (r) => r.open(addFilterButton(r.root))],
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
    title: 'Column order',
    code: "columnOrder: ['name', 'project', 'status', 'assignee', …]",
    // the header pulses, slides next to Name, and pulses again where it
    // landed, so the step plays about as long as the others
    beats: [
      [0, (r) => pulse(headerCell(r.root, 'project'))],
      [700, (r) => r.set(STEPS[4].apply)],
      [900, (r) => pulse(headerCell(r.root, 'project'))],
    ],
    apply: (s) => ({ ...s, columnOrder: ['project', 'status', 'assignee'] }),
  },
  {
    feature: 'View settings',
    title: 'Striped rows',
    code: 'viewSettings: { striped: true }',
    // the panel covers half the table: it closes soon after the switch flips,
    // so the stripes show for the whole hold
    showMs: 700,
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
// every step stays active at least this long, beats and hold together
const MIN_STEP_MS = 5200;

/* Room under the toolbar's buttons the tallest popover a step opens needs
 * to open below its trigger (measured 2026-11-05): the view settings panel
 * reaches 309px below them, the filter picker under a wrapped chips row
 * (390px wide) 340px; plus a margin. */
const POPOVER_ROOM_PX = 360;

const showMs = (step: number) => STEPS[step]?.showMs ?? SHOW_MS;

const beatsMs = (step: number) =>
  (STEPS[step]?.beats ?? []).reduce((ms, [wait]) => ms + wait, 0) +
  showMs(step);

const holdMs = (step: number) =>
  step === -1
    ? REST_MS
    : Math.max(
        step === STEPS.length - 1 ? LAST_HOLD_MS : HOLD_MS,
        MIN_STEP_MS - beatsMs(step),
      );

type Mode = 'playing' | 'paused' | 'user';
/* beats: the step's interaction plays; hold: its state has landed */
type Phase = 'beats' | 'hold';

/** A step's interaction in flight. It outlives the effect that plays it, so
 * a remount of that effect (Strict Mode in dev, Fast Refresh) resumes the
 * beats instead of cutting them short. */
interface Run {
  /** The navigation this run belongs to (`token` in SignalDemo). */
  token: number;
  step: number;
  start: number;
  /** Beats already played. */
  ran: number;
  /** The popover trigger the step opened, closed when it lands. */
  opened: HTMLElement | null;
  mounted: boolean;
  landed: boolean;
}

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
  const tableRef = useRef<HTMLDivElement>(null);
  // bumped on every move (the loop, a jump, Replay): an interrupted run lands
  // its state only while no newer move happened
  const tokenRef = useRef(0);
  const runRef = useRef<Run | null>(null);

  const goTo = (next: number, nextPhase: Phase) => {
    tokenRef.current += 1;
    setStep(next);
    setPhase(nextPhase);
  };

  // reduced motion: no autoplay, land on the finished table
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const last = STEPS.length - 1;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot read of a media query
      setStep(last);
      setState(stateAt(last));
      setMode('paused');
    }
  }, []);

  // only play while the toolbar shows below the sticky nav with room for the
  // popovers under it, or they flip up over the hero (F48, D63); otherwise
  // hold on Starting or pause in place, never scroll the page
  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const toolbar = toolbarButton(el, 'Sort')?.getBoundingClientRect();
      const nav =
        document.querySelector('.v4-nav')?.getBoundingClientRect().bottom ?? 0;
      setVisible(
        !!toolbar &&
          toolbar.height > 0 &&
          toolbar.top >= nav &&
          toolbar.bottom + POPOVER_ROOM_PX <= window.innerHeight,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    // the table mounts late (next/dynamic) and the page above it can reflow
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, []);

  const running = mode === 'playing' && visible;

  // the replay's clicks carry no pointer, so the browser draws a keyboard
  // focus ring on the controls its popovers focus (the panel's first row, a
  // select's trigger once the select closes), where a visitor's click
  // shows none; while it plays, focus no visitor input caused leaves them
  useEffect(() => {
    if (!running) return;
    let userAt = -Infinity;
    const onInput = (event: Event) => {
      if (event.isTrusted) userAt = event.timeStamp;
    };
    const onFocus = (event: FocusEvent) => {
      const el = event.target;
      if (!(el instanceof HTMLElement) || el.matches(TEXT_FIELD)) return;
      if (event.timeStamp - userAt < USER_FOCUS_MS) return;
      if (!tableRef.current?.contains(el) && !el.closest(REPLAY_POPOVERS)) {
        return;
      }
      // a frame later, before the next paint: a select trigger the replay
      // just clicked takes focus as it opens, and blurring it then closes
      // the select and the popover around it, so an open one keeps it
      requestAnimationFrame(() => {
        if (
          document.activeElement === el &&
          el.getAttribute('aria-expanded') !== 'true'
        ) {
          el.blur();
        }
      });
    };
    document.addEventListener('pointerdown', onInput, true);
    document.addEventListener('keydown', onInput, true);
    document.addEventListener('focusin', onFocus);
    return () => {
      document.removeEventListener('pointerdown', onInput, true);
      document.removeEventListener('keydown', onInput, true);
      document.removeEventListener('focusin', onFocus);
    };
  }, [running]);

  // play the current step's beats, then land its state
  useEffect(() => {
    const root = tableRef.current;
    if (!running || phase !== 'beats' || step < 0 || !root) return;
    const prev = runRef.current;
    const run: Run =
      prev && prev.token === tokenRef.current && !prev.landed
        ? prev
        : {
            token: tokenRef.current,
            step,
            start: performance.now(),
            ran: 0,
            opened: null,
            mounted: false,
            landed: false,
          };
    runRef.current = run;
    run.mounted = true;
    const replay: Replay = {
      root,
      set: (update) => setState(update),
      edit: setEditing,
      open: (trigger) => {
        if (!trigger) return;
        run.opened = trigger;
        trigger.click();
      },
    };
    // closes what the step opened and lands its state, once
    const land = () => {
      if (run.landed) return;
      run.landed = true;
      if (run.opened) clickOutside(run.opened);
      run.opened = null;
      setEditing(null);
      if (tokenRef.current !== run.token) return;
      setState(stateAt(run.step));
      setPhase('hold');
    };
    // a resumed run plays only the beats it has not played, on its own clock
    const elapsed = performance.now() - run.start;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let at = 0;
    STEPS[step].beats.forEach(([wait, beat], i) => {
      at += wait;
      if (i < run.ran) return;
      timers.push(
        setTimeout(
          () => {
            run.ran = i + 1;
            beat(replay);
          },
          Math.max(0, at - elapsed),
        ),
      );
    });
    timers.push(setTimeout(land, Math.max(0, at + showMs(step) - elapsed)));
    return () => {
      timers.forEach(clearTimeout);
      run.mounted = false;
      // a remount runs this effect again in the same task and resumes the
      // run; stopped part way (a click, a jump, Replay, or scrolled away),
      // it finishes at once
      queueMicrotask(() => {
        if (!run.mounted) land();
      });
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

  // in the 240px aside "Now showing:" and the feature sit on two lines of
  // their own, so the status keeps one height and the step list under it
  // never moves; under the table (below 1440px) they share one line
  const status =
    mode === 'user' ? (
      'Paused'
    ) : step === -1 ? (
      'Starting'
    ) : (
      <>
        <span className="truncate">Now showing:</span>{' '}
        <span className="truncate">{STEPS[step].feature}</span>
      </>
    );

  return (
    <div className="v5-demo" data-running={running || undefined}>
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
            <span
              className="flex h-8 min-w-0 items-center gap-x-1 min-[1440px]:flex-col min-[1440px]:items-start min-[1440px]:justify-center"
              aria-live="polite"
            >
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
