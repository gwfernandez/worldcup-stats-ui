import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StadiumsTab } from './StadiumsTab';
import { CHAMPIONSHIP_STADIUMS_FIXTURE } from '@/test/fixtures/championshipStadiums.fixture';
import { CHAMPIONSHIP_STADIUM_MATCHES_FIXTURE } from '@/test/fixtures/championshipStadiumMatches.fixture';
import { useChampionshipStadiumMatches } from '../../hooks/useChampionshipStadiumMatches';
import { useChampionshipStadiums } from '../../hooks/useChampionshipStadiums';

vi.mock('../../hooks/useChampionshipStadiums', () => ({
  useChampionshipStadiums: vi.fn(),
}));

vi.mock('../../hooks/useChampionshipStadiumMatches', () => ({
  useChampionshipStadiumMatches: vi.fn(),
}));

const stadiumMatchesDefaultResult = {
  matches: CHAMPIONSHIP_STADIUM_MATCHES_FIXTURE,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
};

describe('StadiumsTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useChampionshipStadiums).mockReturnValue({
      stadiums: CHAMPIONSHIP_STADIUMS_FIXTURE,
      isLoading: false,
      isError: false,
      error: null,
    });
    vi.mocked(useChampionshipStadiumMatches).mockReturnValue(stadiumMatchesDefaultResult);
  });

  it('renderiza estadios y filtra por nombre', async () => {
    const user = userEvent.setup();

    render(<StadiumsTab year={1930} />);

    expect(screen.getByText('Estadio Centenario')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Buscar estadio...'), 'Maracana');

    expect(screen.getByText('Maracana')).toBeInTheDocument();
    expect(screen.queryByText('Estadio Centenario')).not.toBeInTheDocument();
  });

  it('muestra estado vacío cuando el filtro no coincide', async () => {
    const user = userEvent.setup();

    render(<StadiumsTab year={1930} />);

    await user.type(screen.getByPlaceholderText('Buscar estadio...'), 'Sin coincidencias');

    expect(screen.getByText('No se encontraron estadios con esos filtros')).toBeInTheDocument();
  });

  it('renderiza guion cuando un estadio no tiene pais asociado', () => {
    render(<StadiumsTab year={1930} />);

    const row = screen.getByText('Estadio sin pais').closest('tr');

    expect(row).not.toBeNull();
    expect(within(row as HTMLTableRowElement).getByText('—')).toBeInTheDocument();
  });

  it('muestra estado de carga y error desde el hook', () => {
    vi.mocked(useChampionshipStadiums).mockReturnValueOnce({
      stadiums: [],
      isLoading: true,
      isError: false,
      error: null,
    });
    const { rerender } = render(<StadiumsTab year={1930} />);
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();

    vi.mocked(useChampionshipStadiums).mockReturnValueOnce({
      stadiums: [],
      isLoading: false,
      isError: true,
      error: new Error('API Error'),
    });
    rerender(<StadiumsTab year={1930} />);
    expect(screen.getByText('No se pudieron cargar los estadios.')).toBeInTheDocument();
  });

  it('abre partidos de un estadio con encabezado de la fila y datos del endpoint', async () => {
    const user = userEvent.setup();

    render(<StadiumsTab year={1930} />);

    await user.click(screen.getByRole('button', { name: 'Ver partidos en Estadio Centenario' }));

    const stadiumDialog = screen.getByRole('dialog', { name: 'Partidos en Estadio Centenario' });
    expect(stadiumDialog).toBeInTheDocument();
    expect(useChampionshipStadiumMatches).toHaveBeenLastCalledWith(1930, 1);
    expect(within(stadiumDialog).getByText(/Montevideo/)).toBeInTheDocument();
    expect(
      within(stadiumDialog).getByText(CHAMPIONSHIP_STADIUMS_FIXTURE[0].capacity.toLocaleString()),
    ).toBeInTheDocument();
    expect(within(stadiumDialog).getByText('10')).toBeInTheDocument();
    expect(within(stadiumDialog).getByText('1930-07-13')).toBeInTheDocument();
    expect(within(stadiumDialog).getByText('Francia')).toBeInTheDocument();
    expect(within(stadiumDialog).getByText('4 – 1')).toBeInTheDocument();
    expect(within(stadiumDialog).getByText('Mexico')).toBeInTheDocument();
    expect(
      within(stadiumDialog).queryByRole('button', { name: /Francia.*Mexico/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: /Detalle del partido/i })).not.toBeInTheDocument();
  });

  it('muestra estados de carga, error y vacío para partidos del estadio', async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    vi.mocked(useChampionshipStadiumMatches).mockReturnValue({
      ...stadiumMatchesDefaultResult,
      matches: [],
      isLoading: true,
    });

    const { rerender } = render(<StadiumsTab year={1930} />);
    await user.click(screen.getByRole('button', { name: 'Ver partidos en Estadio Centenario' }));
    expect(screen.getByRole('status')).toHaveTextContent('Cargando partidos del estadio...');

    vi.mocked(useChampionshipStadiumMatches).mockReturnValue({
      ...stadiumMatchesDefaultResult,
      matches: [],
      isError: true,
      refetch,
    });
    rerender(<StadiumsTab year={1930} />);
    expect(screen.getByText('No se pudieron cargar los partidos del estadio.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(refetch).toHaveBeenCalledTimes(1);

    vi.mocked(useChampionshipStadiumMatches).mockReturnValue({
      ...stadiumMatchesDefaultResult,
      matches: [],
    });
    rerender(<StadiumsTab year={1930} />);
    expect(screen.getByText('No hay partidos disponibles para este estadio.')).toBeInTheDocument();
  });
});
