import type { ChampionshipStadiumMatchListResponse } from '@/types/stadium.types';

export const CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE: ChampionshipStadiumMatchListResponse =
  {
    data: [
      {
        year: 1930,
        hosts: [{ code: 'URY', name: 'Uruguay' }],
        stage: 'group_stage',
        groupCode: '1',
        matchDate: '1930-07-13',
        matchTime: '15:00:00',
        homeTeam: { code: 'FRA', name: 'Francia' },
        homeTeamScore: 4,
        homeTeamScorePenalties: null,
        awayTeam: { code: 'MEX', name: 'Mexico' },
        awayTeamScore: 1,
        awayTeamScorePenalties: null,
      },
      {
        year: 1930,
        hosts: [{ code: 'URY', name: 'Uruguay' }],
        stage: 'final',
        groupCode: null,
        matchDate: '1930-07-30',
        matchTime: '15:30:00',
        homeTeam: { code: 'URY', name: 'Uruguay' },
        homeTeamScore: 4,
        homeTeamScorePenalties: null,
        awayTeam: { code: 'ARG', name: 'Argentina' },
        awayTeamScore: 2,
        awayTeamScorePenalties: null,
      },
      {
        year: 1930,
        hosts: [{ code: 'URY', name: 'Uruguay' }],
        stage: null,
        groupCode: null,
        matchDate: null,
        matchTime: null,
        homeTeam: { code: 'BRA', name: 'Brasil' },
        homeTeamScore: null,
        homeTeamScorePenalties: null,
        awayTeam: { code: 'YUG', name: 'Yugoslavia' },
        awayTeamScore: null,
        awayTeamScorePenalties: null,
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

export const CHAMPIONSHIP_STADIUM_MATCHES_FIXTURE =
  CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE.data;
