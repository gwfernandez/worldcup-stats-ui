import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipStadiums.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { useUIStore } from '@/store/ui.store';
import { championshipStadiumsQueryKey, useChampionshipStadiums } from './useChampionshipStadiums';

describe('useChampionshipStadiums', () => {
  it('exposes the query key with year and language', () => {
    expect(championshipStadiumsQueryKey(1930, 'es')).toEqual([
      'championship-stadiums',
      1930,
      'es',
    ]);
  });

  it('returns loading state before the request resolves', () => {
    server.use(
      http.get('*/api/championships/:year/stadiums', async () => {
        await delay('infinite');
        return HttpResponse.json(CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionshipStadiums(1930), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.stadiums).toEqual([]);
    expect(result.current.isError).toBe(false);
  });

  it('requests stadiums using the selected year', async () => {
    let requestedPath = '';
    server.use(
      http.get('*/api/championships/:year/stadiums', ({ request }) => {
        requestedPath = new URL(request.url).pathname;
        return HttpResponse.json(CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE);
      }),
    );

    const { result } = renderHook(() => useChampionshipStadiums(1930), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(requestedPath).toBe('/api/championships/1930/stadiums');
    expect(result.current.stadiums).toEqual(CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE.data);
  });

  it('refetches localized country names when language changes', async () => {
    const receivedLanguages: string[] = [];
    server.use(
      http.get('*/api/championships/:year/stadiums', ({ request }) => {
        const language = request.headers.get('Accept-Language') ?? 'es';
        receivedLanguages.push(language);
        return HttpResponse.json({
          ...CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE,
          data: CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE.data.map((stadium) => ({
            ...stadium,
            country:
              language === 'en' && stadium.country?.code === 'BRA'
                ? { ...stadium.country, name: 'Brazil' }
                : stadium.country,
          })),
        });
      }),
    );

    const { result } = renderHook(() => useChampionshipStadiums(1950), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.stadiums[1].country?.name).toBe('Brasil');

    act(() => {
      useUIStore.getState().setLanguage('en');
    });

    await waitFor(() => expect(result.current.stadiums[1].country?.name).toBe('Brazil'));
    expect(receivedLanguages).toEqual(['es', 'en']);
  });

  it('returns an error state when the endpoint fails', async () => {
    server.use(
      http.get('*/api/championships/:year/stadiums', () =>
        HttpResponse.json({ message: 'API Error' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useChampionshipStadiums(1930), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.stadiums).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
