import { z } from 'zod';

export const HistoricalScorerTeamSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const HistoricalScorerSchema = z.object({
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

export const ScorerWorldCupDetailSchema = z.object({
  year: z.number(),
  host: z.string(),
  hostCode: z.string(),
  goals: z.number(),
  matches: z.number(),
  average: z.number(),
  medal: z.enum(['gold', 'silver', 'bronze']).nullable(),
  performance: z.string(),
});

export const HistoricalScorerDetailSchema = z.object({
  playerName: z.string(),
  teamName: z.string(),
  teamCode: z.string(),
  confederation: z.string(),
  totalGoals: z.number(),
  totalMatches: z.number(),
  average: z.number(),
  worldCups: z.array(ScorerWorldCupDetailSchema),
});

export type HistoricalScorerDetail = z.infer<typeof HistoricalScorerDetailSchema>;

export const MEDAL_LABEL: Record<string, string> = {
  gold: '🏆',
  silver: '🥈',
  bronze: '🥉',
};
