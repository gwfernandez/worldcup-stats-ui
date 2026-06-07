import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import ChampionsPage from './ChampionsPage';
import { useChampions } from '@/features/champions/hooks/useChampions';
import { MOCK_CHAMPIONS } from '@/features/champions/mocks/champions.mock';

vi.mock('@/features/champions/hooks/useChampions', () => ({
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
});
