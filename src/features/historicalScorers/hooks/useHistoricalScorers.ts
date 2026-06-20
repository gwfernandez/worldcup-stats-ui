import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getHistoricalScorers,
  HISTORICAL_SCORERS_PAGE_SIZE,
} from '@/services/historicalScorersService';
import { useUIStore } from '@/store/ui.store';
import type {
  HistoricalScorerList,
  HistoricalScorerPagination,
} from '@/types/historicalScorer.types';

export const HISTORICAL_SCORERS_QUERY_KEY = ['scorers'] as const;
export const HISTORICAL_SCORERS_SEARCH_DEBOUNCE_MS = 300;

const EMPTY_PAGINATION: HistoricalScorerPagination = {
  page: 1,
  size: HISTORICAL_SCORERS_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
};

interface UseHistoricalScorersResult {
  scorers: HistoricalScorerList;
  pagination: HistoricalScorerPagination;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useHistoricalScorers = (page: number): UseHistoricalScorersResult => {
  const language = useUIStore((state) => state.language);
  const filters = useUIStore((state) => state.filters.historicalScorers);
  const searchName = filters?.name?.trim() ?? '';
  const teamCode = filters?.team ?? '';
  const confederationCode = filters?.confederation ?? '';
  const [debouncedName, setDebouncedName] = useState(searchName);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedName(searchName),
      HISTORICAL_SCORERS_SEARCH_DEBOUNCE_MS,
    );

    return () => window.clearTimeout(timeoutId);
  }, [searchName]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      ...HISTORICAL_SCORERS_QUERY_KEY,
      language,
      page,
      debouncedName,
      teamCode,
      confederationCode,
    ],
    queryFn: () =>
      getHistoricalScorers(
        page,
        {
          name: debouncedName || undefined,
          teamCode: teamCode || undefined,
          confederationCode: confederationCode || undefined,
        },
        language,
      ),
    staleTime: 1000 * 60 * 5,
  });

  return {
    scorers: data?.data ?? [],
    pagination: data?.pagination ?? EMPTY_PAGINATION,
    isLoading,
    isError,
    error: error as Error | null,
  };
};
