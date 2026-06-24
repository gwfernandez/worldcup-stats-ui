import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { PLAYER_GOALS_RESPONSE_FIXTURE } from '@/test/fixtures/playerGoals.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { playerGoalsQueryKey, usePlayerGoals } from './usePlayerGoals';

describe('usePlayerGoals', () => {
  it('exposes the query key with player, year and language', () => {
    expect(playerGoalsQueryKey(101, 1950, 'es')).toEqual(['player-goals', 101, 1950, 'es']);
  });

  it('does not request goals when there is no selected player', async () => {
    let requestCount = 0;
    server.use(
      http.get('*/api/players/:playerId/goals', () => {
        requestCount += 1;
        return HttpResponse.json(PLAYER_GOALS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => usePlayerGoals(null, 1950), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.goals).toEqual([]);
    expect(requestCount).toBe(0);
  });

  it('returns loading state before the request resolves', () => {
    server.use(
      http.get('*/api/players/:playerId/goals', async () => {
        await delay('infinite');
        return HttpResponse.json(PLAYER_GOALS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => usePlayerGoals(101, 1950), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.goals).toEqual([]);
    expect(result.current.isError).toBe(false);
  });

  it('requests goals using player, year and page size', async () => {
    const requestedUrls: URL[] = [];
    server.use(
      http.get('*/api/players/:playerId/goals', ({ request }) => {
        requestedUrls.push(new URL(request.url));
        return HttpResponse.json(PLAYER_GOALS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => usePlayerGoals(101, 1950), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(requestedUrls).toHaveLength(1);
    const requestedUrl = requestedUrls[0] as URL;
    expect(requestedUrl.pathname).toBe('/api/players/101/goals');
    expect(requestedUrl.searchParams.get('year')).toBe('1950');
    expect(requestedUrl.searchParams.get('page')).toBe('1');
    expect(requestedUrl.searchParams.get('size')).toBe('100');
    expect(result.current.goals).toEqual(PLAYER_GOALS_RESPONSE_FIXTURE.data);
  });

  it('returns an error state when the endpoint fails', async () => {
    server.use(
      http.get('*/api/players/:playerId/goals', () =>
        HttpResponse.json({ message: 'API Error' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => usePlayerGoals(101, 1950), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.goals).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
