export type FlagSize = 'sm' | 'md';

const FLAG_DIMENSIONS: Record<FlagSize, string> = {
  sm: '24x18',
  md: '48x36',
};

/** Builds a FlagCDN URL for the given ISO country code. */
export const getFlagUrl = (countryCode: string, size: FlagSize = 'sm'): string =>
  `https://flagcdn.com/${FLAG_DIMENSIONS[size]}/${countryCode.toLowerCase()}.png`;

export const FLAG_DISPLAY_SIZE: Record<FlagSize, { width: number; height: number }> = {
  sm: { width: 18, height: 13 },
  md: { width: 24, height: 18 },
};
