import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HistoricalScorersPage from './HistoricalScorersPage';
import { useHistoricalScorers } from '../hooks/useHistoricalScorers';
import { useTeams } from '../hooks/useTeams';
import { HISTORICAL_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/historicalScorers.fixture';
import { TEAMS_RESPONSE_FIXTURE } from '@/test/fixtures/teams.fixture';

vi.mock('../hooks/useHistoricalScorers', () => ({
  useHistoricalScorers: vi.fn(),
}));

vi.mock('../hooks/useTeams', () => ({
  useTeams: vi.fn(),
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
    vi.mocked(useTeams).mockReturnValue({
      teams: TEAMS_RESPONSE_FIXTURE.data,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it('shows loading while either query is pending', () => {
    vi.mocked(useHistoricalScorers).mockReturnValue({
      scorers: [],
      pagination: HISTORICAL_SCORERS_RESPONSE_FIXTURE.pagination,
      isLoading: true,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Cargando...');
  });

  it('shows an error when the scorers query fails', () => {
    vi.mocked(useHistoricalScorers).mockReturnValue({
      scorers: [],
      pagination: HISTORICAL_SCORERS_RESPONSE_FIXTURE.pagination,
      isLoading: false,
      isError: true,
      error: new Error('API Error'),
    });

    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent('API Error');
  });

  it('renders scorers and team filters when both queries resolve', () => {
    vi.mocked(useHistoricalScorers).mockReturnValue({
      scorers: HISTORICAL_SCORERS_RESPONSE_FIXTURE.data,
      pagination: HISTORICAL_SCORERS_RESPONSE_FIXTURE.pagination,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText('Miroslav Klose')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Unión Soviética' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
