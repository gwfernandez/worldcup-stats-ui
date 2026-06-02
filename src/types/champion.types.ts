import { z } from 'zod';

// ─── Título individual ────────────────────────────────────────────────────────

export const ChampionWinnerSchema = z.object({
  year: z.number(),
  host: z.string(),
  hostCode: z.string(),
  finalScore: z.string(), // ej: "4–1", "0–0 (pen)"
  finalOpponent: z.string(), // ej: "Italia"
  finalOpponentCode: z.string(),
});

export type ChampionWinner = z.infer<typeof ChampionWinnerSchema>;

// ─── Champion team ────────────────────────────────────────────────────────────

export const ChampionTeamSchema = z.object({
  position: z.number(),
  teamName: z.string(),
  teamCode: z.string(),
  confederation: z.string(),
  titles: z.number(),
  championships: z.array(ChampionWinnerSchema),
});

export const ChampionTeamListSchema = z.array(ChampionTeamSchema);

export type ChampionTeam = z.infer<typeof ChampionTeamSchema>;
export type ChampionTeamList = z.infer<typeof ChampionTeamListSchema>;
