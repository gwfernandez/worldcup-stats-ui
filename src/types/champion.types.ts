import { z } from 'zod';

export const ChampionTeamSummarySchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const ChampionSchema = z.object({
  team: ChampionTeamSummarySchema,
  wins: z.number(),
  years: z.array(z.number()),
  confederationCode: z.string(),
});

export const ChampionListSchema = z.array(ChampionSchema);

export const ChampionPaginationSchema = z.object({
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const ChampionListResponseSchema = z.object({
  data: ChampionListSchema,
  pagination: ChampionPaginationSchema,
});

export const ChampionFinalSchema = z.object({
  year: z.number(),
  hostCodes: z.array(ChampionTeamSummarySchema),
  matchDate: z.string().nullable(),
  matchTime: z.string().nullable(),
  homeTeam: ChampionTeamSummarySchema,
  homeTeamScore: z.number().nullable(),
  homeTeamScorePenalties: z.number().nullable(),
  awayTeam: ChampionTeamSummarySchema,
  awayTeamScore: z.number().nullable(),
  awayTeamScorePenalties: z.number().nullable(),
});

export const ChampionFinalListSchema = z.array(ChampionFinalSchema);

export const ChampionFinalListResponseSchema = z.object({
  data: ChampionFinalListSchema,
  pagination: ChampionPaginationSchema,
});

export type Champion = z.infer<typeof ChampionSchema>;
export type ChampionList = z.infer<typeof ChampionListSchema>;
export type ChampionPagination = z.infer<typeof ChampionPaginationSchema>;
export type ChampionListResponse = z.infer<typeof ChampionListResponseSchema>;
export type ChampionFinal = z.infer<typeof ChampionFinalSchema>;
export type ChampionFinalList = z.infer<typeof ChampionFinalListSchema>;
export type ChampionFinalListResponse = z.infer<typeof ChampionFinalListResponseSchema>;
