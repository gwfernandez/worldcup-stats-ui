import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipScorers.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useUIStore } from '@/store/ui.store';
import { championshipScorersQueryKey, useChampionshipScorers } from './useChampionshipScorers';

describe('useChampionshipScorers', () => {
  it('exposes the query key with year, language, page and filters', () => {
    expect(championshipScorersQueryKey(1950, 'es', 2, 'ademir', 'BRA')).toEqual([
      'championship-scorers',
      1950,
      'es',
      2,
      'ademir',
      'BRA',
    ]);
  });

  it('returns loading state before the request resolves', () => {
    server.use(
      http.get('*/api/championships/:year/scorers', async () => {
        await delay('infinite');
        return HttpResponse.json(CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionshipScorers(1950, 1), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.scorers).toEqual([]);
    expect(result.current.isError).toBe(false);
  });

  it('requests scorers using the selected year, page, filters and language', async () => {
    const requestedUrls: URL[] = [];
    server.use(
      http.get('*/api/championships/:year/scorers', ({ request }) => {
        requestedUrls.push(new URL(request.url));
        return HttpResponse.json(CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE);
      }),
    );
    useUIStore.getState().setFilters('championshipScorers', {
      name: 'ademir',
      team: 'BRA',
    });

    const { result } = renderHook(() => useChampionshipScorers(1950, 2), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(requestedUrls).toHaveLength(1);
    const requestedUrl = requestedUrls[0] as URL;
    expect(requestedUrl.pathname).toBe('/api/championships/1950/scorers');
    expect(requestedUrl.searchParams.get('page')).toBe('2');
    expect(requestedUrl.searchParams.get('size')).toBe('10');
    expect(requestedUrl.searchParams.get('name')).toBe('ademir');
    expect(requestedUrl.searchParams.get('teamCode')).toBe('BRA');
    expect(result.current.scorers).toEqual(CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE.data);
  });

  it('refetches localized scorer teams when language changes', async () => {
    const receivedLanguages: string[] = [];
    server.use(
      http.get('*/api/championships/:year/scorers', ({ request }) => {
        const language = request.headers.get('Accept-Language') ?? 'es';
        receivedLanguages.push(language);
        return HttpResponse.json({
          ...CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE,
          data: CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE.data.map((scorer) => ({
            ...scorer,
            team: {
              ...scorer.team,
              name: language === 'en' && scorer.team.code === 'BRA' ? 'Brazil' : scorer.team.name,
            },
          })),
        });
      }),
    );

    const { result } = renderHook(() => useChampionshipScorers(1950, 1), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scorers[0]?.team.name).toBe('Brasil');

    act(() => {
      useUIStore.getState().setLanguage('en');
    });

    await waitFor(() => expect(result.current.scorers[0]?.team.name).toBe('Brazil'));
    expect(receivedLanguages).toEqual(['es', 'en']);
  });

  it('returns an error state when the endpoint fails', async () => {
    server.use(
      http.get('*/api/championships/:year/scorers', () =>
        HttpResponse.json({ message: 'API Error' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useChampionshipScorers(1950, 1), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.scorers).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
