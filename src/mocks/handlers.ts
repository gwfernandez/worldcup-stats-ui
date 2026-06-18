import { http, HttpResponse } from 'msw';
import { CHAMPIONS_RESPONSE_FIXTURE } from '@/test/fixtures/champions.fixture';
import { CHAMPION_FINALS_RESPONSE_FIXTURE } from '@/test/fixtures/championFinals.fixture';
import { MOCK_CHAMPIONSHIPS_RESPONSE } from '@/features/championships/mocks/championship.mock';
import { MOCK_HISTORICAL_SCORERS } from '@/features/historicalScorers/mocks/historicalScorers.mock';
import { MOCK_HISTORICAL_STANDINGS } from '@/features/historicalStandings/mocks/historicalStandings.mock';

export const handlers = [
  http.get('*/api/championships', () => HttpResponse.json(MOCK_CHAMPIONSHIPS_RESPONSE)),
  http.get('*/api/champions', () => HttpResponse.json(CHAMPIONS_RESPONSE_FIXTURE)),
  http.get('*/api/champions/:teamCode', () => HttpResponse.json(CHAMPION_FINALS_RESPONSE_FIXTURE)),
  http.get('*/historical/scorers', () => HttpResponse.json(MOCK_HISTORICAL_SCORERS)),
  http.get('*/historical/standings', () => HttpResponse.json(MOCK_HISTORICAL_STANDINGS)),
];
