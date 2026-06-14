import { useQuery } from '@tanstack/react-query';
import {
  getChampionshipDetail,
  type ChampionshipDetail,
} from '@/services/championshipDetailService';
import { useUIStore } from '@/store/ui.store';

export const championshipDetailQueryKey = (year: number, language: string) =>
  ['championship-detail', year, language] as const;

interface UseChampionshipDetailResult {
  detail: ChampionshipDetail | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useChampionshipDetail = (
  year: number,
  enabled: boolean,
): UseChampionshipDetailResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: championshipDetailQueryKey(year, language),
    queryFn: () => getChampionshipDetail(year),
    enabled,
    staleTime: 1000 * 60 * 5,
  });

  return {
    detail: data ?? null,
    isLoading,
    isError,
    error: error as Error | null,
  };
};
