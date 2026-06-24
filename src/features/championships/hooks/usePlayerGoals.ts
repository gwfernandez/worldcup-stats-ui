import { useQuery } from '@tanstack/react-query';
import { getPlayerGoals } from '@/services/playerGoalsService';
import { useUIStore } from '@/store/ui.store';
import type { PlayerGoalList, ScorerPagination } from '@/types/scorer.types';
import { PLAYER_GOALS_PAGE_SIZE } from '@/services/playerGoalsService';

export const playerGoalsQueryKey = (playerId: number | null, year: number, language: string) =>
  ['player-goals', playerId, year, language] as const;

const EMPTY_PAGINATION: ScorerPagination = {
  page: 1,
  size: PLAYER_GOALS_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
};

interface UsePlayerGoalsResult {
  goals: PlayerGoalList;
  pagination: ScorerPagination;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePlayerGoals = (playerId: number | null, year: number): UsePlayerGoalsResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: playerGoalsQueryKey(playerId, year, language),
    queryFn: () => getPlayerGoals(playerId as number, year, language),
    enabled: playerId !== null,
    staleTime: 1000 * 60 * 5,
  });

  return {
    goals: data?.data ?? [],
    pagination: data?.pagination ?? EMPTY_PAGINATION,
    isLoading,
    isError,
    error: error as Error | null,
    refetch: () => {
      void refetch();
    },
  };
};
