import { useQuery } from '@tanstack/react-query';
import {
  getChampionshipDetail,
  type ChampionshipDetail,
} from '@/services/championshipDetailService';

export const championshipDetailQueryKey = (year: number) => ['championship-detail', year] as const;

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
  const { data, isLoading, isError, error } = useQuery({
    queryKey: championshipDetailQueryKey(year),
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
