import { act, renderHook, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import {
  HISTORICAL_STANDINGS_FIXTURE,
  HISTORICAL_STANDINGS_RESPONSE_FIXTURE,
} from '@/test/fixtures/historicalStandings.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useUIStore } from '@/store/ui.store';
import { useHistoricalStandings } from './useHistoricalStandings';

describe('useHistoricalStandings', () => {
  it('returns the initial loading state', () => {
    server.use(
      http.get('*/api/standings', async () => {
        await delay('infinite');
        return HttpResponse.json(HISTORICAL_STANDINGS_RESPONSE_FIXTURE);
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

  it('returns the complete standings list', async () => {
    const { result } = renderHook(() => useHistoricalStandings(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.standings).toEqual(HISTORICAL_STANDINGS_FIXTURE);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debounces the team name and sends both filters to the API', async () => {
    const requestedUrls: string[] = [];
    server.use(
      http.get('*/api/standings', ({ request }) => {
        requestedUrls.push(request.url);
        return HttpResponse.json(HISTORICAL_STANDINGS_RESPONSE_FIXTURE);
      }),
    );

    renderHook(() => useHistoricalStandings(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(requestedUrls).toHaveLength(1);
    });

    act(() => {
      useUIStore.getState().setFilter('historicalStandings', 'name', 'argen');
      useUIStore.getState().setFilter('historicalStandings', 'confederation', 'CONMEBOL');
    });

    await waitFor(() => {
      expect(requestedUrls).toHaveLength(3);
    });

    const immediateUrl = new URL(requestedUrls[1]);
    expect(immediateUrl.searchParams.get('name')).toBeNull();
    expect(immediateUrl.searchParams.get('confederationCode')).toBe('CONMEBOL');

    const debouncedUrl = new URL(requestedUrls[2]);
    expect(debouncedUrl.searchParams.get('name')).toBe('argen');
    expect(debouncedUrl.searchParams.get('confederationCode')).toBe('CONMEBOL');
    expect(debouncedUrl.searchParams.get('page')).toBe('1');
    expect(debouncedUrl.searchParams.get('size')).toBe('100');
  });

  it('refetches localized team names when the language changes', async () => {
    const receivedLanguages: string[] = [];
    server.use(
      http.get('*/api/standings', ({ request }) => {
        const language = request.headers.get('Accept-Language') ?? 'es';
        receivedLanguages.push(language);
        return HttpResponse.json({
          ...HISTORICAL_STANDINGS_RESPONSE_FIXTURE,
          data: HISTORICAL_STANDINGS_FIXTURE.map((standing) => ({
            ...standing,
            team: {
              ...standing.team,
              name:
                language === 'en' && standing.team.code === 'BRA' ? 'Brazil' : standing.team.name,
            },
          })),
        });
      }),
    );

    const { result } = renderHook(() => useHistoricalStandings(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.standings[0]?.team.name).toBe('Brasil');
    });

    act(() => {
      useUIStore.getState().setLanguage('en');
    });

    await waitFor(() => {
      expect(result.current.standings[0]?.team.name).toBe('Brazil');
    });
    expect(receivedLanguages).toEqual(['es', 'en']);
  });

  it('returns an error state when the request fails', async () => {
    server.use(
      http.get('*/api/standings', () =>
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
