import { z } from 'zod';

export const HistoricalScorerTeamSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const HistoricalScorerSchema = z.object({
  playerId: z.number(),
  fullName: z.string(),
  team: HistoricalScorerTeamSchema,
  goals: z.number(),
  listTeams: z.array(z.string()),
  confederationCode: z.string(),
});

export const HistoricalScorerListSchema = z.array(HistoricalScorerSchema);

export const HistoricalScorerPaginationSchema = z.object({
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const HistoricalScorerListResponseSchema = z.object({
  data: HistoricalScorerListSchema,
  pagination: HistoricalScorerPaginationSchema,
});

export type HistoricalScorer = z.infer<typeof HistoricalScorerSchema>;
export type HistoricalScorerList = z.infer<typeof HistoricalScorerListSchema>;
export type HistoricalScorerPagination = z.infer<typeof HistoricalScorerPaginationSchema>;
export type HistoricalScorerListResponse = z.infer<typeof HistoricalScorerListResponseSchema>;

export const HistoricalScorerGoalSchema = z.object({
  year: z.number(),
  hosts: z.array(HistoricalScorerTeamSchema),
  matchDate: z.string().nullable(),
  opponentTeam: HistoricalScorerTeamSchema,
  minuteRegular: z.number(),
  penalty: z.boolean().nullable(),
  stage: z.string().nullable(),
});

export const HistoricalScorerDetailSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  position: z.string().nullable(),
  championships: z.array(z.number()),
  teams: z.array(HistoricalScorerTeamSchema),
  goals: z.array(HistoricalScorerGoalSchema),
});

export type HistoricalScorerGoal = z.infer<typeof HistoricalScorerGoalSchema>;
export type HistoricalScorerDetail = z.infer<typeof HistoricalScorerDetailSchema>;
