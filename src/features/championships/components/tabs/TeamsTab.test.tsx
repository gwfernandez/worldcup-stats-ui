import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CHAMPIONSHIP_TEAMS_FIXTURE } from '@/test/fixtures/championshipTeams.fixture';
import { CHAMPIONSHIP_SQUAD_FIXTURE } from '@/test/fixtures/championshipSquad.fixture';
import { resetUIStore } from '@/store/ui.store';
import { useChampionshipTeams } from '../../hooks/useChampionshipTeams';
import { useChampionshipSquad } from '../../hooks/useChampionshipSquad';
import { TeamsTab } from './TeamsTab';

vi.mock('../../hooks/useChampionshipTeams', () => ({
  useChampionshipTeams: vi.fn(),
}));

vi.mock('../../hooks/useChampionshipSquad', () => ({
  useChampionshipSquad: vi.fn(),
}));

const defaultHookResult = {
  teams: CHAMPIONSHIP_TEAMS_FIXTURE,
  isLoading: false,
  isError: false,
  error: null,
};

describe('TeamsTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetUIStore();
    vi.mocked(useChampionshipTeams).mockReturnValue(defaultHookResult);
    vi.mocked(useChampionshipSquad).mockReturnValue({
      players: CHAMPIONSHIP_SQUAD_FIXTURE,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('loads the supplied year and renders every participant without pagination', () => {
    render(<TeamsTab year={1950} />);

    expect(useChampionshipTeams).toHaveBeenCalledWith(1950);
    expect(screen.getByText('Uruguay')).toBeInTheDocument();
    expect(screen.getByText('Brasil')).toBeInTheDocument();
    expect(screen.getByText('Inglaterra')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Página siguiente' })).not.toBeInTheDocument();
  });

  it('filters locally by name, confederation and group', async () => {
    const user = userEvent.setup();
    render(<TeamsTab year={1950} />);

    await user.selectOptions(screen.getByDisplayValue('Todas las confederaciones'), 'CONMEBOL');
    await user.selectOptions(screen.getByDisplayValue('Todos los grupos'), '1');
    await user.type(screen.getByPlaceholderText('Buscar selección...'), 'Brasil');

    expect(screen.getByText('Brasil')).toBeInTheDocument();
    expect(screen.queryByText('Uruguay')).not.toBeInTheDocument();
    expect(screen.queryByText('Inglaterra')).not.toBeInTheDocument();
    expect(vi.mocked(useChampionshipTeams).mock.calls.every(([year]) => year === 1950)).toBe(true);
  });

  it('shows backend performance and a fallback for missing managers', () => {
    render(<TeamsTab year={1950} />);

    expect(screen.getByText('🏆 Campeón')).toBeInTheDocument();
    expect(screen.getByText('🥈 Subcampeón')).toBeInTheDocument();
    expect(screen.getByText('Cuartos de final')).toBeInTheDocument();

    const englandRow = screen.getByText('Inglaterra').closest('tr');
    expect(englandRow).not.toBeNull();
    expect(within(englandRow as HTMLTableRowElement).getByText('—')).toBeInTheDocument();
  });

  it('shows loading, error and empty states', () => {
    vi.mocked(useChampionshipTeams).mockReturnValue({
      ...defaultHookResult,
      teams: [],
      isLoading: true,
    });
    const { rerender } = render(<TeamsTab year={1950} />);
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('table-skeleton-pagination')).not.toBeInTheDocument();

    vi.mocked(useChampionshipTeams).mockReturnValue({
      ...defaultHookResult,
      teams: [],
      isLoading: false,
      isError: true,
      error: new Error('API Error'),
    });
    rerender(<TeamsTab year={1950} />);
    expect(
      screen.getByText('No se pudieron cargar las selecciones participantes.'),
    ).toBeInTheDocument();

    vi.mocked(useChampionshipTeams).mockReturnValue({
      ...defaultHookResult,
      teams: [],
    });
    rerender(<TeamsTab year={1950} />);
    expect(screen.getByText('No se encontraron selecciones con esos filtros')).toBeInTheDocument();
  });

  it('opens the selected team squad with row metadata', async () => {
    const user = userEvent.setup();
    render(<TeamsTab year={1950} />);

    await user.click(screen.getByRole('button', { name: 'Ver jugadores de Uruguay' }));

    const dialog = screen.getByRole('dialog', { name: 'Plantel de Uruguay' });
    expect(dialog).toBeInTheDocument();
    expect(useChampionshipSquad).toHaveBeenLastCalledWith(1950, 'URY');
    expect(within(dialog).getByText('Uruguay - Plantel')).toBeInTheDocument();
    expect(within(dialog).getByText('Juan López Fontana')).toBeInTheDocument();
    expect(within(dialog).queryByText('Grupo 4')).not.toBeInTheDocument();
    expect(within(dialog).getByText('Alcides')).toBeInTheDocument();
    expect(within(dialog).queryByText('Argentina - Plantel')).not.toBeInTheDocument();
  });
});
