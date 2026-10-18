'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckIcon, HandIcon, RotateCcwIcon } from 'lucide-react';
import type {
  SignalCue,
  SignalTableProps,
  SignalTableState,
} from './signal-table';

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

interface Step {
  /** Feature name for the status line. */
  feature: string;
  title: string;
  code: string;
  /** What pulses when this item plays. */
  cue: SignalCue['kind'];
  /** Final table state once the item has played. */
  apply: (s: SignalTableState) => SignalTableState;
  /** Text the replay types letter by letter, and the table state for each
   * partial string, applied on top of the previous item's state. */
  typing?: {
    text: string;
    at: (s: SignalTableState, partial: string) => SignalTableState;
  };
}

const BASE: SignalTableState = {
  sorting: [],
  columnFilters: [],
  grouping: [],
  expanded: {},
  showColumnFilters: false,
  rowSelection: {},
  globalFilter: '',
  showGlobalFilter: false,
  salaryEdits: {},
};

/* The edit item opens Kathryn Kirlin's salary cell (row 55, fourth in the
 * sorted search results, and a "New" state row, so it survives the filter),
 * types a new value, then saves it; she then tops the list. */
const EDIT_STEP = 2;
const EDIT_ROW = '55';
const EDIT_FROM = '97434';
const EDIT_TO = '120000';

const STEPS: readonly Step[] = [
  {
    feature: 'Sorting',
    title: 'Sort by salary, highest first',
    code: "sorting: [{ id: 'salary', desc: true }]",
    cue: 'sort',
    apply: (s) => ({ ...s, sorting: [{ id: 'salary', desc: true }] }),
  },
  {
    feature: 'Search',
    title: 'Search all columns for “in”',
    code: "globalFilter: 'in'",
    cue: 'search',
    apply: (s) => ({ ...s, showGlobalFilter: true, globalFilter: 'in' }),
    typing: {
      text: 'in',
      at: (s, partial) => ({
        ...s,
        showGlobalFilter: true,
        globalFilter: partial,
      }),
    },
  },
  {
    feature: 'Editing',
    title: 'Edit a salary to $120,000',
    code: "enableEditing: true, editDisplayMode: 'cell'",
    cue: 'edit',
    apply: (s) => ({
      ...s,
      salaryEdits: { [EDIT_ROW]: Number(EDIT_TO) },
    }),
    // the typed value lives in the open cell's input until it is saved
    typing: { text: EDIT_TO, at: (s) => s },
  },
  {
    feature: 'Filtering',
    title: 'Filter states starting with “New”',
    code: "columnFilters: [{ id: 'state', value: 'New' }]",
    cue: 'filter',
    apply: (s) => ({
      ...s,
      showColumnFilters: true,
      columnFilters: [{ id: 'state', value: 'New' }],
    }),
    typing: {
      text: 'New',
      at: (s, partial) => ({
        ...s,
        showColumnFilters: true,
        columnFilters: partial ? [{ id: 'state', value: partial }] : [],
      }),
    },
  },
  {
    feature: 'Selection',
    title: 'Select rows',
    code: 'enableRowSelection: true',
    cue: 'select',
    // the top three rows left after the search and the filter
    apply: (s) => ({
      ...s,
      rowSelection: { '55': true, '144': true, '130': true },
    }),
  },
  {
    feature: 'Grouping',
    title: 'Group rows by state',
    code: "grouping: ['state']",
    cue: 'group',
    apply: (s) => ({ ...s, grouping: ['state'], expanded: true }),
  },
];

/** Table state with items 0..step applied; -1 is the untouched table. */
const stateAt = (step: number) =>
  STEPS.slice(0, step + 1).reduce((s, x) => x.apply(s), BASE);

// each item stays this long after its change lands (the 1200ms pulse fits
// well inside)
const STEP_MS = 3000;
// the finished table holds this long before the replay starts over
const HOLD_MS = 3000;
const REST_MS = 1400;
/* typing: a beat before the first letter, then one letter per CHAR_MS;
 * an edit is saved SAVE_MS after its last letter */
