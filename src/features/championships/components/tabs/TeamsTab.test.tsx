import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TeamsTab } from './TeamsTab';
import type { Team } from '@/types/team.types';

const createTeam = (id: number, overrides: Partial<Team> = {}): Team => ({
  id,
  name: `Selección ${id}`,
  teamCode: `T${id}`,
  confederation: id % 2 === 0 ? 'UEFA' : 'CONMEBOL',
  group: id % 2 === 0 ? 'Grupo B' : 'Grupo A',
  coach: `DT ${id}`,
  performance: 'group_stage',
  players: [
    {
      id: id * 10,
      number: 10,
      firstName: `Jugador ${id}`,
      lastName: 'Prueba',
      position: 'forward',
    },
  ],
  ...overrides,
});

const TEAMS: Team[] = [
  createTeam(1, { name: 'Argentina', teamCode: 'AR', coach: 'Lionel Scaloni' }),
  ...Array.from({ length: 11 }, (_, index) => createTeam(index + 2)),
];

describe('TeamsTab', () => {
  it('renderiza equipos y filtra por nombre', async () => {
    const user = userEvent.setup();

    render(<TeamsTab teams={TEAMS} />);

    expect(screen.getByText('Argentina')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Buscar selección...'), 'Argentina');

    expect(screen.getByText('Argentina')).toBeInTheDocument();
    expect(screen.queryByText('Selección 2')).not.toBeInTheDocument();
  });

  it('filtra por confederación y grupo', async () => {
    const user = userEvent.setup();

    render(<TeamsTab teams={TEAMS} />);

    await user.selectOptions(screen.getByDisplayValue('Todas las confederaciones'), 'UEFA');
    await user.selectOptions(screen.getByDisplayValue('Todos los grupos'), 'Grupo B');

    expect(screen.getByText('Selección 2')).toBeInTheDocument();
    expect(screen.queryByText('Argentina')).not.toBeInTheDocument();
  });

  it('cambia los datos visibles al paginar', async () => {
    const user = userEvent.setup();

    render(<TeamsTab teams={TEAMS} />);

    expect(screen.getByText('Argentina')).toBeInTheDocument();
    expect(screen.queryByText('Selección 12')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Página siguiente' }));

    expect(screen.getByText('Selección 12')).toBeInTheDocument();
    expect(screen.queryByText('Argentina')).not.toBeInTheDocument();
  });

  it('abre el modal de jugadores al hacer click en la acción de una selección', async () => {
    const user = userEvent.setup();

    render(<TeamsTab teams={TEAMS} />);

    await user.click(screen.getByRole('button', { name: 'Ver jugadores de Argentina' }));

    const dialog = screen.getByRole('dialog', { name: 'Plantel de Argentina' });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/Lionel Scaloni/)).toBeInTheDocument();
    expect(within(dialog).getByText('Jugador 1')).toBeInTheDocument();
  });
});
