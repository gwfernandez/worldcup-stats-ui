import { z } from 'zod';

// ─── Detalle por mundial ──────────────────────────────────────────────────────

export const ScorerWorldCupDetailSchema = z.object({
  year: z.number(),
  host: z.string(),
  hostCode: z.string(),
  goals: z.number(),
  matches: z.number(),
  average: z.number(),
  /** null = no llegó a instancia con medalla */
  medal: z.enum(['gold', 'silver', 'bronze']).nullable(),
  performance: z.string(), // ej: "Campeón", "Subcampeón", "3er Puesto", "Cuartos", etc.
});

export type ScorerWorldCupDetail = z.infer<typeof ScorerWorldCupDetailSchema>;

// ─── Historical Scorer ────────────────────────────────────────────────────────

export const HistoricalScorerSchema = z.object({
  id: z.number(),
  playerName: z.string(),
  teamName: z.string(),
  teamCode: z.string(),
  confederation: z.string(),
  totalGoals: z.number(),
  totalMatches: z.number(),
  average: z.number(),
  worldCups: z.array(ScorerWorldCupDetailSchema),
});

export const HistoricalScorerListSchema = z.array(HistoricalScorerSchema);

export type HistoricalScorer = z.infer<typeof HistoricalScorerSchema>;
export type HistoricalScorerList = z.infer<typeof HistoricalScorerListSchema>;

// ─── Medal config ─────────────────────────────────────────────────────────────

export const MEDAL_LABEL: Record<string, string> = {
  gold: '🏆',
  silver: '🥈',
  bronze: '🥉',
};
