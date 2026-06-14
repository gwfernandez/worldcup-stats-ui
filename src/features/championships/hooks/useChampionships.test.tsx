import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { MOCK_CHAMPIONSHIPS, MOCK_CHAMPIONSHIPS_RESPONSE } from '../mocks/championship.mock';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useUIStore } from '@/store/ui.store';
import { useChampionships } from './useChampionships';

describe('useChampionships', () => {
  it('retorna el estado inicial de carga', () => {
    server.use(
      http.get('*/api/championships', async () => {
        await delay('infinite');
        return HttpResponse.json(MOCK_CHAMPIONSHIPS_RESPONSE);
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

  it('realiza una nueva petición cuando cambia el idioma seleccionado', async () => {
    const receivedLanguages: string[] = [];

    server.use(
      http.get('*/api/championships', ({ request }) => {
        receivedLanguages.push(request.headers.get('Accept-Language') ?? '');
        return HttpResponse.json(MOCK_CHAMPIONSHIPS_RESPONSE);
      }),
    );

    const { result } = renderHook(() => useChampionships(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      useUIStore.getState().setLanguage('en');
    });

    await waitFor(() => {
      expect(receivedLanguages).toEqual(['es', 'en']);
    });
  });

  it('retorna estado de error cuando la petición falla', async () => {
    server.use(
      http.get('*/api/championships', () =>
        HttpResponse.json({ message: 'API Error' }, { status: 500 }),
      ),
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