const TYPE_LEAD_MS = 600;
const CHAR_MS = 60;
const SAVE_MS = 700;

const typingMs = (step: number) => {
  const typing = STEPS[step]?.typing;
  if (!typing) return 0;
  return (
    TYPE_LEAD_MS +
    typing.text.length * CHAR_MS +
    (step === EDIT_STEP ? SAVE_MS : 0)
  );
};

type Mode = 'playing' | 'paused' | 'user';

/** v5's replaying table for the homepage: six items on a loop, each one types
 * any text letter by letter, then pulses what it changed. */
export function SignalDemo() {
  const [step, setStep] = useState(-1);
  const [mode, setMode] = useState<Mode>('playing');
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<SignalTableState>(BASE);
  // letters typed so far for the current item; null when it is not typing
  const [typed, setTyped] = useState<number | null>(null);
  // bumped on each restart so the table fades back in from its plain state
  const [resets, setResets] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

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

  // advance to the next item
  useEffect(() => {
    if (!running) return;
    const last = STEPS.length - 1;
    const wait =
      (step === -1 ? REST_MS : step === last ? HOLD_MS : STEP_MS) +
      typingMs(step);
    const t = setTimeout(() => {
      // after the last item, fade back to the plain table and start over
      if (step === last) {
        setResets((n) => n + 1);
        setStep(-1);
        setState(BASE);
        setTyped(null);
        return;
      }
      const next = step + 1;
      setStep(next);
      const typing = STEPS[next]?.typing;
      if (typing) {
        setState(typing.at(stateAt(next - 1), ''));
        setTyped(0);
      } else {
        setState(stateAt(next));
        setTyped(null);
      }
    }, wait);
    return () => clearTimeout(t);
  }, [running, step]);

  // type the current item's text, one letter at a time
  useEffect(() => {
    const typing = STEPS[step]?.typing;
    if (!running || !typing || typed === null) return;
    const done = typed >= typing.text.length;
    const t = setTimeout(
      () => {
        if (done) {
          setState(stateAt(step));
          setTyped(null);
          return;
        }
        const n = typed + 1;
        setState(typing.at(stateAt(step - 1), typing.text.slice(0, n)));
        setTyped(n);
      },
      done
        ? step === EDIT_STEP
          ? SAVE_MS
          : 0
        : typed === 0
          ? TYPE_LEAD_MS
          : CHAR_MS,
    );
    return () => clearTimeout(t);
  }, [running, step, typed]);

  const editing =
    step === EDIT_STEP && typed !== null
      ? {
          rowId: EDIT_ROW,
          value: typed === 0 ? EDIT_FROM : EDIT_TO.slice(0, typed),
        }
      : null;

  // the pulse starts once the change has landed: after any typing (and,
  // for the edit, after the value is saved)
  const cueKind =
    step >= 0 && mode !== 'user' && typed === null ? STEPS[step].cue : null;
  const cue: SignalCue | null =
    cueKind === null
      ? null
      : cueKind === 'edit'
        ? { kind: 'edit', rowId: EDIT_ROW }
        : { kind: cueKind };

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

  const takeControl = () => {
    if (mode !== 'playing') return;
    setMode('user');
    // a half-typed item lands on its finished state
    if (typed !== null && step >= 0) {
      setTyped(null);
      setState(stateAt(step));
    }
  };

  // start over from the first item straight away
  const replay = () => {
    setResets((n) => n + 1);
    setTyped(null);
    setStep(0);
    setState(stateAt(0));
    setMode('playing');
  };

  const jumpTo = (i: number) => {
    setTyped(null);
    setStep(i);
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
        onPointerDownCapture={takeControl}
        onKeyDownCapture={takeControl}
      >
        <SignalTable
          state={state}
          onChange={onChange}
          editing={editing}
          cue={cue}
        />
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
                          (i === STEPS.length - 1 ? HOLD_MS : STEP_MS) +
                          typingMs(i)
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
