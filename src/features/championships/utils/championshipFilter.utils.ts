export type FilterType = 'Todos' | 'América' | 'Europa' | 'Asia' | 'África';

export const CONTINENT_BY_COUNTRY_CODE: Record<string, FilterType> = {
  UY: 'América',
  AR: 'América',
  BR: 'América',
  CL: 'América',
  MX: 'América',
  US: 'América',
  IT: 'Europa',
  FR: 'Europa',
  DE: 'Europa',
  GB: 'Europa',
  SE: 'Europa',
  CH: 'Europa',
  ES: 'Europa',
  RU: 'Europa',
  JP: 'Asia',
  ZA: 'África',
  QA: 'Asia',
};
