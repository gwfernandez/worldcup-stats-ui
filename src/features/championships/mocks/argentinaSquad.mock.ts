import type { Team } from '@/types/team.types';

export const ARGENTINA_SQUAD_MOCK: Team = {
  id: 1,
  name: 'Argentina',
  teamCode: 'ARG',
  confederation: 'CONMEBOL',
  group: 'Grupo 1',
  coach: 'Guillermo Stábile',
  performance: 'runner_up',
  players: [
    {
      id: 1,
      number: 1,
      firstName: 'Antonio',
      lastName: 'Roma',
      position: 'goalkeeper',
    },
    {
      id: 2,
      number: 2,
      firstName: 'José',
      lastName: 'Ramos Delgado',
      position: 'defender',
    },
    {
      id: 3,
      number: 5,
      firstName: 'Néstor',
      lastName: 'Rossi',
      position: 'midfielder',
    },
    {
      id: 4,
      number: 10,
      firstName: 'Omar',
      lastName: 'Sívori',
      position: 'forward',
    },
  ],
};
