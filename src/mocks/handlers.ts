import { http, HttpResponse } from 'msw';
import { MOCK_CHAMPIONS } from '@/features/champions/mocks/champions.mock';
import { MOCK_CHAMPIONSHIPS } from '@/features/championships/mocks/championship.mock';
import { MOCK_HISTORICAL_SCORERS } from '@/features/historicalScorers/mocks/historicalScorers.mock';
import { MOCK_HISTORICAL_STANDINGS } from '@/features/historicalStandings/mocks/historicalStandings.mock';

export const handlers = [
  http.get('*/worldcups', () => HttpResponse.json(MOCK_CHAMPIONSHIPS)),
  http.get('*/champions', () => HttpResponse.json(MOCK_CHAMPIONS)),
  http.get('*/historical/scorers', () => HttpResponse.json(MOCK_HISTORICAL_SCORERS)),
  http.get('*/historical/standings', () => HttpResponse.json(MOCK_HISTORICAL_STANDINGS)),
];
