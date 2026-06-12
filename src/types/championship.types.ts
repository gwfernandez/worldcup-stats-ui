import { z } from 'zod';

// ─── Championship ─────────────────────────────────────────────────────────────────

export const ChampionshipSchema = z.object({
  year: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  hosts: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
    }),
  ),
  champion: z.object({
    code: z.string(),
    name: z.string(),
  }),
});

export const ChampionshipListSchema = z.array(ChampionshipSchema);

export const PaginationInfoSchema = z.object({
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const ChampionshipListResponseSchema = z.object({
  data: ChampionshipListSchema,
  pagination: PaginationInfoSchema,
});

export type Championship = z.infer<typeof ChampionshipSchema>;
export type ChampionshipList = z.infer<typeof ChampionshipListSchema>;
export type PaginationInfo = z.infer<typeof PaginationInfoSchema>;
export type ChampionshipListResponse = z.infer<typeof ChampionshipListResponseSchema>;

// ─── Match ────────────────────────────────────────────────────────────────────

export const GoalSchema = z.object({
  id: z.number(),
  minute: z.number(),
  playerName: z.string(),
  teamCode: z.string(),
  type: z.enum(['normal', 'penalty', 'own_goal', 'header']).nullable(),
});

export const MatchSchema = z.object({
  id: z.number(),
  date: z.string(),
  homeTeam: z.string(),
  homeTeamCode: z.string(),
  awayTeam: z.string(),
  awayTeamCode: z.string(),
  homeScore: z.number().nullable(),
  awayScore: z.number().nullable(),
  stadium: z.string().nullable(),
  attendance: z.number().nullable(),
  phase: z.string(),
  goals: z.array(GoalSchema),
});

export type Goal = z.infer<typeof GoalSchema>;
export type Match = z.infer<typeof MatchSchema>;

// ─── Group ────────────────────────────────────────────────────────────────────

export const GroupStandingSchema = z.object({
  position: z.number(),
  teamName: z.string(),
  teamCode: z.string(),
  qualified: z.boolean(),
  played: z.number(),
  won: z.number(),
  drawn: z.number(),
  lost: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  goalDiff: z.number(),
  points: z.number(),
});

export const GroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  standings: z.array(GroupStandingSchema),
  matches: z.array(MatchSchema),
});

export const GroupListSchema = z.array(GroupSchema);

export type GroupStanding = z.infer<typeof GroupStandingSchema>;
export type Group = z.infer<typeof GroupSchema>;
export type GroupList = z.infer<typeof GroupListSchema>;

// ─── Elimination phase ────────────────────────────────────────────────────────

export const EliminationPhaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number(),
  isFinal: z.boolean(),
  matches: z.array(MatchSchema),
});

export const EliminationPhaseListSchema = z.array(EliminationPhaseSchema);

export type EliminationPhase = z.infer<typeof EliminationPhaseSchema>;
export type EliminationPhaseList = z.infer<typeof EliminationPhaseListSchema>;
