import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { MOCK_HISTORICAL_SCORERS } from '@/features/historicalScorers/mocks/historicalScorers.mock';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useHistoricalScorers } from './useHistoricalScorers';

describe('useHistoricalScorers', () => {
  it('retorna el estado inicial de carga', () => {
    server.use(
      http.get('*/historical/scorers', async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      }),
    );

    const { result } = renderHook(() => useHistoricalScorers(), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.scorers).toEqual([]);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('retorna la lista de goleadores cuando la petición se resuelve', async () => {
    const { result } = renderHook(() => useHistoricalScorers(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.scorers).toEqual(MOCK_HISTORICAL_SCORERS);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('retorna estado de error cuando la petición falla', async () => {
    server.use(
      http.get('*/historical/scorers', () =>
        HttpResponse.json({ message: 'API Error' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useHistoricalScorers(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.scorers).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
