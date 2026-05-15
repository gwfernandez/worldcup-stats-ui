import { z } from 'zod';

// ─── Confederación ────────────────────────────────────────────────────────────

export const CONFEDERATION_STYLES: Record<
  string,
  {
    pill: string;
    bar: string;
    perfBar: string;
  }
> = {
  CONMEBOL: {
    pill: 'bg-[#1a2a1a] text-[#7ac470] border-[#3a6a3a]',
    bar: '#4a9a4a',
    perfBar: '#4a9a4a',
  },
  UEFA: {
    pill: 'bg-[#1a1e2e] text-[#7090d0] border-[#2a3a6a]',
    bar: '#4a78d4',
    perfBar: '#4a78d4',
  },
  CONCACAF: {
    pill: 'bg-[#2a1e10] text-[#d09050] border-[#6a4a20]',
    bar: '#d4874a',
    perfBar: '#d4874a',
  },
  CAF: { pill: 'bg-[#2a1a10] text-[#d07040] border-[#6a3a10]', bar: '#c05030', perfBar: '#c05030' },
  AFC: { pill: 'bg-[#1a1e2a] text-[#7080a0] border-[#2a3050]', bar: '#607090', perfBar: '#607090' },
  OFC: { pill: 'bg-[#1a2a2a] text-[#70a0a0] border-[#2a5050]', bar: '#409090', perfBar: '#409090' },
};

export const CONFEDERATION_TOOLTIP: Record<string, string> = {
  CONMEBOL: 'Confederación Sudamericana de Fútbol',
  UEFA: 'Unión de Asociaciones Europeas de Fútbol',
  CONCACAF: 'Confederación de Norte, Centroamérica y el Caribe',
  CAF: 'Confederación Africana de Fútbol',
  AFC: 'Confederación Asiática de Fútbol',
  OFC: 'Confederación de Fútbol de Oceanía',
};

// ─── Historical Standing ──────────────────────────────────────────────────────

export const HistoricalStandingSchema = z.object({
  position: z.number(),
  teamName: z.string(),
  teamCode: z.string(),
  confederation: z.string(),
  points: z.number(),
  played: z.number(),
  won: z.number(),
  drawn: z.number(),
  lost: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  goalDiff: z.number(),
});

export const HistoricalStandingListSchema = z.array(HistoricalStandingSchema);

export type HistoricalStanding = z.infer<typeof HistoricalStandingSchema>;
export type HistoricalStandingList = z.infer<typeof HistoricalStandingListSchema>;
