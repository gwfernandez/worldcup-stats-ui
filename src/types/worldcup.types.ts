import { z } from 'zod';

// ─── Esquemas Zod ─────────────────────────────────────────────────────────────

export const WorldCupSchema = z.object({
  id: z.number(),
  year: z.number(),
  country: z.string(),
  countryCode: z.string(),
  champion: z.string().nullable(),
  championCode: z.string().nullable(),
});

export const WorldCupListSchema = z.array(WorldCupSchema);

// ─── Tipos derivados ──────────────────────────────────────────────────────────

/** Edición del mundial con su sede y campeón. */
export type WorldCup = z.infer<typeof WorldCupSchema>;

/** Lista de mundiales. */
export type WorldCupList = z.infer<typeof WorldCupListSchema>;
