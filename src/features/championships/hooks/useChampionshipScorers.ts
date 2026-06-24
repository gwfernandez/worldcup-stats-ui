import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CHAMPIONSHIP_SCORERS_PAGE_SIZE,
  getChampionshipScorers,
} from '@/services/championshipScorersService';
import { useUIStore } from '@/store/ui.store';
import type { ScorerList, ScorerPagination } from '@/types/scorer.types';

export const CHAMPIONSHIP_SCORERS_QUERY_KEY = ['championship-scorers'] as const;
export const CHAMPIONSHIP_SCORERS_SEARCH_DEBOUNCE_MS = 300;

const EMPTY_PAGINATION: ScorerPagination = {
  page: 1,
  size: CHAMPIONSHIP_SCORERS_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
};

interface UseChampionshipScorersResult {
  scorers: ScorerList;
  pagination: ScorerPagination;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const championshipScorersQueryKey = (
  year: number,
  language: string,
  page: number,
  name: string,
  teamCode: string,
) => [...CHAMPIONSHIP_SCORERS_QUERY_KEY, year, language, page, name, teamCode] as const;

export const useChampionshipScorers = (
  year: number,
  page: number,
): UseChampionshipScorersResult => {
  const language = useUIStore((state) => state.language);
  const filters = useUIStore((state) => state.filters.championshipScorers);
  const searchName = filters?.name?.trim() ?? '';
  const teamCode = filters?.team ?? '';
  const [debouncedName, setDebouncedName] = useState(searchName);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedName(searchName),
      CHAMPIONSHIP_SCORERS_SEARCH_DEBOUNCE_MS,
    );

    return () => window.clearTimeout(timeoutId);
  }, [searchName]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: championshipScorersQueryKey(year, language, page, debouncedName, teamCode),
    queryFn: () =>
      getChampionshipScorers(
        year,
        page,
        {
          name: debouncedName || undefined,
          teamCode: teamCode || undefined,
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
