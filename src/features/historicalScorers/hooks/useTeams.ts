import { useQuery } from '@tanstack/react-query';
import { getTeams } from '@/services/teamsService';
import { useUIStore } from '@/store/ui.store';
import type { NationalTeamList } from '@/types/team.types';

export const TEAMS_QUERY_KEY = ['teams'] as const;

interface UseTeamsResult {
  teams: NationalTeamList;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useTeams = (): UseTeamsResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...TEAMS_QUERY_KEY, language, 'include-dissolved'],
    queryFn: () => getTeams(language),
    staleTime: 1000 * 60 * 30,
  });

  return {
    teams: data ?? [],
    isLoading,
    isError,
    error: error as Error | null,
  };
};
