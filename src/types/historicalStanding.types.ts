import { z } from 'zod';

// ─── Confederación ────────────────────────────────────────────────────────────

export const CONFEDERATION_STYLES: Record<
  string,
  {
    pill: string;
    bar: string;
  }
> = {
  CONMEBOL: {
    pill: 'bg-wc-conf-conmebol-surface text-wc-success-text border-wc-conf-conmebol-border',
    bar: 'var(--wc-conf-conmebol-bar)',
  },
  UEFA: {
    pill: 'bg-wc-conf-uefa-surface text-wc-conf-uefa-text border-wc-conf-uefa-border',
    bar: 'var(--wc-conf-uefa-bar)',
  },
  CONCACAF: {
    pill: 'bg-wc-conf-concacaf-surface text-wc-conf-concacaf-text border-wc-conf-concacaf-border',
    bar: 'var(--wc-conf-concacaf-bar)',
  },
  CAF: {
    pill: 'bg-wc-conf-caf-surface text-wc-conf-caf-text border-wc-conf-caf-border',
    bar: 'var(--wc-conf-caf-bar)',
  },
  AFC: {
    pill: 'bg-wc-info-surface text-wc-conf-afc-text border-wc-conf-afc-border',
    bar: 'var(--wc-conf-afc-bar)',
  },
  OFC: {
    pill: 'bg-wc-conf-ofc-surface text-wc-conf-ofc-text border-wc-conf-ofc-border',
    bar: 'var(--wc-conf-ofc-bar)',
  },
};

// ─── Historical Standing ──────────────────────────────────────────────────────

export const HistoricalStandingSchema = z.object({
  team: z.object({
    code: z.string(),
    name: z.string(),
  }),
  confederationCode: z.string(),
  matchesPlayed: z.number(),
  wins: z.number(),
  draws: z.number(),
  losses: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  goalDifference: z.number(),
  points: z.number(),
  unifiedPoints: z.number(),
  position: z.number(),
  unifiedPosition: z.number(),
});

export const HistoricalStandingListSchema = z.array(HistoricalStandingSchema);

export const HistoricalStandingPaginationSchema = z.object({
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const HistoricalStandingListResponseSchema = z.object({
  data: HistoricalStandingListSchema,
  pagination: HistoricalStandingPaginationSchema,
});

export type HistoricalStanding = z.infer<typeof HistoricalStandingSchema>;
export type HistoricalStandingList = z.infer<typeof HistoricalStandingListSchema>;
export type HistoricalStandingListResponse = z.infer<typeof HistoricalStandingListResponseSchema>;
