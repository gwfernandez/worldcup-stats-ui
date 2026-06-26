import { useQuery } from '@tanstack/react-query';
import { getChampionshipStadiums } from '@/services/championshipStadiumsService';
import { useUIStore } from '@/store/ui.store';
import type { ChampionshipStadiumList } from '@/types/stadium.types';

export const championshipStadiumsQueryKey = (year: number, language: string) =>
  ['championship-stadiums', year, language] as const;

interface UseChampionshipStadiumsResult {
  stadiums: ChampionshipStadiumList;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useChampionshipStadiums = (year: number): UseChampionshipStadiumsResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: championshipStadiumsQueryKey(year, language),
    queryFn: () => getChampionshipStadiums(year),
    staleTime: 1000 * 60 * 5,
  });

  return {
    stadiums: data ?? [],
    isLoading,
    isError,
    error: error as Error | null,
  };
};
