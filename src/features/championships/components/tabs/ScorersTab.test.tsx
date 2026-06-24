import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/mocks/server';
import { CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipScorers.fixture';
import { CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipTeams.fixture';
import { createQueryClientWrapper } from '@/test/queryClientWrapper';
import { ScorersTab } from './ScorersTab';

describe('ScorersTab', () => {
  it('renderiza goleadores sin promedio ni filtro de fase', async () => {
    render(<ScorersTab year={1950} />, { wrapper: createQueryClientWrapper() });

    expect(await screen.findByText('Ademir')).toBeInTheDocument();
    expect(screen.getAllByText('Brasil').length).toBeGreaterThan(0);
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.queryByText('Promedio')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('Todas las fases')).not.toBeInTheDocument();
  });

  it('filtra por nombre usando el endpoint de goleadores del año', async () => {
    const user = userEvent.setup();
    const requestedUrls: URL[] = [];
    server.use(
      http.get('*/api/championships/:year/scorers', ({ request }) => {
        requestedUrls.push(new URL(request.url));
        return HttpResponse.json(CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE);
      }),
    );

    render(<ScorersTab year={1950} />, { wrapper: createQueryClientWrapper() });

    await screen.findByText('Ademir');
    await user.type(screen.getByPlaceholderText('Buscar jugador...'), 'ademir');

    await waitFor(() =>
      expect(requestedUrls.some((url) => url.searchParams.get('name') === 'ademir')).toBe(true),
    );
    expect(requestedUrls.at(-1)?.pathname).toBe('/api/championships/1950/scorers');
  });

  it('filtra por selección usando las opciones del endpoint de equipos del año', async () => {
    const user = userEvent.setup();
    const requestedScorersUrls: URL[] = [];
    const requestedTeamsUrls: URL[] = [];
    server.use(
      http.get('*/api/championships/:year/scorers', ({ request }) => {
        requestedScorersUrls.push(new URL(request.url));
        return HttpResponse.json(CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE);
      }),
      http.get('*/api/championships/:year/teams', ({ request }) => {
        requestedTeamsUrls.push(new URL(request.url));
        return HttpResponse.json(CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE);
      }),
    );

    render(<ScorersTab year={1950} />, { wrapper: createQueryClientWrapper() });

    await screen.findByText('Ademir');
    await user.selectOptions(screen.getByDisplayValue('Todas las selecciones'), 'BRA');

    await waitFor(() =>
      expect(requestedScorersUrls.at(-1)?.searchParams.get('teamCode')).toBe('BRA'),
    );
    expect(requestedTeamsUrls[0]?.pathname).toBe('/api/championships/1950/teams');
  });

  it('cambia la página visible usando paginación remota', async () => {
    const user = userEvent.setup();
    const requestedPages: string[] = [];
    server.use(
      http.get('*/api/championships/:year/scorers', ({ request }) => {
        const url = new URL(request.url);
        const page = url.searchParams.get('page') ?? '1';
        requestedPages.push(page);

        return HttpResponse.json({
          data:
            page === '2'
              ? [
                  {
                    playerId: 104,
                    fullName: 'Alcides Ghiggia',
                    team: { code: 'URY', name: 'Uruguay' },
                    goals: 3,
                  },
                ]
              : CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE.data,
          pagination: {
            page: Number(page),
            size: 10,
            totalElements: 11,
            totalPages: 2,
            hasNext: page === '1',
            hasPrevious: page === '2',
          },
        });
      }),
    );

    render(<ScorersTab year={1950} />, { wrapper: createQueryClientWrapper() });

    expect(await screen.findByText('Ademir')).toBeInTheDocument();
    expect(screen.queryByText('Alcides Ghiggia')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Página siguiente' }));

    expect(await screen.findByText('Alcides Ghiggia')).toBeInTheDocument();
    expect(screen.queryByText('Ademir')).not.toBeInTheDocument();
    expect(requestedPages).toContain('2');
  });

  it('muestra estado vacío cuando no hay goleadores', async () => {
    server.use(
      http.get('*/api/championships/:year/scorers', () =>
        HttpResponse.json({
          data: [],
          pagination: {
            page: 1,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false,
          },
        }),
      ),
    );

    render(<ScorersTab year={1950} />, { wrapper: createQueryClientWrapper() });

    expect(
      await screen.findByText('No se encontraron goleadores con esos filtros'),
    ).toBeInTheDocument();
  });
});
