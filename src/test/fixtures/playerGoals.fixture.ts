import type { PlayerGoalListResponse } from '@/types/scorer.types';

export const PLAYER_GOALS_RESPONSE_FIXTURE: PlayerGoalListResponse = {
  data: [
    {
      year: 1950,
      hosts: [{ code: 'BRA', name: 'Brasil' }],
      matchDate: '1950-06-24',
      opponentTeam: { code: 'MEX', name: 'México' },
      minuteRegular: 30,
      penalty: false,
      stage: 'group_stage',
    },
    {
      year: 1950,
      hosts: [{ code: 'BRA', name: 'Brasil' }],
      matchDate: '1950-07-01',
      opponentTeam: { code: 'YUG', name: 'Yugoslavia' },
      minuteRegular: 80,
      penalty: true,
      stage: 'group_stage',
    },
    {
      year: 1950,
      hosts: [],
      matchDate: null,
      opponentTeam: { code: 'ESP', name: 'España' },
      minuteRegular: 57,
      penalty: null,
      stage: null,
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

export const PLAYER_GOALS_FIXTURE = PLAYER_GOALS_RESPONSE_FIXTURE.data;
