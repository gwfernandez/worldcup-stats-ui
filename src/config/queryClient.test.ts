import { describe, expect, it } from 'vitest';
import { createQueryClient, QUERY_GC_TIME_MS, QUERY_STALE_TIME_MS } from './queryClient';

describe('queryClient', () => {
  it('configura defaults globales para queries en producción', () => {
    const queryClient = createQueryClient('production');
    const queryDefaults = queryClient.getDefaultOptions().queries;

    expect(queryDefaults).toMatchObject({
      staleTime: QUERY_STALE_TIME_MS,
      gcTime: QUERY_GC_TIME_MS,
      retry: 1,
    });
  });

  it('deshabilita reintentos en tests', () => {
    const queryClient = createQueryClient('test');

    expect(queryClient.getDefaultOptions().queries?.retry).toBe(false);
  });
});
