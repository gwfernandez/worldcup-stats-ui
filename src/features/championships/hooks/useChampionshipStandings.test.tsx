import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipStandings.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useUIStore } from '@/store/ui.store';
import {
  championshipStandingsQueryKey,
  useChampionshipStandings,
} from './useChampionshipStandings';

describe('useChampionshipStandings', () => {
  it('exposes the query key with year and language', () => {
    expect(championshipStandingsQueryKey(1950, 'es')).toEqual([
      'championship-standings',
      1950,
      'es',
    ]);
  });

  it('returns loading state before the request resolves', () => {
    server.use(
      http.get('*/api/championships/:year/standings', async () => {
        await delay('infinite');
        return HttpResponse.json(CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionshipStandings(1950), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.standings).toEqual([]);
    expect(result.current.isError).toBe(false);
  });

  it('requests standings using the selected year', async () => {
    let requestedPath = '';
    server.use(
      http.get('*/api/championships/:year/standings', ({ request }) => {
        requestedPath = new URL(request.url).pathname;
        return HttpResponse.json(CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionshipStandings(1950), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(requestedPath).toBe('/api/championships/1950/standings');
    expect(result.current.standings).toEqual(CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE.data);
  });

  it('refetches localized team names when language changes', async () => {
    const receivedLanguages: string[] = [];
    server.use(
      http.get('*/api/championships/:year/standings', ({ request }) => {
        const language = request.headers.get('Accept-Language') ?? 'es';
        receivedLanguages.push(language);
        return HttpResponse.json({
          ...CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE,
          data: CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE.data.map((standing) => ({
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

    const { result } = renderHook(() => useChampionshipStandings(1950), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.standings[1].team.name).toBe('Brasil');

    act(() => {
      useUIStore.getState().setLanguage('en');
    });

    await waitFor(() => expect(result.current.standings[1].team.name).toBe('Brazil'));
    expect(receivedLanguages).toEqual(['es', 'en']);
  });

  it('returns an error state when the endpoint fails', async () => {
    server.use(
      http.get('*/api/championships/:year/standings', () =>
        HttpResponse.json({ message: 'API Error' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useChampionshipStandings(1950), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.standings).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
