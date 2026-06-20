import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { TEAMS_RESPONSE_FIXTURE } from '@/test/fixtures/teams.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useUIStore } from '@/store/ui.store';
import { useTeams } from './useTeams';

describe('useTeams', () => {
  it('returns teams including dissolved selections', async () => {
    const { result } = renderHook(() => useTeams(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.teams).toEqual(TEAMS_RESPONSE_FIXTURE.data);
    expect(result.current.teams.some((team) => team.isDissolved)).toBe(true);
  });

  it('refetches localized teams when the language changes', async () => {
    const receivedLanguages: string[] = [];
    server.use(
      http.get('*/api/teams', ({ request }) => {
        const language = request.headers.get('Accept-Language') ?? 'es';
        receivedLanguages.push(language);
        return HttpResponse.json({
          ...TEAMS_RESPONSE_FIXTURE,
          data: TEAMS_RESPONSE_FIXTURE.data.map((team) => ({
            ...team,
            name: language === 'en' && team.code === 'URS' ? 'Soviet Union' : team.name,
          })),
        });
      }),
    );

    const { result } = renderHook(() => useTeams(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.teams[1]?.name).toBe('Unión Soviética'));

    act(() => {
      useUIStore.getState().setLanguage('en');
    });

    await waitFor(() => expect(result.current.teams[1]?.name).toBe('Soviet Union'));
    expect(receivedLanguages).toEqual(['es', 'en']);
  });

  it('returns an error state when teams fail', async () => {
    server.use(
      http.get('*/api/teams', () =>
        HttpResponse.json({ message: 'API Error' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useTeams(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.teams).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
