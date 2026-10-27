// Owns the `isLoading`, `isSaving`, `showLoadingOverlay`, `showProgressBars`
// and `showSkeletons` state slices. They have no setters: the controlled
// `state` option drives them. `isLoading` and `isSaving` default to `false`;
// the three `show*` slices start unset, so the overlay and skeletons follow
// `isLoading` and the progress bars follow `isSaving` until a slice is set,
// and an explicit `false` turns its UI off.
import type { TableFeature } from '@tanstack/react-table';

export interface ST_TableState_Loading {
  isLoading: boolean;
  isSaving: boolean;
  showLoadingOverlay: boolean | undefined;
  showProgressBars: boolean | undefined;
  showSkeletons: boolean | undefined;
}

declare module '@tanstack/react-table' {
  interface Plugins {
    stLoadingFeature: TableFeature;
  }
  interface TableState_FeatureMap {
    stLoadingFeature: ST_TableState_Loading;
  }
}

export const stLoadingFeature: TableFeature = {
  // Every slice needs a key here, `undefined` included: core builds an atom
  // only for the keys of the initial state, and the controlled `state` reaches
  // `table.state` through that atom.
  getInitialState: (initialState) => ({
    isLoading: false,
    isSaving: false,
    showLoadingOverlay: undefined,
    showProgressBars: undefined,
    showSkeletons: undefined,
    ...initialState,
  }),
};
