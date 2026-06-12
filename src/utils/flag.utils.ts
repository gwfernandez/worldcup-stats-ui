export type FlagSize = 'sm' | 'md';

const FLAG_DIMENSIONS: Record<FlagSize, string> = {
  sm: '24x18',
  md: '48x36',
};

const FLAGCDN_COUNTRY_CODE_BY_API_CODE: Record<string, string> = {
  CAN: 'CA',
  MEX: 'MX',
  USA: 'US',
};

/** Builds a FlagCDN URL for the given ISO country code. */
export const getFlagUrl = (countryCode: string, size: FlagSize = 'sm'): string => {
  const flagCode = FLAGCDN_COUNTRY_CODE_BY_API_CODE[countryCode.toUpperCase()] ?? countryCode;

  return `https://flagcdn.com/${FLAG_DIMENSIONS[size]}/${flagCode.toLowerCase()}.png`;
};

export const FLAG_DISPLAY_SIZE: Record<FlagSize, { width: number; height: number }> = {
  sm: { width: 18, height: 13 },
  md: { width: 24, height: 18 },
};
