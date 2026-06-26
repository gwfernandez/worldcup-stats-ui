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

export type ChampionshipStadium = z.infer<typeof ChampionshipStadiumSchema>;
export type ChampionshipStadiumList = z.infer<typeof ChampionshipStadiumListSchema>;
export type ChampionshipStadiumListResponse = z.infer<
  typeof ChampionshipStadiumListResponseSchema
>;
