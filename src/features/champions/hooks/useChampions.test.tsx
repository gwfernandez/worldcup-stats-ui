import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { MOCK_CHAMPIONS } from '../mocks/champions.mock';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useChampions } from './useChampions';

describe('useChampions', () => {
  it('retorna el estado inicial de carga', () => {
    server.use(
      http.get('*/champions', async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      }),
    );

    const { result } = renderHook(() => useChampions(), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.champions).toEqual([]);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('retorna la lista de campeones cuando la petición se resuelve', async () => {
    const { result } = renderHook(() => useChampions(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.champions).toEqual(MOCK_CHAMPIONS);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('retorna estado de error cuando la petición falla', async () => {
    server.use(
      http.get('*/champions', () => HttpResponse.json({ message: 'API Error' }, { status: 500 })),
    );

    const { result } = renderHook(() => useChampions(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.champions).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
