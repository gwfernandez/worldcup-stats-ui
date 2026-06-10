import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import ChampionsPage from './ChampionsPage';
import { useChampions } from '../hooks/useChampions';
import { MOCK_CHAMPIONS } from '../mocks/champions.mock';

vi.mock('../hooks/useChampions', () => ({
  useChampions: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <ChampionsPage />
    </MemoryRouter>,
  );
}

describe('ChampionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el estado de carga mientras el query está pendiente', () => {
    vi.mocked(useChampions).mockReturnValue({
      champions: [],
      isLoading: true,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Cargando...');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('muestra un mensaje de error cuando el query falla', () => {
    vi.mocked(useChampions).mockReturnValue({
      champions: [],
      isLoading: false,
      isError: true,
      error: new Error('API Error'),
    });

    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent('API Error');
  });

  it('renderiza la tabla de campeones cuando los datos están disponibles', () => {
    vi.mocked(useChampions).mockReturnValue({
      champions: MOCK_CHAMPIONS,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('filtra campeones por búsqueda de selección', async () => {
    const user = userEvent.setup();
    vi.mocked(useChampions).mockReturnValue({
      champions: MOCK_CHAMPIONS,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    await user.type(screen.getByPlaceholderText('Buscar selección...'), 'Argentina');

    const table = screen.getByRole('table');
    expect(within(table).getByText('Argentina')).toBeInTheDocument();
    expect(within(table).queryByText('Brasil')).not.toBeInTheDocument();
  });

  it('abre el modal de títulos al hacer click en una acción de la tabla', async () => {
    const user = userEvent.setup();
    vi.mocked(useChampions).mockReturnValue({
      champions: MOCK_CHAMPIONS,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    await user.click(screen.getByRole('button', { name: 'Ver títulos de Argentina' }));

    const dialog = screen.getByRole('dialog', { name: 'Títulos de Argentina' });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getAllByText('2022')).toHaveLength(2);
  });
});
