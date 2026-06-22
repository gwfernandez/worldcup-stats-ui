import { useQuery } from '@tanstack/react-query';
import { getChampionshipTeams } from '@/services/championshipTeamsService';
import { useUIStore } from '@/store/ui.store';
import type { ChampionshipTeamList } from '@/types/team.types';

export const championshipTeamsQueryKey = (year: number, language: string) =>
  ['championship-teams', year, language] as const;

interface UseChampionshipTeamsResult {
  teams: ChampionshipTeamList;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useChampionshipTeams = (year: number): UseChampionshipTeamsResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: championshipTeamsQueryKey(year, language),
    queryFn: () => getChampionshipTeams(year, language),
    staleTime: 1000 * 60 * 5,
  });

  return {
    teams: data ?? [],
    isLoading,
    isError,
    error: error as Error | null,
  };
};
