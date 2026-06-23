import { act, renderHook, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE } from '@/test/fixtures/championshipSquad.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useUIStore } from '@/store/ui.store';
import { useChampionshipSquad } from './useChampionshipSquad';

describe('useChampionshipSquad', () => {
  beforeEach(() => {
    useUIStore.getState().setLanguage('es');
  });

  it('does not request the squad without a team code', () => {
    let requestCount = 0;
    server.use(
      http.get('*/api/championships/:year/squads/:teamCode', () => {
        requestCount += 1;
        return HttpResponse.json(CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionshipSquad(1950, null), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.players).toEqual([]);
    expect(requestCount).toBe(0);
  });

  it('returns a loading state and then the selected squad', async () => {
    let requestedUrl = '';
    server.use(
      http.get('*/api/championships/:year/squads/:teamCode', async ({ request }) => {
        requestedUrl = request.url;
        await delay(20);
        return HttpResponse.json(CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionshipSquad(1950, 'URY'), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const url = new URL(requestedUrl);
    expect(url.pathname).toBe('/api/championships/1950/squads/URY');
    expect(url.searchParams.get('page')).toBe('1');
    expect(url.searchParams.get('size')).toBe('100');
    expect(result.current.players).toEqual(CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE.data);
  });

  it('refetches localized squads when the language changes', async () => {
    const receivedLanguages: string[] = [];
    server.use(
      http.get('*/api/championships/:year/squads/:teamCode', ({ request }) => {
        const language = request.headers.get('Accept-Language') ?? 'es';
        receivedLanguages.push(language);
        return HttpResponse.json({
          ...CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE,
          data: CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE.data.map((player) => ({
            ...player,
            firstName:
              language === 'en' && player.playerId === 10 ? 'Alcides EN' : player.firstName,
          })),
        });
      }),
    );

    const { result } = renderHook(() => useChampionshipSquad(1950, 'URY'), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => {
      expect(result.current.players[0]?.firstName).toBe('Alcides');
    });

    act(() => {
      useUIStore.getState().setLanguage('en');
    });

    await waitFor(() => {
      expect(result.current.players[0]?.firstName).toBe('Alcides EN');
    });
    expect(receivedLanguages).toEqual(['es', 'en']);
  });
});
