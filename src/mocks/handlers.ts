import { http, HttpResponse } from 'msw';
import { CHAMPIONS_RESPONSE_FIXTURE } from '@/test/fixtures/champions.fixture';
import { CHAMPION_FINALS_RESPONSE_FIXTURE } from '@/test/fixtures/championFinals.fixture';
import { HISTORICAL_STANDINGS_RESPONSE_FIXTURE } from '@/test/fixtures/historicalStandings.fixture';
import { HISTORICAL_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/historicalScorers.fixture';
import { HISTORICAL_SCORER_DETAIL_FIXTURE } from '@/test/fixtures/historicalScorerDetail.fixture';
import { TEAMS_RESPONSE_FIXTURE } from '@/test/fixtures/teams.fixture';
import { CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipScorers.fixture';
import { CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipStadiums.fixture';
import { CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE } from '@/test/fixtures/championshipStadiumMatches.fixture';
import { CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipStandings.fixture';
import { CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipTeams.fixture';
import { CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE } from '@/test/fixtures/championshipSquad.fixture';
import { PLAYER_GOALS_RESPONSE_FIXTURE } from '@/test/fixtures/playerGoals.fixture';
import { MOCK_CHAMPIONSHIPS_RESPONSE } from '@/features/championships/mocks/championship.mock';

export const handlers = [
  http.get('*/api/championships', () => HttpResponse.json(MOCK_CHAMPIONSHIPS_RESPONSE)),
  http.get('*/api/championships/:year/teams', () =>
    HttpResponse.json(CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE),
  ),
  http.get('*/api/championships/:year/stadiums', () =>
    HttpResponse.json(CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE),
  ),
  http.get('*/api/championships/:year/stadiums/:stadiumId', () =>
    HttpResponse.json(CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE),
  ),
  http.get('*/api/championships/:year/squads/:teamCode', () =>
    HttpResponse.json(CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE),
  ),
  http.get('*/api/championships/:year/scorers', () =>
    HttpResponse.json(CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE),
  ),
  http.get('*/api/championships/:year/standings', () =>
    HttpResponse.json(CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE),
  ),
  http.get('*/api/champions', () => HttpResponse.json(CHAMPIONS_RESPONSE_FIXTURE)),
  http.get('*/api/champions/:teamCode', () => HttpResponse.json(CHAMPION_FINALS_RESPONSE_FIXTURE)),
  http.get('*/api/standings', () => HttpResponse.json(HISTORICAL_STANDINGS_RESPONSE_FIXTURE)),
  http.get('*/api/scorers', () => HttpResponse.json(HISTORICAL_SCORERS_RESPONSE_FIXTURE)),
  http.get('*/api/scorers/:playerId', () => HttpResponse.json(HISTORICAL_SCORER_DETAIL_FIXTURE)),
  http.get('*/api/players/:playerId/goals', () => HttpResponse.json(PLAYER_GOALS_RESPONSE_FIXTURE)),
  http.get('*/api/teams', () => HttpResponse.json(TEAMS_RESPONSE_FIXTURE)),
];
