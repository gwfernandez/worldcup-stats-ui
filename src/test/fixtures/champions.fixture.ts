import type { ChampionListResponse } from '@/types/champion.types';

export const CHAMPIONS_RESPONSE_FIXTURE: ChampionListResponse = {
  data: [
    {
      team: { code: 'BRA', name: 'Brasil' },
      wins: 5,
      years: [1958, 1962, 1970, 1994, 2002],
      confederationCode: 'CONMEBOL',
    },
    {
      team: { code: 'DEU', name: 'Alemania' },
      wins: 4,
      years: [1954, 1974, 1990, 2014],
      confederationCode: 'UEFA',
    },
    {
      team: { code: 'ITA', name: 'Italia' },
      wins: 4,
      years: [1934, 1938, 1982, 2006],
      confederationCode: 'UEFA',
    },
    {
      team: { code: 'ARG', name: 'Argentina' },
      wins: 3,
      years: [1978, 1986, 2022],
      confederationCode: 'CONMEBOL',
    },
    {
      team: { code: 'FRA', name: 'Francia' },
      wins: 2,
      years: [1998, 2018],
      confederationCode: 'UEFA',
    },
    {
      team: { code: 'URY', name: 'Uruguay' },
      wins: 2,
      years: [1930, 1950],
      confederationCode: 'CONMEBOL',
    },
    {
      team: { code: 'ENG', name: 'Inglaterra' },
      wins: 1,
      years: [1966],
      confederationCode: 'UEFA',
    },
    {
      team: { code: 'ESP', name: 'España' },
      wins: 1,
      years: [2010],
      confederationCode: 'UEFA',
    },
  ],
  pagination: {
    page: 1,
    size: 15,
    totalElements: 8,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};

export const CHAMPIONS_FIXTURE = CHAMPIONS_RESPONSE_FIXTURE.data;
