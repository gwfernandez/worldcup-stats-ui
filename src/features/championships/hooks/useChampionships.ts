import { useQuery } from '@tanstack/react-query';
import { getChampionships } from '@/services/championshipService';
import { useUIStore } from '@/store/ui.store';
import type { ChampionshipList } from '@/types/championship.types';

// ─── Query key ────────────────────────────────────────────────────────────────

/** Query key canónica para la lista de mundiales. */
export const CHAMPIONSHIPS_QUERY_KEY = ['worldcups'] as const;

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseChampionshipsResult {
  championships: ChampionshipList;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Retorna la lista completa de mundiales con su estado de carga y error.
 * Los datos se obtienen desde `championshipService` y se cachean con TanStack Query.
 */
export const useChampionships = (): UseChampionshipsResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...CHAMPIONSHIPS_QUERY_KEY, language],
    queryFn: getChampionships,
    staleTime: 1000 * 60 * 5, // 5 minutos — los datos históricos no cambian seguido
  });

  return {
    championships: data ?? [],
    isLoading,
    isError,
    error: error as Error | null,
  };
};
