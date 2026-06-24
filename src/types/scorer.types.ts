import { z } from 'zod';

export const ScorerSchema = z.object({
  playerId: z.number(),
  fullName: z.string(),
  team: z.object({
    code: z.string(),
    name: z.string(),
  }),
  goals: z.number(),
});

export const ScorerListSchema = z.array(ScorerSchema);

export const ScorerPaginationSchema = z.object({
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const ScorerListResponseSchema = z.object({
  data: ScorerListSchema,
  pagination: ScorerPaginationSchema,
});

export const PlayerGoalTeamSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const PlayerGoalSchema = z.object({
  year: z.number(),
  hosts: z.array(PlayerGoalTeamSchema),
  matchDate: z.string().nullable(),
  opponentTeam: PlayerGoalTeamSchema,
  minuteRegular: z.number(),
  penalty: z.boolean().nullable(),
  stage: z.string().nullable(),
});

export const PlayerGoalListSchema = z.array(PlayerGoalSchema);

export const PlayerGoalListResponseSchema = z.object({
  data: PlayerGoalListSchema,
  pagination: ScorerPaginationSchema,
});

export type Scorer = z.infer<typeof ScorerSchema>;
export type ScorerList = z.infer<typeof ScorerListSchema>;
export type ScorerPagination = z.infer<typeof ScorerPaginationSchema>;
export type ScorerListResponse = z.infer<typeof ScorerListResponseSchema>;
export type PlayerGoalTeam = z.infer<typeof PlayerGoalTeamSchema>;
export type PlayerGoal = z.infer<typeof PlayerGoalSchema>;
export type PlayerGoalList = z.infer<typeof PlayerGoalListSchema>;
export type PlayerGoalListResponse = z.infer<typeof PlayerGoalListResponseSchema>;
