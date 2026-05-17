import { z } from 'zod';
import { TeamPerformanceSchema } from '@/types/team.types';

// ─── Resultado de partido (para forma) ───────────────────────────────────────

export const MatchResultSchema = z.enum(['W', 'D', 'L']);
export type MatchResult = z.infer<typeof MatchResultSchema>;

// ─── Standing ─────────────────────────────────────────────────────────────────

export const StandingSchema = z.object({
  position: z.number(),
  teamName: z.string(),
  teamCode: z.string(),
  isHost: z.boolean(),
  performance: TeamPerformanceSchema,
  played: z.number(),
  won: z.number(),
  drawn: z.number(),
  lost: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  goalDiff: z.number(),
  points: z.number(),
  form: z.array(MatchResultSchema),
});

export const StandingListSchema = z.array(StandingSchema);

export type Standing = z.infer<typeof StandingSchema>;
export type StandingList = z.infer<typeof StandingListSchema>;
