import { useQuery } from '@tanstack/react-query';
import { getChampionshipSquad } from '@/services/championshipSquadService';
import { useUIStore } from '@/store/ui.store';
import type { ChampionshipSquadPlayerList } from '@/types/team.types';

export const championshipSquadQueryKey = (
  year: number,
  teamCode: string,
  language: string,
) => ['championship-squad', year, teamCode, language] as const;

interface UseChampionshipSquadResult {
  players: ChampionshipSquadPlayerList;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useChampionshipSquad = (
  year: number,
  teamCode: string | null,
): UseChampionshipSquadResult => {
  const language = useUIStore((state) => state.language);
  const normalizedTeamCode = teamCode ?? '';
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: championshipSquadQueryKey(year, normalizedTeamCode, language),
    queryFn: () => getChampionshipSquad(year, normalizedTeamCode, language),
    enabled: Boolean(teamCode),
    staleTime: 1000 * 60 * 5,
  });

  return {
    players: data ?? [],
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};
