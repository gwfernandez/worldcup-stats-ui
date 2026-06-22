import type { HistoricalScorerDetail } from '@/types/historicalScorer.types';

export const HISTORICAL_SCORER_DETAIL_FIXTURE: HistoricalScorerDetail = {
  id: 1524,
  firstName: 'Lionel',
  lastName: 'Messi',
  position: 'FW',
  championships: [2006, 2010, 2014, 2018, 2022],
  teams: [
    { code: 'ARG', name: 'Argentina' },
    { code: 'ESP', name: 'España' },
  ],
  goals: [
    {
      year: 2022,
      hosts: [
        { code: 'QAT', name: 'Catar' },
        { code: 'UAE', name: 'Emiratos Árabes Unidos' },
      ],
      matchDate: '2022-12-18',
      opponentTeam: { code: 'FRA', name: 'Francia' },
      minuteRegular: 23,
      penalty: true,
      stage: 'final',
    },
    {
      year: 2006,
      hosts: [],
      matchDate: null,
      opponentTeam: { code: 'SRB', name: 'Serbia' },
      minuteRegular: 88,
      penalty: null,
      stage: null,
    },
  ],
};
