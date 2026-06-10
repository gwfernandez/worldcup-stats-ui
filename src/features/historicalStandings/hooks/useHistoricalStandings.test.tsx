import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { MOCK_HISTORICAL_STANDINGS } from '../mocks/historicalStandings.mock';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useHistoricalStandings } from './useHistoricalStandings';

describe('useHistoricalStandings', () => {
  it('retorna el estado inicial de carga', () => {
    server.use(
      http.get('*/historical/standings', async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      }),
    );

    const { result } = renderHook(() => useHistoricalStandings(), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.standings).toEqual([]);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('retorna la tabla de posiciones cuando la petición se resuelve', async () => {
    const { result } = renderHook(() => useHistoricalStandings(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.standings).toEqual(MOCK_HISTORICAL_STANDINGS);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('retorna estado de error cuando la petición falla', async () => {
    server.use(
      http.get('*/historical/standings', () =>
        HttpResponse.json({ message: 'API Error' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useHistoricalStandings(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.standings).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
