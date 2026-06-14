import { useQuery } from '@tanstack/react-query';
import { getHistoricalScorers } from '@/services/historicalScorersService';
import { useUIStore } from '@/store/ui.store';
import type { HistoricalScorerList } from '@/types/historicalScorer.types';

// ─── Query key ────────────────────────────────────────────────────────────────

/** Query key canónica para la lista de goleadores históricos. */
export const HISTORICAL_SCORERS_QUERY_KEY = ['scorers'] as const;

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseHistoricalScorersResult {
  scorers: HistoricalScorerList;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Retorna la lista de goleadores históricos con su estado de carga y error.
 * Los datos se obtienen desde `historicalScorersService` y se cachean con TanStack Query.
 */
export const useHistoricalScorers = (): UseHistoricalScorersResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...HISTORICAL_SCORERS_QUERY_KEY, language],
    queryFn: getHistoricalScorers,
    staleTime: 1000 * 60 * 5, // 5 minutos — los datos históricos no cambian seguido
  });

  return {
    scorers: data ?? [],
    isLoading,
    isError,
    error: error as Error | null,
  };
};
