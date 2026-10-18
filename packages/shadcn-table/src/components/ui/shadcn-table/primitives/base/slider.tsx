// Base-neutral slider API over the installed shadcn slider part. Library code
// imports this module, never `@/components/ui/slider`, so the Radix and Base
// UI builds differ only here. Base UI implementation.
import { type ComponentProps, type ComponentPropsWithRef } from 'react';
import { Slider as ShadcnSlider } from '@/components/ui/slider';

/**
 * Props of the library's range slider (the `stFilterSliderProps` table
 * option). Values are always arrays, one entry per thumb.
 */
export type SliderProps = Omit<
  ComponentPropsWithRef<'span'>,
  'defaultValue' | 'dir' | 'onChange'
> & {
  defaultValue?: number[];
  disabled?: boolean;
  max?: number;
  min?: number;
  minStepsBetweenThumbs?: number;
  name?: string;
  onValueChange?: (value: number[]) => void;
  /** Fires once per interaction, when the pointer or key is released. */
  onValueCommit?: (value: number[]) => void;
  orientation?: 'horizontal' | 'vertical';
  step?: number;
  value?: number[];
};

/** Base UI reports a bare number for a single-thumb slider. */
const toArray = (value: number | readonly number[]) =>
  typeof value === 'number' ? [value] : [...value];

export const Slider = ({
  minStepsBetweenThumbs,
  onValueChange,
  onValueCommit,
  ...rest
}: SliderProps) => (
  // Base UI renders a div root; the span-shaped props the library passes
  // (handlers, ref) fit it at runtime.
  <ShadcnSlider
    minStepsBetweenValues={minStepsBetweenThumbs}
    onValueChange={onValueChange && ((next) => onValueChange(toArray(next)))}
    onValueCommitted={onValueCommit && ((next) => onValueCommit(toArray(next)))}
    {...(rest as ComponentProps<typeof ShadcnSlider>)}
  />
);
