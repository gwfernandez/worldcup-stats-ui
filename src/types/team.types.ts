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
  goalkeeper: 'bg-[#1e1a2e] text-[#a090d0] border-[#4a3a70]',
  defender: 'bg-[#1a1e10] text-[#80b050] border-[#3a5020]',
  midfielder: 'bg-[#1e1a10] text-[#c0a040] border-[#5a4810]',
  forward: 'bg-[#1e1010] text-[#d06060] border-[#602020]',
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
  champion: 'bg-[#1e2a14] text-[#e8c84a] border-[#3a5a1a]',
  runner_up: 'bg-[#1e2233] text-[#c0c8e0] border-[#3a4060]',
  third: 'bg-[#1e1a10] text-[#c8a050] border-[#5a4020]',
  fourth: 'bg-[#1e1a10] text-[#a09070] border-[#403020]',
  quarters: 'bg-[#1a1e2a] text-[#8a9fc0] border-[#2a3a50]',
  round_of_16: 'bg-[#1a1e2a] text-[#8a9fc0] border-[#2a3a50]',
  group_stage: 'bg-[#161925] text-[#8a8fa8] border-[#2a2d3a]',
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
