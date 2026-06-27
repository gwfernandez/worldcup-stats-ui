import { z } from 'zod';
import { PaginationInfoSchema } from '@/types/championship.types';
import { ChampionshipTeamStageReachedSchema } from '@/types/team.types';

// ─── Standing ─────────────────────────────────────────────────────────────────

export const StandingSchema = z.object({
  team: z.object({
    code: z.string(),
    name: z.string(),
  }),
  groupCode: z.string(),
  matchesPlayed: z.number(),
  wins: z.number(),
  draws: z.number(),
  losses: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  goalDifference: z.number(),
  points: z.number(),
  unifiedPoints: z.number(),
  position: z.number(),
  performance: ChampionshipTeamStageReachedSchema,
});

export const StandingListSchema = z.array(StandingSchema);

export const StandingListResponseSchema = z.object({
  data: StandingListSchema,
  pagination: PaginationInfoSchema,
});

export type Standing = z.infer<typeof StandingSchema>;
export type StandingList = z.infer<typeof StandingListSchema>;
export type StandingListResponse = z.infer<typeof StandingListResponseSchema>;
