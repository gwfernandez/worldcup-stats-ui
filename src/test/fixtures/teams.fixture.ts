import type { NationalTeamListResponse } from '@/types/team.types';

export const TEAMS_RESPONSE_FIXTURE: NationalTeamListResponse = {
  data: [
    {
      code: 'ARG',
      name: 'Argentina',
      isDissolved: false,
      confederationCode: 'CONMEBOL',
      federationName: 'Asociación del Fútbol Argentino',
      federationCode: 'AFA',
      dissolutionDate: null,
    },
    {
      code: 'URS',
      name: 'Unión Soviética',
      isDissolved: true,
      confederationCode: 'UEFA',
      federationName: 'Football Federation of the USSR',
      federationCode: 'FFUSSR',
      dissolutionDate: '1991-12-26',
    },
  ],
  pagination: {
    page: 1,
    size: 100,
    totalElements: 2,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};
