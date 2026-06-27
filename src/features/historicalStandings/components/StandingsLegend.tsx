import { StandingsLegend as SharedStandingsLegend } from '@/components/shared';

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Leyenda de la tabla de posiciones históricas.
 * Muestra abreviaciones y sistema de puntuación histórico.
 */
export function StandingsLegend() {
  return <SharedStandingsLegend mode="all" />;
}
