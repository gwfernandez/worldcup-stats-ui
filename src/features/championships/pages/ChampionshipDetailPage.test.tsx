import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipStandings.fixture';
import { CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipTeams.fixture';
import { resetUIStore, useUIStore } from '@/store/ui.store';
import ChampionshipDetailPage from './ChampionshipDetailPage';

function renderAtPath(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const router = createMemoryRouter(
    [
      { path: '/', element: <div>Home</div> },
      { path: '/worldcup/:year', element: <ChampionshipDetailPage /> },
    ],
    { initialEntries: [path] },
  );

  const renderResult = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return { ...renderResult, router };
}

describe('ChampionshipDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
    resetUIStore();
  });

  it('shows 2022 when navigating to /worldcup/2022', async () => {
    renderAtPath('/worldcup/2022');

    expect(await screen.findByText('2022')).toBeInTheDocument();
    expect(screen.getByText(/La Copa Mundial de la FIFA de 2022 se celebró/)).toBeInTheDocument();
  });

  it('shows 1994 when navigating to /worldcup/1994', async () => {
    renderAtPath('/worldcup/1994');

    expect(await screen.findByText('1994')).toBeInTheDocument();
    expect(screen.getByText(/La Copa Mundial de la FIFA de 1994 se celebró/)).toBeInTheDocument();
  });

  it('does not render the unavailable stats tab', async () => {
    renderAtPath('/worldcup/1994');

    expect(await screen.findByText('1994')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Estadísticas' })).not.toBeInTheDocument();
  });

  it('redirects to home when year param is not a valid number', () => {
    renderAtPath('/worldcup/invalid');

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText(/La Copa Mundial de la FIFA/)).not.toBeInTheDocument();
  });

  it('requests the teams endpoint for the route year when opening the teams tab', async () => {
    const user = userEvent.setup();
    let requestedPath = '';
    server.use(
      http.get('*/api/championships/:year/teams', ({ request }) => {
        requestedPath = new URL(request.url).pathname;
        return HttpResponse.json(CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE);
      }),
    );

    renderAtPath('/worldcup/1950');
    await user.click(await screen.findByRole('button', { name: 'Selecciones' }));

    expect(await screen.findByText('Uruguay')).toBeInTheDocument();
    expect(requestedPath).toBe('/api/championships/1950/teams');
  });

  it('requests the standings endpoint for the route year when opening the standings tab', async () => {
    const user = userEvent.setup();
    let requestedPath = '';
    server.use(
      http.get('*/api/championships/:year/standings', ({ request }) => {
        requestedPath = new URL(request.url).pathname;
        return HttpResponse.json(CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE);
      }),
    );

    renderAtPath('/worldcup/1950');
    await user.click(await screen.findByRole('button', { name: 'Posiciones' }));

    expect(await screen.findByText('Uruguay')).toBeInTheDocument();
    expect(requestedPath).toBe('/api/championships/1950/standings');
  });

  it('resets championship team filters when navigating to a different year', async () => {
    useUIStore.getState().setSelectedYear(1950);
    useUIStore.getState().setFilters('championshipTeams', {
      name: 'Uruguay',
      confederation: 'CONMEBOL',
      group: '4',
    });
    useUIStore.getState().setFilters('championshipScorers', {
      name: 'Ademir',
      team: 'BRA',
    });
    const { router } = renderAtPath('/worldcup/1950');

    expect(await screen.findByText('1950')).toBeInTheDocument();
    expect(useUIStore.getState().filters.championshipTeams).toEqual({
      name: 'Uruguay',
      confederation: 'CONMEBOL',
      group: '4',
    });

    await router.navigate('/worldcup/2022');
    expect(await screen.findByText('2022')).toBeInTheDocument();

    expect(useUIStore.getState().selectedYear).toBe(2022);
    expect(useUIStore.getState().filters.championshipTeams).toBeUndefined();
    expect(useUIStore.getState().filters.championshipScorers).toBeUndefined();
  });

  it('keeps championship team filters when rendering the same year', async () => {
    useUIStore.getState().setSelectedYear(1950);
    useUIStore.getState().setFilter('championshipTeams', 'name', 'Uruguay');

    renderAtPath('/worldcup/1950');
    expect(await screen.findByText('1950')).toBeInTheDocument();

    expect(useUIStore.getState().filters.championshipTeams).toEqual({
      name: 'Uruguay',
    });
  });

  it('does not modify championship team filters for an invalid year', () => {
    useUIStore.getState().setSelectedYear(1950);
    useUIStore.getState().setFilter('championshipTeams', 'group', '4');

    renderAtPath('/worldcup/invalid');

    expect(useUIStore.getState().selectedYear).toBe(1950);
    expect(useUIStore.getState().filters.championshipTeams).toEqual({
      group: '4',
    });
  });
});
