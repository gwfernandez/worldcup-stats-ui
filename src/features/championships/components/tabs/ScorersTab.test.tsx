import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ScorersTab } from './ScorersTab';
import type { Scorer } from '@/types/scorer.types';

const createScorer = (id: number, overrides: Partial<Scorer> = {}): Scorer => ({
  id,
  playerName: `Goleador ${id}`,
  teamName: id % 2 === 0 ? 'Italia' : 'Brasil',
  teamCode: id % 2 === 0 ? 'IT' : 'BR',
  totalGoals: 12 - id,
  matchesPlayed: 5,
  average: 1.2,
  goals: [
    {
      id: id * 10,
      date: '10 Jun',
      minute: 20 + id,
      rivalTeam: 'Uruguay',
      rivalTeamCode: 'UY',
      phase: id % 2 === 0 ? 'Final' : 'Grupo 1',
    },
  ],
  ...overrides,
});

const SCORERS: Scorer[] = [
  createScorer(1, { playerName: 'Pelé', teamName: 'Brasil', teamCode: 'BR' }),
  ...Array.from({ length: 11 }, (_, index) => createScorer(index + 2)),
];

describe('ScorersTab', () => {
  it('renderiza goleadores y filtra por nombre', async () => {
    const user = userEvent.setup();

    render(<ScorersTab scorers={SCORERS} />);

    expect(screen.getByText('Pelé')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Buscar jugador...'), 'Pelé');

    expect(screen.getByText('Pelé')).toBeInTheDocument();
    expect(screen.queryByText('Goleador 2')).not.toBeInTheDocument();
  });

  it('filtra por selección y fase', async () => {
    const user = userEvent.setup();

    render(<ScorersTab scorers={SCORERS} />);

    await user.selectOptions(screen.getByDisplayValue('Todas las selecciones'), 'IT');
    await user.selectOptions(screen.getByDisplayValue('Todas las fases'), 'Final');

    expect(screen.getByText('Goleador 2')).toBeInTheDocument();
    expect(screen.queryByText('Pelé')).not.toBeInTheDocument();
  });

  it('cambia los datos visibles al paginar', async () => {
    const user = userEvent.setup();

    render(<ScorersTab scorers={SCORERS} />);

    expect(screen.getByText('Pelé')).toBeInTheDocument();
    expect(screen.queryByText('Goleador 12')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Página siguiente' }));

    expect(screen.getByText('Goleador 12')).toBeInTheDocument();
    expect(screen.queryByText('Pelé')).not.toBeInTheDocument();
  });

  it('abre el modal de detalle al hacer click en una fila', async () => {
    const user = userEvent.setup();

    render(<ScorersTab scorers={SCORERS} />);

    await user.click(screen.getByText('Pelé'));

    const dialog = screen.getByRole('dialog', { name: 'Detalle de goles de Pelé' });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/Pelé/)).toBeInTheDocument();
    expect(within(dialog).getByText('Uruguay')).toBeInTheDocument();
  });
});
