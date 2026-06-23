import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CHAMPIONSHIP_SQUAD_FIXTURE } from '@/test/fixtures/championshipSquad.fixture';
import { CHAMPIONSHIP_TEAMS_FIXTURE } from '@/test/fixtures/championshipTeams.fixture';
import { useChampionshipSquad } from '../../hooks/useChampionshipSquad';
import { PlayersModal } from './PlayersModal';

vi.mock('../../hooks/useChampionshipSquad', () => ({
  useChampionshipSquad: vi.fn(),
}));

const selectedTeam = CHAMPIONSHIP_TEAMS_FIXTURE[0];

const defaultResult = {
  players: CHAMPIONSHIP_SQUAD_FIXTURE,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
};

describe('PlayersModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useChampionshipSquad).mockReturnValue(defaultResult);
  });

  it('does not render without a selected team', () => {
    const { container } = render(<PlayersModal year={1950} team={null} onClose={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
    expect(useChampionshipSquad).toHaveBeenCalledWith(1950, null);
  });

  it('renders selected row metadata and loads the matching squad', () => {
    render(<PlayersModal year={1950} team={selectedTeam} onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog', { name: 'Plantel de Uruguay' });
    expect(useChampionshipSquad).toHaveBeenCalledWith(1950, 'URY');
    expect(within(dialog).getByText('Uruguay - Plantel')).toBeInTheDocument();
    expect(within(dialog).getByText('Juan López Fontana')).toBeInTheDocument();
    expect(within(dialog).getByText('CONMEBOL')).toBeInTheDocument();
    expect(within(dialog).queryByText('Grupo 4')).not.toBeInTheDocument();
    expect(within(dialog).queryByText('🏆 Campeón')).not.toBeInTheDocument();
  });

  it('keeps the backend squad order and renders null values as dashes', () => {
    render(<PlayersModal year={1950} team={selectedTeam} onClose={vi.fn()} />);

    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    expect(rows.map((row) => row.children[0].textContent)).toEqual(['7', '1', '—']);
    expect(rows[0]).toHaveTextContent('Alcides');
    expect(rows[1]).toHaveTextContent('Roque');
    expect(rows[2]).toHaveTextContent('Obdulio');
    expect(rows[2]).toHaveTextContent('—');
  });

  it('shows loading, error with retry, and empty states', async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    vi.mocked(useChampionshipSquad).mockReturnValue({
      ...defaultResult,
      players: [],
      isLoading: true,
    });

    const { rerender } = render(<PlayersModal year={1950} team={selectedTeam} onClose={vi.fn()} />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando plantel...');

    vi.mocked(useChampionshipSquad).mockReturnValue({
      ...defaultResult,
      players: [],
      isError: true,
      refetch,
    });
    rerender(<PlayersModal year={1950} team={selectedTeam} onClose={vi.fn()} />);
    expect(screen.getByText('No se pudo cargar el plantel.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(refetch).toHaveBeenCalledTimes(1);

    vi.mocked(useChampionshipSquad).mockReturnValue({
      ...defaultResult,
      players: [],
    });
    rerender(<PlayersModal year={1950} team={selectedTeam} onClose={vi.fn()} />);
    expect(screen.getByText('No se encontraron jugadores con esos filtros')).toBeInTheDocument();
  });
});
