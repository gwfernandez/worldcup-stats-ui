import { z } from 'zod';

// ─── Goal detail (dentro del popup) ──────────────────────────────────────────

export const ScorerGoalDetailSchema = z.object({
  id: z.number(),
  date: z.string(),
  minute: z.number(),
  rivalTeam: z.string(),
  rivalTeamCode: z.string(),
  phase: z.string(),
});

// ─── Scorer ───────────────────────────────────────────────────────────────────

export const ScorerSchema = z.object({
  id: z.number(),
  playerName: z.string(),
  teamName: z.string(),
  teamCode: z.string(),
  totalGoals: z.number(),
  matchesPlayed: z.number(),
  average: z.number(),
  goals: z.array(ScorerGoalDetailSchema),
});

export const ScorerListSchema = z.array(ScorerSchema);

export type ScorerGoalDetail = z.infer<typeof ScorerGoalDetailSchema>;
export type Scorer = z.infer<typeof ScorerSchema>;
export type ScorerList = z.infer<typeof ScorerListSchema>;
