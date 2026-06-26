import { act, renderHook, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE } from '@/test/fixtures/championshipStadiumMatches.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useUIStore } from '@/store/ui.store';
import {
  championshipStadiumMatchesQueryKey,
  useChampionshipStadiumMatches,
} from './useChampionshipStadiumMatches';

describe('useChampionshipStadiumMatches', () => {
  beforeEach(() => {
    useUIStore.getState().setLanguage('es');
  });

  it('exposes the query key with year, stadium and language', () => {
    expect(championshipStadiumMatchesQueryKey(1930, 1, 'es')).toEqual([
      'championship-stadium-matches',
      1930,
      1,
      'es',
    ]);
  });

  it('does not request matches without a stadium id', () => {
    let requestCount = 0;
    server.use(
      http.get('*/api/championships/:year/stadiums/:stadiumId', () => {
        requestCount += 1;
        return HttpResponse.json(CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionshipStadiumMatches(1930, null), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.matches).toEqual([]);
    expect(requestCount).toBe(0);
  });

  it('returns a loading state and then selected stadium matches', async () => {
    let requestedUrl = '';
    server.use(
      http.get('*/api/championships/:year/stadiums/:stadiumId', async ({ request }) => {
        requestedUrl = request.url;
        await delay(20);
        return HttpResponse.json(CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionshipStadiumMatches(1930, 1), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const url = new URL(requestedUrl);
    expect(url.pathname).toBe('/api/championships/1930/stadiums/1');
    expect(url.searchParams.get('page')).toBe('1');
    expect(url.searchParams.get('size')).toBe('100');
    expect(result.current.matches).toEqual(CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE.data);
  });

  it('refetches localized match teams when language changes', async () => {
    const receivedLanguages: string[] = [];
    server.use(
      http.get('*/api/championships/:year/stadiums/:stadiumId', ({ request }) => {
        const language = request.headers.get('Accept-Language') ?? 'es';
        receivedLanguages.push(language);
        return HttpResponse.json({
          ...CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE,
          data: CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE.data.map((match) => ({
            ...match,
            homeTeam:
              language === 'en' && match.homeTeam.code === 'FRA'
                ? { ...match.homeTeam, name: 'France' }
                : match.homeTeam,
          })),
        });
      }),
    );

    const { result } = renderHook(() => useChampionshipStadiumMatches(1930, 1), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.matches[0]?.homeTeam.name).toBe('Francia');
    });

    act(() => {
      useUIStore.getState().setLanguage('en');
    });

    await waitFor(() => {
      expect(result.current.matches[0]?.homeTeam.name).toBe('France');
    });
    expect(receivedLanguages).toEqual(['es', 'en']);
  });
});
