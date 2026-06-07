import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import ChampionshipsPage from './ChampionshipsPage';
import { useChampionships } from '@/features/championships/hooks/useChampionships';
import { MOCK_CHAMPIONSHIPS } from '@/features/championships/mocks/championship.mock';

vi.mock('@/features/championships/hooks/useChampionships', () => ({
  useChampionships: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <ChampionshipsPage />
    </MemoryRouter>,
  );
}

describe('ChampionshipsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el estado de carga mientras el query está pendiente', () => {
    vi.mocked(useChampionships).mockReturnValue({
      championships: [],
      isLoading: true,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Cargando...');
    expect(screen.queryByText('1930')).not.toBeInTheDocument();
  });

  it('muestra un mensaje de error cuando el query falla', () => {
    vi.mocked(useChampionships).mockReturnValue({
      championships: [],
      isLoading: false,
      isError: true,
      error: new Error('Network Error'),
    });

    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent('Network Error');
  });

  it('renderiza los mundiales cuando los datos están disponibles', () => {
    vi.mocked(useChampionships).mockReturnValue({
      championships: MOCK_CHAMPIONSHIPS,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByRole('link', { name: /1930/i })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
