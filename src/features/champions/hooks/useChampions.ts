import { useQuery } from '@tanstack/react-query';
import { CHAMPIONS_PAGE, CHAMPIONS_PAGE_SIZE, getChampions } from '@/services/championsService';
import { useUIStore } from '@/store/ui.store';
import type { ChampionList, ChampionPagination } from '@/types/champion.types';

export const CHAMPIONS_QUERY_KEY = ['champions'] as const;

const EMPTY_PAGINATION: ChampionPagination = {
  page: CHAMPIONS_PAGE,
  size: CHAMPIONS_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
};

interface UseChampionsResult {
  champions: ChampionList;
  pagination: ChampionPagination;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useChampions = (): UseChampionsResult => {
  const language = useUIStore((state) => state.language);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...CHAMPIONS_QUERY_KEY, language, CHAMPIONS_PAGE, CHAMPIONS_PAGE_SIZE],
    queryFn: () => getChampions(CHAMPIONS_PAGE, CHAMPIONS_PAGE_SIZE, language),
    staleTime: 1000 * 60 * 5,
  });

  return {
    champions: data?.data ?? [],
    pagination: data?.pagination ?? EMPTY_PAGINATION,
    isLoading,
    isError,
    error: error as Error | null,
  };
};
