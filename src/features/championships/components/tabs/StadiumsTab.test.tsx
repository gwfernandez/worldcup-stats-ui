import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StadiumsTab } from './StadiumsTab';
import { CHAMPIONSHIP_STADIUMS_FIXTURE } from '@/test/fixtures/championshipStadiums.fixture';
import { useChampionshipStadiums } from '../../hooks/useChampionshipStadiums';

vi.mock('../../hooks/useChampionshipStadiums', () => ({
  useChampionshipStadiums: vi.fn(),
}));

describe('StadiumsTab', () => {
  beforeEach(() => {
    vi.mocked(useChampionshipStadiums).mockReturnValue({
      stadiums: CHAMPIONSHIP_STADIUMS_FIXTURE,
      isLoading: false,
      isError: false,
      error: null,
    });
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

  it('abre partidos de un estadio y luego el detalle de partido', async () => {
    const user = userEvent.setup();

    render(<StadiumsTab year={1930} />);

    await user.click(screen.getByRole('button', { name: 'Ver partidos en Estadio Centenario' }));

    const stadiumDialog = screen.getByRole('dialog', { name: 'Partidos en Estadio Centenario' });
    expect(stadiumDialog).toBeInTheDocument();
    expect(within(stadiumDialog).getByText(/Montevideo/)).toBeInTheDocument();

    await user.click(within(stadiumDialog).getByRole('button', { name: /Brasil.*Italia/i }));

    const matchDialog = screen.getByRole('dialog', {
      name: 'Detalle del partido Brasil vs Italia',
    });
    expect(matchDialog).toBeInTheDocument();
    expect(within(matchDialog).getByText('Pele')).toBeInTheDocument();
    expect(
      screen.queryByRole('dialog', { name: 'Partidos en Estadio Centenario' }),
    ).not.toBeInTheDocument();
  });
});
