import { z } from 'zod';

// ─── Posición ─────────────────────────────────────────────────────────────────

export const PlayerPositionSchema = z.enum(['goalkeeper', 'defender', 'midfielder', 'forward']);

export type PlayerPosition = z.infer<typeof PlayerPositionSchema>;

export const POSITION_LABEL: Record<PlayerPosition, string> = {
  goalkeeper: 'Arquero',
  defender: 'Defensor',
  midfielder: 'Mediocampista',
  forward: 'Delantero',
};

export const POSITION_STYLES: Record<PlayerPosition, string> = {
  goalkeeper:
    'bg-wc-position-goalkeeper-surface text-wc-position-goalkeeper-text border-wc-position-goalkeeper-border',
  defender:
    'bg-wc-position-defender-surface text-wc-position-defender-text border-wc-position-defender-border',
  midfielder:
    'bg-wc-position-midfielder-surface text-wc-position-midfielder-text border-wc-position-midfielder-border',
  forward: 'bg-wc-position-forward-surface text-wc-danger-text border-wc-position-forward-border',
};

// ─── Desempeño ────────────────────────────────────────────────────────────────

export const TeamPerformanceSchema = z.enum([
  'champion',
  'runner_up',
  'third',
  'fourth',
  'quarters',
  'round_of_16',
  'group_stage',
]);

export type TeamPerformance = z.infer<typeof TeamPerformanceSchema>;

export const PERFORMANCE_LABEL: Record<TeamPerformance, string> = {
  champion: '🏆 Campeón',
  runner_up: '🥈 Subcampeón',
  third: '🥉 3er Puesto',
  fourth: '4to Puesto',
  quarters: 'Cuartos',
  round_of_16: 'Octavos',
  group_stage: 'Fase de grupos',
};

export const PERFORMANCE_STYLES: Record<TeamPerformance, string> = {
  champion: 'bg-wc-success-surface text-wc-accent-gold border-wc-success-border',
  runner_up: 'bg-wc-surface-secondary text-wc-silver-text border-wc-silver-border',
  third: 'bg-wc-position-midfielder-surface text-wc-bronze-text border-wc-bronze-border',
  fourth: 'bg-wc-position-midfielder-surface text-wc-fourth-text border-wc-fourth-border',
  quarters: 'bg-wc-info-surface text-wc-info-text border-wc-info-border',
  round_of_16: 'bg-wc-info-surface text-wc-info-text border-wc-info-border',
  group_stage: 'bg-wc-surface-primary text-wc-text-muted border-wc-border-primary',
};

// ─── Confederación ────────────────────────────────────────────────────────────

export const CONFEDERATION_TOOLTIP: Record<string, string> = {
  CONMEBOL: 'Confederación Sudamericana de Fútbol',
  UEFA: 'Unión de Asociaciones Europeas de Fútbol',
  CONCACAF: 'Confederación de Norteamérica, Centroamérica y el Caribe',
  CAF: 'Confederación Africana de Fútbol',
  AFC: 'Confederación Asiática de Fútbol',
  OFC: 'Confederación de Fútbol de Oceanía',
};

// ─── Player ───────────────────────────────────────────────────────────────────

export const PlayerSchema = z.object({
  id: z.number(),
  number: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  position: PlayerPositionSchema,
});

export type Player = z.infer<typeof PlayerSchema>;

// ─── Team ─────────────────────────────────────────────────────────────────────

export const TeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  teamCode: z.string(),
  confederation: z.string(),
  group: z.string(),
  coach: z.string(),
  performance: TeamPerformanceSchema,
  players: z.array(PlayerSchema),
});

export const TeamListSchema = z.array(TeamSchema);

export type Team = z.infer<typeof TeamSchema>;
export type TeamList = z.infer<typeof TeamListSchema>;

// ─── Championship teams API ─────────────────────────────────────────────────

export const ChampionshipTeamStageReachedSchema = z.enum([
  'champion',
  'runner_up',
  'third_place',
  'fourth_place',
  'group_stage',
  'second_group_stage',
  'round_of_16',
  'quarterfinal',
  'quarter_finals',
  'semi_finals',
  'final',
  '',
]);

export const ChampionshipTeamSchema = z.object({
  year: z.number(),
  team: z.object({
    code: z.string(),
    name: z.string(),
  }),
  confederationCode: z.string(),
  groupCode: z.string(),
  stageReached: ChampionshipTeamStageReachedSchema,
  managers: z.string(),
});

export const ChampionshipTeamListSchema = z.array(ChampionshipTeamSchema);

export const ChampionshipTeamPaginationSchema = z.object({
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const ChampionshipTeamListResponseSchema = z.object({
  data: ChampionshipTeamListSchema,
  pagination: ChampionshipTeamPaginationSchema,
});

export type ChampionshipTeamStageReached = z.infer<typeof ChampionshipTeamStageReachedSchema>;
export type ChampionshipTeam = z.infer<typeof ChampionshipTeamSchema>;
export type ChampionshipTeamList = z.infer<typeof ChampionshipTeamListSchema>;
export type ChampionshipTeamPagination = z.infer<typeof ChampionshipTeamPaginationSchema>;
export type ChampionshipTeamListResponse = z.infer<typeof ChampionshipTeamListResponseSchema>;

export const CHAMPIONSHIP_STAGE_STYLES: Record<ChampionshipTeamStageReached, string> = {
  champion: PERFORMANCE_STYLES.champion,
  runner_up: PERFORMANCE_STYLES.runner_up,
  third_place: PERFORMANCE_STYLES.third,
  fourth_place: PERFORMANCE_STYLES.fourth,
  group_stage: PERFORMANCE_STYLES.group_stage,
  second_group_stage: PERFORMANCE_STYLES.group_stage,
  round_of_16: PERFORMANCE_STYLES.round_of_16,
  quarterfinal: PERFORMANCE_STYLES.quarters,
  quarter_finals: PERFORMANCE_STYLES.quarters,
  semi_finals: PERFORMANCE_STYLES.round_of_16,
  final: PERFORMANCE_STYLES.runner_up,
  '': PERFORMANCE_STYLES.group_stage,
};

// ─── National teams API ──────────────────────────────────────────────────────

export const NationalTeamSchema = z.object({
  code: z.string(),
  name: z.string(),
  isDissolved: z.boolean(),
  confederationCode: z.string(),
  federationName: z.string(),
  federationCode: z.string(),
  dissolutionDate: z.string().nullable(),
});

export const NationalTeamListSchema = z.array(NationalTeamSchema);

export const NationalTeamPaginationSchema = z.object({
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const NationalTeamListResponseSchema = z.object({
  data: NationalTeamListSchema,
  pagination: NationalTeamPaginationSchema,
});

export type NationalTeam = z.infer<typeof NationalTeamSchema>;
export type NationalTeamList = z.infer<typeof NationalTeamListSchema>;
export type NationalTeamListResponse = z.infer<typeof NationalTeamListResponseSchema>;
