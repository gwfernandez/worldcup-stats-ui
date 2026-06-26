import type { ChampionshipStadiumListResponse } from '@/types/stadium.types';

export const CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE: ChampionshipStadiumListResponse = {
  data: [
    {
      id: 1,
      name: 'Estadio Centenario',
      cityName: 'Montevideo',
      country: { code: 'URY', name: 'Uruguay' },
      capacity: 90000,
      matchesPlayed: 10,
    },
    {
      id: 2,
      name: 'Maracana',
      cityName: 'Rio de Janeiro',
      country: { code: 'BRA', name: 'Brasil' },
      capacity: 78838,
      matchesPlayed: 8,
    },
    {
      id: 3,
      name: 'Estadio sin pais',
      cityName: 'Ciudad prueba',
      country: null,
      capacity: 30000,
      matchesPlayed: 1,
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

export const CHAMPIONSHIP_STADIUMS_FIXTURE = CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE.data;
