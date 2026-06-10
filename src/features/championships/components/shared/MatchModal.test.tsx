import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MatchModal } from './MatchModal';
import type { Match } from '@/types/championship.types';

const FINAL_MATCH: Match = {
  id: 1,
  date: '21 Jun',
  homeTeam: 'Brasil',
  homeTeamCode: 'BR',
  awayTeam: 'Italia',
  awayTeamCode: 'IT',
  homeScore: 4,
  awayScore: 1,
  stadium: 'Estadio Azteca',
  attendance: 107000,
  phase: 'Final',
  goals: [
    { id: 1, minute: 18, playerName: 'Pelé', teamCode: 'BR', type: 'header' },
    { id: 2, minute: 37, playerName: 'Boninsegna', teamCode: 'IT', type: 'normal' },
    { id: 3, minute: 66, playerName: 'Gérson', teamCode: 'BR', type: 'penalty' },
  ],
};

describe('MatchModal', () => {
  it('no renderiza nada cuando no hay partido seleccionado', () => {
    const { container } = render(<MatchModal match={null} onClose={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('muestra detalle de partido, marcador, metadata y goles', () => {
    render(<MatchModal match={FINAL_MATCH} onClose={vi.fn()} />);

    expect(
      screen.getByRole('dialog', { name: 'Detalle del partido Brasil vs Italia' }),
    ).toBeInTheDocument();
    expect(screen.getByText('4 – 1')).toBeInTheDocument();
    expect(screen.getByText('107,000 esp.')).toBeInTheDocument();
    expect(screen.getByText('Pelé')).toBeInTheDocument();
    expect(screen.getByText('(cabeza)')).toBeInTheDocument();
    expect(screen.getByText('(penal)')).toBeInTheDocument();
  });

  it('muestra vs y mensaje sin goles para partidos sin resultado', () => {
    render(
      <MatchModal
        match={{
          ...FINAL_MATCH,
          id: 2,
          homeScore: null,
          awayScore: null,
          date: '',
          stadium: null,
          attendance: null,
          goals: [],
        }}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('vs')).toBeInTheDocument();
    expect(screen.getByText('Sin detalle de goles disponible')).toBeInTheDocument();
  });

  it('cierra con botón, overlay y Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<MatchModal match={FINAL_MATCH} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    await user.click(screen.getByRole('dialog', { name: 'Detalle del partido Brasil vs Italia' }));
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
