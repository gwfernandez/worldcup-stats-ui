import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipTeams.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useUIStore } from '@/store/ui.store';
import { championshipTeamsQueryKey, useChampionshipTeams } from './useChampionshipTeams';

describe('useChampionshipTeams', () => {
  it('exposes the query key with year and language', () => {
    expect(championshipTeamsQueryKey(1950, 'es')).toEqual(['championship-teams', 1950, 'es']);
  });

  it('returns loading state before the request resolves', () => {
    server.use(
      http.get('*/api/championships/:year/teams', async () => {
        await delay('infinite');
        return HttpResponse.json(CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionshipTeams(1950), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.teams).toEqual([]);
    expect(result.current.isError).toBe(false);
  });

  it('requests teams using the selected year', async () => {
    let requestedPath = '';
    server.use(
      http.get('*/api/championships/:year/teams', ({ request }) => {
        requestedPath = new URL(request.url).pathname;
        return HttpResponse.json(CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionshipTeams(1950), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(requestedPath).toBe('/api/championships/1950/teams');
    expect(result.current.teams).toEqual(CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE.data);
  });

  it('refetches localized team names when language changes', async () => {
    const receivedLanguages: string[] = [];
    server.use(
      http.get('*/api/championships/:year/teams', ({ request }) => {
        const language = request.headers.get('Accept-Language') ?? 'es';
        receivedLanguages.push(language);
        return HttpResponse.json({
          ...CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE,
          data: CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE.data.map((team) => ({
            ...team,
            team: {
              ...team.team,
              name: language === 'en' && team.team.code === 'BRA' ? 'Brazil' : team.team.name,
            },
          })),
        });
      }),
    );

    const { result } = renderHook(() => useChampionshipTeams(1950), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.teams[1].team.name).toBe('Brasil');

    act(() => {
      useUIStore.getState().setLanguage('en');
    });

    await waitFor(() => expect(result.current.teams[1].team.name).toBe('Brazil'));
    expect(receivedLanguages).toEqual(['es', 'en']);
  });

  it('returns an error state when the endpoint fails', async () => {
    server.use(
      http.get('*/api/championships/:year/teams', () =>
        HttpResponse.json({ message: 'API Error' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useChampionshipTeams(1950), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.teams).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
