import { act, renderHook, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { CHAMPION_FINALS_RESPONSE_FIXTURE } from '@/test/fixtures/championFinals.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useUIStore } from '@/store/ui.store';
import { useChampionFinals } from './useChampionFinals';

describe('useChampionFinals', () => {
  beforeEach(() => {
    useUIStore.getState().setLanguage('es');
  });

  it('does not request finals without a team code', () => {
    let requestCount = 0;
    server.use(
      http.get('*/api/champions/:teamCode', () => {
        requestCount += 1;
        return HttpResponse.json(CHAMPION_FINALS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionFinals(null), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.finals).toEqual([]);
    expect(result.current.pagination).toBeNull();
    expect(requestCount).toBe(0);
  });

  it('returns a loading state and then the won finals', async () => {
    let requestedUrl = '';
    server.use(
      http.get('*/api/champions/:teamCode', async ({ request }) => {
        requestedUrl = request.url;
        await delay(20);
        return HttpResponse.json(CHAMPION_FINALS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionFinals('ARG'), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const url = new URL(requestedUrl);
    expect(url.pathname).toBe('/api/champions/ARG');
    expect(url.search).toBe('');
    expect(result.current.finals).toEqual(CHAMPION_FINALS_RESPONSE_FIXTURE.data);
    expect(result.current.pagination).toEqual(CHAMPION_FINALS_RESPONSE_FIXTURE.pagination);
  });

  it('refetches localized finals when the language changes', async () => {
    const receivedLanguages: string[] = [];
    server.use(
      http.get('*/api/champions/:teamCode', ({ request }) => {
        const language = request.headers.get('Accept-Language') ?? 'es';
        receivedLanguages.push(language);
        return HttpResponse.json({
          ...CHAMPION_FINALS_RESPONSE_FIXTURE,
          data: CHAMPION_FINALS_RESPONSE_FIXTURE.data.map((final) => ({
            ...final,
            awayTeam:
              final.awayTeam.code === 'NLD' && language === 'en'
                ? { ...final.awayTeam, name: 'Netherlands' }
                : final.awayTeam,
          })),
        });
      }),
    );

    const { result } = renderHook(() => useChampionFinals('ARG'), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.finals[0]?.awayTeam.name).toBe('Países Bajos');
    });

    act(() => {
      useUIStore.getState().setLanguage('en');
    });

    await waitFor(() => {
      expect(result.current.finals[0]?.awayTeam.name).toBe('Netherlands');
    });
    expect(receivedLanguages).toEqual(['es', 'en']);
  });

  it('returns an error and can retry the request', async () => {
    let requestCount = 0;
    server.use(
      http.get('*/api/champions/:teamCode', () => {
        requestCount += 1;
        if (requestCount === 1) {
          return HttpResponse.json({ message: 'API Error' }, { status: 500 });
        }
        return HttpResponse.json(CHAMPION_FINALS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionFinals('ARG'), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.finals).toEqual(CHAMPION_FINALS_RESPONSE_FIXTURE.data);
    });
    expect(requestCount).toBe(2);
  });
});
