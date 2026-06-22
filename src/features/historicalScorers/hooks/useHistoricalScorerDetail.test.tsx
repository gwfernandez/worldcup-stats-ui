import { act, renderHook, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { HISTORICAL_SCORER_DETAIL_FIXTURE } from '@/test/fixtures/historicalScorerDetail.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useUIStore } from '@/store/ui.store';
import {
  historicalScorerDetailQueryKey,
  useHistoricalScorerDetail,
} from './useHistoricalScorerDetail';

describe('useHistoricalScorerDetail', () => {
  it('builds a query key from player ID and language', () => {
    expect(historicalScorerDetailQueryKey(1524, 'es')).toEqual(['scorer', 1524, 'es']);
  });

  it('does not request data without a selected player', () => {
    let requestCount = 0;
    server.use(
      http.get('*/api/scorers/:playerId', () => {
        requestCount += 1;
        return HttpResponse.json(HISTORICAL_SCORER_DETAIL_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useHistoricalScorerDetail(null), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.scorer).toBeNull();
    expect(requestCount).toBe(0);
  });

  it('returns loading and then the selected scorer detail', async () => {
    let requestedUrl = '';
    server.use(
      http.get('*/api/scorers/:playerId', async ({ request }) => {
        requestedUrl = request.url;
        await delay(20);
        return HttpResponse.json(HISTORICAL_SCORER_DETAIL_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useHistoricalScorerDetail(1524), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.scorer).toEqual(HISTORICAL_SCORER_DETAIL_FIXTURE));
    expect(new URL(requestedUrl).pathname).toBe('/api/scorers/1524');
  });

  it('refetches localized details when the language changes', async () => {
    const receivedLanguages: string[] = [];
    server.use(
      http.get('*/api/scorers/:playerId', ({ request }) => {
        const language = request.headers.get('Accept-Language') ?? 'es';
        receivedLanguages.push(language);
        return HttpResponse.json({
          ...HISTORICAL_SCORER_DETAIL_FIXTURE,
          teams: [
            {
              code: 'ARG',
              name: language === 'en' ? 'Argentina' : 'Argentina',
            },
          ],
          goals: HISTORICAL_SCORER_DETAIL_FIXTURE.goals.map((goal) => ({
            ...goal,
            opponentTeam:
              language === 'en' ? { ...goal.opponentTeam, name: 'France' } : goal.opponentTeam,
          })),
        });
      }),
    );

    const { result } = renderHook(() => useHistoricalScorerDetail(1524), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.scorer?.goals[0]?.opponentTeam.name).toBe('Francia'));

    act(() => {
      useUIStore.getState().setLanguage('en');
    });

    await waitFor(() => expect(result.current.scorer?.goals[0]?.opponentTeam.name).toBe('France'));
    expect(receivedLanguages).toEqual(['es', 'en']);
  });

  it('returns an error and can retry the request', async () => {
    let requestCount = 0;
    server.use(
      http.get('*/api/scorers/:playerId', () => {
        requestCount += 1;
        if (requestCount === 1) {
          return HttpResponse.json({ message: 'API Error' }, { status: 500 });
        }
        return HttpResponse.json(HISTORICAL_SCORER_DETAIL_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useHistoricalScorerDetail(1524), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => expect(result.current.scorer).toEqual(HISTORICAL_SCORER_DETAIL_FIXTURE));
    expect(requestCount).toBe(2);
  });
});
