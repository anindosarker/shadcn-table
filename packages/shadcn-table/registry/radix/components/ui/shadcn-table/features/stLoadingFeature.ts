// Owns the `isLoading`, `isSaving`, `showLoadingOverlay`, `showProgressBars`
// and `showSkeletons` state slices. They have no setters: the controlled
// `state` option drives them, and each one defaults to `false`.
import type { TableFeature } from '@tanstack/react-table';

export interface ST_TableState_Loading {
  isLoading: boolean;
  isSaving: boolean;
  showLoadingOverlay: boolean;
  showProgressBars: boolean;
  showSkeletons: boolean;
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
  getInitialState: (initialState) => ({
    isLoading: false,
    isSaving: false,
    showLoadingOverlay: false,
    showProgressBars: false,
    showSkeletons: false,
    ...initialState,
  }),
};
