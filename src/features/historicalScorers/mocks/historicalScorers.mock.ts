import type { HistoricalScorerDetail } from '@/types/historicalScorer.types';

/**
 * Detalle temporal del modal. No representa el contrato de `GET /api/scorers`.
 * Se reemplazará cuando exista un endpoint de detalle por jugador.
 */
export const MOCK_MESSI_SCORER_DETAIL: HistoricalScorerDetail = {
  playerName: 'Lionel Messi',
  teamName: 'Argentina',
  teamCode: 'ARG',
  confederation: 'CONMEBOL',
  totalGoals: 13,
  totalMatches: 26,
  average: 0.5,
  worldCups: [
    {
      year: 2006,
      host: 'Alemania',
      hostCode: 'GER',
      goals: 1,
      matches: 3,
      average: 0.33,
      medal: null,
      performance: 'Cuartos',
    },
    {
      year: 2010,
      host: 'Sudáfrica',
      hostCode: 'RSA',
      goals: 0,
      matches: 5,
      average: 0,
      medal: null,
      performance: 'Cuartos',
    },
    {
      year: 2014,
      host: 'Brasil',
      hostCode: 'BRA',
      goals: 4,
      matches: 7,
      average: 0.57,
      medal: 'silver',
      performance: 'Subcampeón',
    },
    {
      year: 2018,
      host: 'Rusia',
      hostCode: 'RUS',
      goals: 1,
      matches: 4,
      average: 0.25,
      medal: null,
      performance: 'Octavos',
    },
    {
      year: 2022,
      host: 'Qatar',
      hostCode: 'QAT',
      goals: 7,
      matches: 7,
      average: 1,
      medal: 'gold',
      performance: 'Campeón',
    },
  ],
};
