import { useQuery } from '@tanstack/react-query';
import { getWorldCups } from '../../../services/worldcupService';
import type { WorldCupList } from '../../../types/worldcup.types';

// ─── Query key ────────────────────────────────────────────────────────────────

/** Query key canónica para la lista de mundiales. */
export const WORLD_CUPS_QUERY_KEY = ['worldcups'] as const;

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseWorldCupsResult {
  worldCups: WorldCupList;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Retorna la lista completa de mundiales con su estado de carga y error.
 * Los datos se obtienen desde `worldcupService` y se cachean con TanStack Query.
 */
export const useWorldCups = (): UseWorldCupsResult => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: WORLD_CUPS_QUERY_KEY,
    queryFn: getWorldCups,
    staleTime: 1000 * 60 * 5, // 5 minutos — los datos históricos no cambian seguido
  });

  return {
    worldCups: data ?? [],
    isLoading,
    isError,
    error: error as Error | null,
  };
};
