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
    pill: 'bg-wc-conf-conmebol-surface text-wc-success-text border-wc-conf-conmebol-border',
    bar: 'var(--wc-conf-conmebol-bar)',
    perfBar: 'var(--wc-conf-conmebol-bar)',
  },
  UEFA: {
    pill: 'bg-wc-conf-uefa-surface text-wc-conf-uefa-text border-wc-conf-uefa-border',
    bar: 'var(--wc-conf-uefa-bar)',
    perfBar: 'var(--wc-conf-uefa-bar)',
  },
  CONCACAF: {
    pill: 'bg-wc-conf-concacaf-surface text-wc-conf-concacaf-text border-wc-conf-concacaf-border',
    bar: 'var(--wc-conf-concacaf-bar)',
    perfBar: 'var(--wc-conf-concacaf-bar)',
  },
  CAF: {
    pill: 'bg-wc-conf-caf-surface text-wc-conf-caf-text border-wc-conf-caf-border',
    bar: 'var(--wc-conf-caf-bar)',
    perfBar: 'var(--wc-conf-caf-bar)',
  },
  AFC: {
    pill: 'bg-wc-info-surface text-wc-conf-afc-text border-wc-conf-afc-border',
    bar: 'var(--wc-conf-afc-bar)',
    perfBar: 'var(--wc-conf-afc-bar)',
  },
  OFC: {
    pill: 'bg-wc-conf-ofc-surface text-wc-conf-ofc-text border-wc-conf-ofc-border',
    bar: 'var(--wc-conf-ofc-bar)',
    perfBar: 'var(--wc-conf-ofc-bar)',
  },
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
