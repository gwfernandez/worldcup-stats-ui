import type { ChampionshipTeamListResponse } from '@/types/team.types';

export const CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE: ChampionshipTeamListResponse = {
  data: [
    {
      year: 1950,
      team: { code: 'URY', name: 'Uruguay' },
      confederationCode: 'CONMEBOL',
      groupCode: '4',
      stageReached: 'champion',
      managers: 'Juan López Fontana',
    },
    {
      year: 1950,
      team: { code: 'BRA', name: 'Brasil' },
      confederationCode: 'CONMEBOL',
      groupCode: '1',
      stageReached: 'runner_up',
      managers: 'Flávio Costa',
    },
    {
      year: 1950,
      team: { code: 'ENG', name: 'Inglaterra' },
      confederationCode: 'UEFA',
      groupCode: '2',
      stageReached: 'quarterfinal',
      managers: '',
    },
  ],
  pagination: {
    page: 1,
    size: 100,
    totalElements: 3,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};

export const CHAMPIONSHIP_TEAMS_FIXTURE = CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE.data;
