import { useQuery } from '@tanstack/react-query';
import { getChampions } from '@/services/championsService';
import { useUIStore } from '@/store/ui.store';
import type { ChampionTeamList } from '@/types/champion.types';

// ─── Query key ────────────────────────────────────────────────────────────────

/** Query key canónica para la lista de campeones. */
export const CHAMPIONS_QUERY_KEY = ['champions'] as const;

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseChampionsResult {
  champions: ChampionTeamList;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Retorna la lista de campeones con su estado de carga y error.
 * Los datos se obtienen desde `championsService` y se cachean con TanStack Query.
 */
export const useChampions = (): UseChampionsResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...CHAMPIONS_QUERY_KEY, language],
    queryFn: getChampions,
    staleTime: 1000 * 60 * 5, // 5 minutos — los datos históricos no cambian seguido
  });

  return {
    champions: data ?? [],
    isLoading,
    isError,
    error: error as Error | null,
  };
};
