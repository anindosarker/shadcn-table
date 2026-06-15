import { type CSSProperties } from 'react';
import { type SRT_HTMLProps, type SRT_HTMLPropsValue } from '../types';

/**
 * Resolve a `srt*Props` slot (value or callback) into a plain DOM-attribute
 * object. Returns `undefined` when the slot is not provided.
 *
 * The shadcn-idiomatic counterpart to MRT's MUI `*Props` resolution. Components
 * spread the result onto the target element and compose `className` over their
 * own (cva) defaults via `cn()`.
 *
 * @example
 *   const p = parseSRT_HtmlProps(table.options.srtTableBodyCellProps, ctx);
 *   <td {...p} className={cn(defaultClasses, p?.className)} />
 */
export const parseSRT_HtmlProps = <TElement, TContext>(
  propsOrFn: SRT_HTMLProps<TElement, TContext>,
  context: TContext,
): SRT_HTMLPropsValue<TElement> | undefined =>
  propsOrFn instanceof Function ? propsOrFn(context) : propsOrFn;

/** Compose two `className` strings into one space-separated string. */
const mergeClassNames = (
  a: string | undefined,
  b: string | undefined,
): string | undefined => {
  const merged = [a, b].filter(Boolean).join(' ').trim();
  return merged === '' ? undefined : merged;
};

/** Compose two `style` objects (b wins on key conflicts). */
const mergeStyles = (
  a: CSSProperties | undefined,
  b: CSSProperties | undefined,
): CSSProperties | undefined => {
  if (!a) return b;
  if (!b) return a;
  return { ...a, ...b };
};

/** True for keys that look like a React event handler (`onClick`, `onKeyDown`, …). */
const isEventHandlerKey = (key: string): boolean =>
  key.length > 2 &&
  key[0] === 'o' &&
  key[1] === 'n' &&
  key[2] === key[2].toUpperCase();

/**
 * Compose two event handlers so both run; `a` (the library handler) runs first,
 * then `b` (the user handler). Either may be `undefined`.
 */
const mergeEventHandlers = (
  a: ((...args: any[]) => void) | undefined,
  b: ((...args: any[]) => void) | undefined,
): ((...args: any[]) => void) | undefined => {
  if (!a) return b;
  if (!b) return a;
  return (...args: any[]) => {
    a(...args);
    b(...args);
  };
};

/**
 * Merge two resolved DOM-attribute objects into one. `b` is layered over `a`:
 * - `className` is composed (space-joined) so both sets of classes apply
 * - `style` is shallow-merged with `b` winning on key conflicts
 * - event handlers (`on*`) are composed so both fire (`a` first, then `b`)
 * - all other attributes: `b` overrides `a`
 *
 * Pass the library/default props as `a` and the user-supplied props as `b`.
 * `className` is space-joined only; final tailwind dedup (e.g. via `cn()`) is a
 * concern for the component layer that owns the cva defaults.
 */
export const mergeSRT_HtmlProps = <
  A extends Record<string, any> | undefined,
  B extends Record<string, any> | undefined,
>(
  a: A,
  b: B,
): (NonNullable<A> & NonNullable<B>) | undefined => {
  if (!a) return b as any;
  if (!b) return a as any;

  const merged: Record<string, any> = { ...a };

  for (const key of Object.keys(b)) {
    const bVal = (b as Record<string, any>)[key];
    if (key === 'className') {
      merged.className = mergeClassNames(a.className, bVal);
    } else if (key === 'style') {
      merged.style = mergeStyles(a.style, bVal);
    } else if (
      isEventHandlerKey(key) &&
      (typeof bVal === 'function' || typeof a[key] === 'function')
    ) {
      merged[key] = mergeEventHandlers(a[key], bVal);
    } else {
      merged[key] = bVal;
    }
  }

  return merged as any;
};
