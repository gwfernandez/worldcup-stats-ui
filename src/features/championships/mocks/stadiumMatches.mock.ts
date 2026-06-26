import type { Match } from '@/types/championship.types';

export const MOCK_STADIUM_MATCHES: Match[] = [
  {
    id: 1,
    date: '21 Jun',
    homeTeam: 'Brasil',
    homeTeamCode: 'BR',
    awayTeam: 'Italia',
    awayTeamCode: 'IT',
    homeScore: 4,
    awayScore: 1,
    stadium: 'Estadio de ejemplo',
    attendance: 107000,
    phase: 'Final',
    goals: [
      { id: 1, minute: 18, playerName: 'Pele', teamCode: 'BR', type: 'header' },
      { id: 2, minute: 37, playerName: 'Boninsegna', teamCode: 'IT', type: 'normal' },
      { id: 3, minute: 66, playerName: 'Gerson', teamCode: 'BR', type: 'normal' },
      { id: 4, minute: 71, playerName: 'Jairzinho', teamCode: 'BR', type: 'normal' },
      { id: 5, minute: 86, playerName: 'Carlos Alberto', teamCode: 'BR', type: 'normal' },
    ],
  },
];
