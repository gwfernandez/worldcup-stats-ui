import { z } from 'zod';
import { PaginationInfoSchema } from '@/types/championship.types';

// ─── Championship stadiums API ────────────────────────────────────────────────

export const ChampionshipStadiumSchema = z.object({
  id: z.number(),
  name: z.string(),
  cityName: z.string(),
  country: z
    .object({
      code: z.string(),
      name: z.string(),
    })
    .nullable(),
  capacity: z.number(),
  matchesPlayed: z.number(),
});

export const ChampionshipStadiumListSchema = z.array(ChampionshipStadiumSchema);

export const ChampionshipStadiumListResponseSchema = z.object({
  data: ChampionshipStadiumListSchema,
  pagination: PaginationInfoSchema,
});

export const SimpleTeamSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const ChampionshipStadiumMatchSchema = z.object({
  year: z.number(),
  hosts: z.array(SimpleTeamSchema),
  stage: z.string().nullable(),
  groupCode: z.string().nullable(),
  matchDate: z.string().nullable(),
  matchTime: z.string().nullable(),
  homeTeam: SimpleTeamSchema,
  homeTeamScore: z.number().nullable(),
  homeTeamScorePenalties: z.number().nullable(),
  awayTeam: SimpleTeamSchema,
  awayTeamScore: z.number().nullable(),
  awayTeamScorePenalties: z.number().nullable(),
});

export const ChampionshipStadiumMatchListSchema = z.array(ChampionshipStadiumMatchSchema);

export const ChampionshipStadiumMatchListResponseSchema = z.object({
  data: ChampionshipStadiumMatchListSchema,
  pagination: PaginationInfoSchema,
});

export type ChampionshipStadium = z.infer<typeof ChampionshipStadiumSchema>;
export type ChampionshipStadiumList = z.infer<typeof ChampionshipStadiumListSchema>;
export type ChampionshipStadiumListResponse = z.infer<
  typeof ChampionshipStadiumListResponseSchema
>;
export type SimpleTeam = z.infer<typeof SimpleTeamSchema>;
export type ChampionshipStadiumMatch = z.infer<typeof ChampionshipStadiumMatchSchema>;
export type ChampionshipStadiumMatchList = z.infer<typeof ChampionshipStadiumMatchListSchema>;
export type ChampionshipStadiumMatchListResponse = z.infer<
  typeof ChampionshipStadiumMatchListResponseSchema
>;
