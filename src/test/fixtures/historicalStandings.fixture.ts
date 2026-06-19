import type {
  HistoricalStandingList,
  HistoricalStandingListResponse,
} from '@/types/historicalStanding.types';

export const HISTORICAL_STANDINGS_FIXTURE: HistoricalStandingList = [
  {
    team: {
      code: 'BRA',
      name: 'Brasil',
    },
    confederationCode: 'CONMEBOL',
    matchesPlayed: 114,
    wins: 79,
    draws: 14,
    losses: 21,
    goalsFor: 237,
    goalsAgainst: 108,
    goalDifference: 129,
    points: 193,
    unifiedPoints: 237,
    position: 1,
    unifiedPosition: 1,
  },
  {
    team: {
      code: 'GER',
      name: 'Alemania',
    },
    confederationCode: 'UEFA',
    matchesPlayed: 112,
    wins: 68,
    draws: 21,
    losses: 23,
    goalsFor: 232,
    goalsAgainst: 130,
    goalDifference: 102,
    points: 157,
    unifiedPoints: 225,
    position: 2,
    unifiedPosition: 2,
  },
];

export const HISTORICAL_STANDINGS_RESPONSE_FIXTURE: HistoricalStandingListResponse = {
  data: HISTORICAL_STANDINGS_FIXTURE,
  pagination: {
    page: 1,
    size: 100,
    totalElements: HISTORICAL_STANDINGS_FIXTURE.length,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};
