export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

export type SRT_TooltipSide = 'bottom' | 'left' | 'right' | 'top';

export type SRT_CommonTooltipProps = {
  delayDuration: number;
  side?: SRT_TooltipSide;
};

export const getCommonTooltipProps = (
  side?: SRT_TooltipSide,
): SRT_CommonTooltipProps => ({
  delayDuration: 1000,
  side,
});
