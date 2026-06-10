import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import HistoricalScorersPage from './HistoricalScorersPage';
import { useHistoricalScorers } from '../hooks/useHistoricalScorers';
import { MOCK_HISTORICAL_SCORERS } from '../mocks/historicalScorers.mock';

vi.mock('../hooks/useHistoricalScorers', () => ({
  useHistoricalScorers: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <HistoricalScorersPage />
    </MemoryRouter>,
  );
}

describe('HistoricalScorersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el estado de carga mientras el query está pendiente', () => {
    vi.mocked(useHistoricalScorers).mockReturnValue({
      scorers: [],
      isLoading: true,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Cargando...');
    expect(screen.queryByText('Miroslav Klose')).not.toBeInTheDocument();
  });

  it('muestra un mensaje de error cuando el query falla', () => {
    vi.mocked(useHistoricalScorers).mockReturnValue({
      scorers: [],
      isLoading: false,
      isError: true,
      error: new Error('API Error'),
    });

    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent('API Error');
  });

  it('renderiza la tabla de goleadores cuando los datos están disponibles', () => {
    vi.mocked(useHistoricalScorers).mockReturnValue({
      scorers: MOCK_HISTORICAL_SCORERS,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText('Miroslav Klose')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
