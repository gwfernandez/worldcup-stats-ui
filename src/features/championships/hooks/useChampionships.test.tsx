import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { MOCK_CHAMPIONSHIPS } from '../mocks/championship.mock';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useChampionships } from './useChampionships';

describe('useChampionships', () => {
  it('retorna el estado inicial de carga', () => {
    server.use(
      http.get('*/worldcups', async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      }),
    );

    const { result } = renderHook(() => useChampionships(), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.championships).toEqual([]);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('retorna la lista de mundiales cuando la petición se resuelve', async () => {
    const { result } = renderHook(() => useChampionships(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.championships).toEqual(MOCK_CHAMPIONSHIPS);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('retorna estado de error cuando la petición falla', async () => {
    server.use(
      http.get('*/worldcups', () => HttpResponse.json({ message: 'API Error' }, { status: 500 })),
    );

    const { result } = renderHook(() => useChampionships(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.championships).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
