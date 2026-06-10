import { QueryClient } from '@tanstack/react-query';

export const QUERY_STALE_TIME_MS = 5 * 60 * 1000;
export const QUERY_GC_TIME_MS = 30 * 60 * 1000;

export const createQueryClient = (mode = import.meta.env.MODE): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        gcTime: QUERY_GC_TIME_MS,
        retry: mode === 'test' ? false : 1,
      },
    },
  });
