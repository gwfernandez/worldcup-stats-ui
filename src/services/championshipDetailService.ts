import { z } from 'zod';
import {
  EliminationPhaseListSchema,
  GroupListSchema,
  type EliminationPhaseList,
  type GroupList,
} from '@/types/championship.types';
import { StadiumListSchema, type StadiumList } from '@/types/stadium.types';
import { StandingListSchema, type StandingList } from '@/types/standing.types';
import {
  MOCK_ELIMINATION_PHASES,
  MOCK_GROUPS,
} from '@/features/championships/mocks/championshipDetail.mock';
import { MOCK_STADIUMS } from '@/features/championships/mocks/stadiums.mock';
import { MOCK_STANDINGS } from '@/features/championships/mocks/standings.mock';

export const ChampionshipDetailSchema = z.object({
  year: z.number(),
  country: z.string(),
  champion: z.string(),
  runnerUp: z.string(),
  topScorer: z.string(),
  topScorerGoals: z.number(),
  totalTeams: z.number(),
  totalMatches: z.number(),
  totalGoals: z.number(),
  totalStadiums: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  groups: GroupListSchema,
  eliminationPhases: EliminationPhaseListSchema,
  stadiums: StadiumListSchema,
  standings: StandingListSchema,
});

export interface ChampionshipDetail {
  year: number;
  country: string;
  champion: string;
  runnerUp: string;
  topScorer: string;
  topScorerGoals: number;
  totalTeams: number;
  totalMatches: number;
  totalGoals: number;
  totalStadiums: number;
  startDate: string;
  endDate: string;
  groups: GroupList;
  eliminationPhases: EliminationPhaseList;
  stadiums: StadiumList;
  standings: StandingList;
}

/**
 * Obtiene el detalle completo de un mundial.
 * Actualmente usa mocks locales hasta cerrar el contrato con worldcup-stats-service.
 */
export const getChampionshipDetail = async (year: number): Promise<ChampionshipDetail> => {
  const detail: ChampionshipDetail = {
    year,
    country: 'Mexico',
    champion: 'Brasil',
    runnerUp: 'Italia',
    topScorer: 'Gerd Müller',
    topScorerGoals: 10,
    totalTeams: 16,
    totalMatches: 32,
    totalGoals: 78,
    totalStadiums: 10,
    startDate: '1970-05-31',
    endDate: '1970-06-21',
    groups: MOCK_GROUPS,
    eliminationPhases: MOCK_ELIMINATION_PHASES,
    stadiums: MOCK_STADIUMS,
    standings: MOCK_STANDINGS,
  };

  return ChampionshipDetailSchema.parse(detail);
};
