import { useQuery } from '@tanstack/react-query';
import { getChampionshipStandings } from '@/services/championshipStandingsService';
import { useUIStore } from '@/store/ui.store';
import type { StandingList } from '@/types/standing.types';

export const championshipStandingsQueryKey = (year: number, language: string) =>
  ['championship-standings', year, language] as const;

interface UseChampionshipStandingsResult {
  standings: StandingList;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useChampionshipStandings = (year: number): UseChampionshipStandingsResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: championshipStandingsQueryKey(year, language),
    queryFn: () => getChampionshipStandings(year, language),
    staleTime: 1000 * 60 * 5,
  });

  return {
    standings: data ?? [],
    isLoading,
    isError,
    error: error as Error | null,
  };
};
