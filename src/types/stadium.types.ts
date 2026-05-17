import { z } from 'zod';
import { MatchSchema } from '@/types/worldcup.types';

// ─── Stadium ──────────────────────────────────────────────────────────────────

export const StadiumSchema = z.object({
  id: z.number(),
  name: z.string(),
  city: z.string(),
  capacity: z.number().nullable(),
  mapsUrl: z.string().url().nullable(),
  matches: z.array(MatchSchema),
});

export const StadiumListSchema = z.array(StadiumSchema);

export type Stadium = z.infer<typeof StadiumSchema>;
export type StadiumList = z.infer<typeof StadiumListSchema>;
