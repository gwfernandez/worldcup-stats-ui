import { act, renderHook, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { HISTORICAL_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/historicalScorers.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useUIStore } from '@/store/ui.store';
import { useHistoricalScorers } from './useHistoricalScorers';

describe('useHistoricalScorers', () => {
  it('returns the initial loading state', () => {
    server.use(
      http.get('*/api/scorers', async () => {
        await delay('infinite');
        return HttpResponse.json(HISTORICAL_SCORERS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useHistoricalScorers(1), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.scorers).toEqual([]);
    expect(result.current.pagination.totalElements).toBe(0);
  });

  it('returns scorers and pagination when the request resolves', async () => {
    const { result } = renderHook(() => useHistoricalScorers(1), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.scorers).toEqual(HISTORICAL_SCORERS_RESPONSE_FIXTURE.data);
    expect(result.current.pagination).toEqual(HISTORICAL_SCORERS_RESPONSE_FIXTURE.pagination);
    expect(result.current.isError).toBe(false);
  });

  it('debounces the name and sends server-side filters and pagination', async () => {
    const requestedUrls: string[] = [];
    server.use(
      http.get('*/api/scorers', ({ request }) => {
        requestedUrls.push(request.url);
        return HttpResponse.json(HISTORICAL_SCORERS_RESPONSE_FIXTURE);
      }),
    );

    renderHook(() => useHistoricalScorers(2), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(requestedUrls).toHaveLength(1));

    act(() => {
      useUIStore.getState().setFilter('historicalScorers', 'name', 'messi');
      useUIStore.getState().setFilter('historicalScorers', 'team', 'ARG');
      useUIStore.getState().setFilter('historicalScorers', 'confederation', 'CONMEBOL');
    });

    await waitFor(() => expect(requestedUrls).toHaveLength(3));

    const immediateUrl = new URL(requestedUrls[1]);
    expect(immediateUrl.searchParams.get('name')).toBeNull();
    expect(immediateUrl.searchParams.get('teamCode')).toBe('ARG');
    expect(immediateUrl.searchParams.get('confederationCode')).toBe('CONMEBOL');

    const debouncedUrl = new URL(requestedUrls[2]);
    expect(debouncedUrl.searchParams.get('name')).toBe('messi');
    expect(debouncedUrl.searchParams.get('page')).toBe('2');
    expect(debouncedUrl.searchParams.get('size')).toBe('10');
  });

  it('refetches localized data when the language changes', async () => {
    const receivedLanguages: string[] = [];
    server.use(
      http.get('*/api/scorers', ({ request }) => {
        const language = request.headers.get('Accept-Language') ?? 'es';
        receivedLanguages.push(language);
        return HttpResponse.json({
          ...HISTORICAL_SCORERS_RESPONSE_FIXTURE,
          data: HISTORICAL_SCORERS_RESPONSE_FIXTURE.data.map((scorer) => ({
            ...scorer,
            team:
              language === 'en' && scorer.team.code === 'GER'
                ? { ...scorer.team, name: 'Germany' }
                : scorer.team,
          })),
        });
      }),
    );

    const { result } = renderHook(() => useHistoricalScorers(1), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.scorers[0]?.team.name).toBe('Alemania'));

    act(() => {
      useUIStore.getState().setLanguage('en');
    });

    await waitFor(() => expect(result.current.scorers[0]?.team.name).toBe('Germany'));
    expect(receivedLanguages).toEqual(['es', 'en']);
  });

  it('returns an error state when the request fails', async () => {
    server.use(
      http.get('*/api/scorers', () =>
        HttpResponse.json({ message: 'API Error' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useHistoricalScorers(1), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.scorers).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
