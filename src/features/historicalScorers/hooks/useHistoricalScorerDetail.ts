import { useQuery } from '@tanstack/react-query';
import { getHistoricalScorerDetail } from '@/services/historicalScorersService';
import { useUIStore } from '@/store/ui.store';
import type { HistoricalScorerDetail } from '@/types/historicalScorer.types';

export const historicalScorerDetailQueryKey = (playerId: number | null, language: string) =>
  ['scorer', playerId, language] as const;

interface UseHistoricalScorerDetailResult {
  scorer: HistoricalScorerDetail | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useHistoricalScorerDetail = (
  playerId: number | null,
): UseHistoricalScorerDetailResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: historicalScorerDetailQueryKey(playerId, language),
    queryFn: () => getHistoricalScorerDetail(playerId as number, language),
    enabled: playerId !== null,
    staleTime: 1000 * 60 * 5,
  });

  return {
    scorer: data ?? null,
    isLoading,
    isError,
    error: error as Error | null,
    refetch: () => {
      void refetch();
    },
  };
};
