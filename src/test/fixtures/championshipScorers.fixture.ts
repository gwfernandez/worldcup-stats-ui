import type { ScorerListResponse } from '@/types/scorer.types';

export const CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE: ScorerListResponse = {
  data: [
    {
      playerId: 101,
      fullName: 'Ademir',
      team: { code: 'BRA', name: 'Brasil' },
      goals: 8,
    },
    {
      playerId: 102,
      fullName: 'Oscar Miguez',
      team: { code: 'URY', name: 'Uruguay' },
      goals: 5,
    },
    {
      playerId: 103,
      fullName: 'Chico',
      team: { code: 'BRA', name: 'Brasil' },
      goals: 4,
    },
  ],
  pagination: {
    page: 1,
    size: 10,
    totalElements: 3,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};

export const CHAMPIONSHIP_SCORERS_FIXTURE = CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE.data;
