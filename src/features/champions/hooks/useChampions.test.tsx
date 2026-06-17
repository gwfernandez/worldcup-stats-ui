import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { CHAMPIONS_FIXTURE, CHAMPIONS_RESPONSE_FIXTURE } from '@/test/fixtures/champions.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useUIStore } from '@/store/ui.store';
import { useChampions } from './useChampions';

describe('useChampions', () => {
  it('returns the initial loading state and empty pagination', () => {
    server.use(
      http.get('*/api/champions', async () => {
        await delay('infinite');
        return HttpResponse.json(CHAMPIONS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampions(), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.champions).toEqual([]);
    expect(result.current.pagination.totalElements).toBe(0);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns champions and pagination using page 1 and size 15', async () => {
    let requestedUrl = '';
    server.use(
      http.get('*/api/champions', ({ request }) => {
        requestedUrl = request.url;
        return HttpResponse.json(CHAMPIONS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampions(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const url = new URL(requestedUrl);
    expect(url.pathname).toBe('/api/champions');
    expect(url.searchParams.get('page')).toBe('1');
    expect(url.searchParams.get('size')).toBe('15');
    expect(result.current.champions).toEqual(CHAMPIONS_FIXTURE);
    expect(result.current.pagination).toEqual(CHAMPIONS_RESPONSE_FIXTURE.pagination);
    expect(result.current.isError).toBe(false);
  });

  it('refetches localized names when the selected language changes', async () => {
    const receivedLanguages: string[] = [];
    server.use(
      http.get('*/api/champions', ({ request }) => {
        const language = request.headers.get('Accept-Language') ?? 'es';
        receivedLanguages.push(language);
        return HttpResponse.json({
          ...CHAMPIONS_RESPONSE_FIXTURE,
          data: CHAMPIONS_RESPONSE_FIXTURE.data.map((champion) => ({
            ...champion,
            team: {
              ...champion.team,
              name:
                language === 'en' && champion.team.code === 'BRA' ? 'Brazil' : champion.team.name,
            },
          })),
        });
      }),
    );

    const { result } = renderHook(() => useChampions(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.champions[0].team.name).toBe('Brasil');

    act(() => {
      useUIStore.getState().setLanguage('en');
    });

    await waitFor(() => {
      expect(result.current.champions[0].team.name).toBe('Brazil');
    });
    expect(receivedLanguages).toEqual(['es', 'en']);
  });

  it('returns an error state when the request fails', async () => {
    server.use(
      http.get('*/api/champions', () =>
        HttpResponse.json({ message: 'API Error' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useChampions(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.champions).toEqual([]);
    expect(result.current.pagination.totalElements).toBe(0);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
