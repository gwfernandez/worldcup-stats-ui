import type { ChampionshipSquadResponse } from '@/types/team.types';

export const CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE: ChampionshipSquadResponse = {
  data: [
    {
      playerId: 10,
      firstName: 'Alcides',
      lastName: 'Ghiggia',
      position: 'forward',
      shirtNumber: 7,
    },
    {
      playerId: 1,
      firstName: 'Roque',
      lastName: 'Máspoli',
      position: 'goalkeeper',
      shirtNumber: 1,
    },
    {
      playerId: 6,
      firstName: 'Obdulio',
      lastName: 'Varela',
      position: null,
      shirtNumber: null,
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

export const CHAMPIONSHIP_SQUAD_FIXTURE = CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE.data;
