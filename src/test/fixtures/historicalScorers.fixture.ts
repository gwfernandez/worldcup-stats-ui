import type { HistoricalScorerListResponse } from '@/types/historicalScorer.types';

export const HISTORICAL_SCORERS_RESPONSE_FIXTURE: HistoricalScorerListResponse = {
  data: [
    {
      playerId: 1,
      fullName: 'Miroslav Klose',
      team: {
        code: 'GER',
        name: 'Alemania',
      },
      goals: 16,
      listTeams: ['GER'],
      confederationCode: 'UEFA',
    },
    {
      playerId: 1524,
      fullName: 'Lionel Messi',
      team: {
        code: 'ARG',
        name: 'Argentina',
      },
      goals: 13,
      listTeams: ['ARG'],
      confederationCode: 'CONMEBOL',
    },
  ],
  pagination: {
    page: 1,
    size: 10,
    totalElements: 2,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};
