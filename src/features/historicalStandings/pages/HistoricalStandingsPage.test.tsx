import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import HistoricalStandingsPage from './HistoricalStandingsPage';
import { useHistoricalStandings } from '../hooks/useHistoricalStandings';
import { MOCK_HISTORICAL_STANDINGS } from '../mocks/historicalStandings.mock';

vi.mock('../hooks/useHistoricalStandings', () => ({
  useHistoricalStandings: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <HistoricalStandingsPage />
    </MemoryRouter>,
  );
}

describe('HistoricalStandingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el estado de carga mientras el query está pendiente', () => {
    vi.mocked(useHistoricalStandings).mockReturnValue({
      standings: [],
      isLoading: true,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Cargando...');
    expect(screen.queryByText('Alemania')).not.toBeInTheDocument();
  });

  it('muestra un mensaje de error cuando el query falla', () => {
    vi.mocked(useHistoricalStandings).mockReturnValue({
      standings: [],
      isLoading: false,
      isError: true,
      error: new Error('API Error'),
    });

    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent('API Error');
  });

  it('renderiza la tabla de posiciones cuando los datos están disponibles', () => {
    vi.mocked(useHistoricalStandings).mockReturnValue({
      standings: MOCK_HISTORICAL_STANDINGS,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getAllByText('Alemania').length).toBeGreaterThan(0);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
