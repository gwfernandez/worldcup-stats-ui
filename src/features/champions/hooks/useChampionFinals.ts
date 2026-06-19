import { useQuery } from '@tanstack/react-query';
import { getChampionFinals } from '@/services/championsService';
import { useUIStore } from '@/store/ui.store';
import type { ChampionFinalList, ChampionPagination } from '@/types/champion.types';

export const championFinalsQueryKey = (teamCode: string, language: string) =>
  ['champion-finals', teamCode, language] as const;

interface UseChampionFinalsResult {
  finals: ChampionFinalList;
  pagination: ChampionPagination | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useChampionFinals = (teamCode: string | null): UseChampionFinalsResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: championFinalsQueryKey(teamCode ?? '', language),
    queryFn: () => getChampionFinals(teamCode ?? '', language),
    enabled: Boolean(teamCode),
    staleTime: 1000 * 60 * 5,
  });

  return {
    finals: data?.data ?? [],
    pagination: data?.pagination ?? null,
    isLoading,
    isError,
    error: error as Error | null,
    refetch: () => {
      void refetch();
    },
  };
};
