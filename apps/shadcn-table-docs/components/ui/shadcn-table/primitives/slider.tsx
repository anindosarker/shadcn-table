import { type ComponentPropsWithRef } from 'react';
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

export const Slider = (props: SliderProps) => <ShadcnSlider {...props} />;
