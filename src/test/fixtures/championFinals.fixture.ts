import type { ChampionFinalListResponse } from '@/types/champion.types';

export const CHAMPION_FINALS_RESPONSE_FIXTURE: ChampionFinalListResponse = {
  data: [
    {
      year: 1978,
      hostCodes: [{ code: 'ARG', name: 'Argentina' }],
      matchDate: '1978-06-25',
      matchTime: '15:00:00',
      homeTeam: { code: 'ARG', name: 'Argentina' },
      homeTeamScore: 3,
      homeTeamScorePenalties: null,
      awayTeam: { code: 'NLD', name: 'Países Bajos' },
      awayTeamScore: 1,
      awayTeamScorePenalties: null,
    },
    {
      year: 1986,
      hostCodes: [{ code: 'MEX', name: 'México' }],
      matchDate: '1986-06-29',
      matchTime: '12:00:00',
      homeTeam: { code: 'ARG', name: 'Argentina' },
      homeTeamScore: 3,
      homeTeamScorePenalties: null,
      awayTeam: { code: 'DEU', name: 'Alemania' },
      awayTeamScore: 2,
      awayTeamScorePenalties: null,
    },
    {
      year: 2022,
      hostCodes: [
        { code: 'QAT', name: 'Qatar' },
        { code: 'ARE', name: 'Emiratos Árabes Unidos' },
      ],
      matchDate: '2022-12-18',
      matchTime: '18:00:00',
      homeTeam: { code: 'FRA', name: 'Francia' },
      homeTeamScore: 3,
      homeTeamScorePenalties: 2,
      awayTeam: { code: 'ARG', name: 'Argentina' },
      awayTeamScore: 3,
      awayTeamScorePenalties: 4,
    },
  ],
  pagination: {
    page: 1,
    size: 20,
    totalElements: 3,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};
