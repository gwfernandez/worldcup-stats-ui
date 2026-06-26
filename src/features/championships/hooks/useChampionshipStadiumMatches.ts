import { useQuery } from '@tanstack/react-query';
import { getChampionshipStadiumMatches } from '@/services/championshipStadiumMatchesService';
import { useUIStore } from '@/store/ui.store';
import type { ChampionshipStadiumMatchList } from '@/types/stadium.types';

export const championshipStadiumMatchesQueryKey = (
  year: number,
  stadiumId: number | null,
  language: string,
) => ['championship-stadium-matches', year, stadiumId, language] as const;

interface UseChampionshipStadiumMatchesResult {
  matches: ChampionshipStadiumMatchList;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useChampionshipStadiumMatches = (
  year: number,
  stadiumId: number | null,
): UseChampionshipStadiumMatchesResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: championshipStadiumMatchesQueryKey(year, stadiumId, language),
    queryFn: () => getChampionshipStadiumMatches(year, stadiumId as number, language),
    enabled: stadiumId !== null,
    staleTime: 1000 * 60 * 5,
  });

  return {
    matches: data ?? [],
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};
