import { useQuery } from '@tanstack/react-query';
import { getHistoricalStandings } from '@/services/historicalStandingsService';
import { useUIStore } from '@/store/ui.store';
import type { HistoricalStandingList } from '@/types/historicalStanding.types';

// ─── Query key ────────────────────────────────────────────────────────────────

/** Query key canónica para la tabla de posiciones histórica. */
export const HISTORICAL_STANDINGS_QUERY_KEY = ['standings'] as const;

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseHistoricalStandingsResult {
  standings: HistoricalStandingList;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Retorna la tabla de posiciones histórica con su estado de carga y error.
 * Los datos se obtienen desde `historicalStandingsService` y se cachean con TanStack Query.
 */
export const useHistoricalStandings = (): UseHistoricalStandingsResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...HISTORICAL_STANDINGS_QUERY_KEY, language],
    queryFn: getHistoricalStandings,
    staleTime: 1000 * 60 * 5, // 5 minutos — los datos históricos no cambian seguido
  });

  return {
    standings: data ?? [],
    isLoading,
    isError,
    error: error as Error | null,
  };
};
