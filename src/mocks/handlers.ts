import { http, HttpResponse } from 'msw';
import { MOCK_CHAMPIONS_RESPONSE } from '@/features/champions/mocks/champions.mock';
import { MOCK_CHAMPIONSHIPS_RESPONSE } from '@/features/championships/mocks/championship.mock';
import { MOCK_HISTORICAL_SCORERS } from '@/features/historicalScorers/mocks/historicalScorers.mock';
import { MOCK_HISTORICAL_STANDINGS } from '@/features/historicalStandings/mocks/historicalStandings.mock';

export const handlers = [
  http.get('*/api/championships', () => HttpResponse.json(MOCK_CHAMPIONSHIPS_RESPONSE)),
  http.get('*/api/champions', () => HttpResponse.json(MOCK_CHAMPIONS_RESPONSE)),
  http.get('*/historical/scorers', () => HttpResponse.json(MOCK_HISTORICAL_SCORERS)),
  http.get('*/historical/standings', () => HttpResponse.json(MOCK_HISTORICAL_STANDINGS)),
];
