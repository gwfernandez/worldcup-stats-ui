import { http, HttpResponse } from 'msw';
import { CHAMPIONS_RESPONSE_FIXTURE } from '@/test/fixtures/champions.fixture';
import { CHAMPION_FINALS_RESPONSE_FIXTURE } from '@/test/fixtures/championFinals.fixture';
import { HISTORICAL_STANDINGS_RESPONSE_FIXTURE } from '@/test/fixtures/historicalStandings.fixture';
import { HISTORICAL_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/historicalScorers.fixture';
import { HISTORICAL_SCORER_DETAIL_FIXTURE } from '@/test/fixtures/historicalScorerDetail.fixture';
import { TEAMS_RESPONSE_FIXTURE } from '@/test/fixtures/teams.fixture';
import { CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipTeams.fixture';
import { CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE } from '@/test/fixtures/championshipSquad.fixture';
import { MOCK_CHAMPIONSHIPS_RESPONSE } from '@/features/championships/mocks/championship.mock';

export const handlers = [
  http.get('*/api/championships', () => HttpResponse.json(MOCK_CHAMPIONSHIPS_RESPONSE)),
  http.get('*/api/championships/:year/teams', () =>
    HttpResponse.json(CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE),
  ),
  http.get('*/api/championships/:year/squads/:teamCode', () =>
    HttpResponse.json(CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE),
  ),
  http.get('*/api/champions', () => HttpResponse.json(CHAMPIONS_RESPONSE_FIXTURE)),
  http.get('*/api/champions/:teamCode', () => HttpResponse.json(CHAMPION_FINALS_RESPONSE_FIXTURE)),
  http.get('*/api/standings', () => HttpResponse.json(HISTORICAL_STANDINGS_RESPONSE_FIXTURE)),
  http.get('*/api/scorers', () => HttpResponse.json(HISTORICAL_SCORERS_RESPONSE_FIXTURE)),
  http.get('*/api/scorers/:playerId', () => HttpResponse.json(HISTORICAL_SCORER_DETAIL_FIXTURE)),
  http.get('*/api/teams', () => HttpResponse.json(TEAMS_RESPONSE_FIXTURE)),
];
