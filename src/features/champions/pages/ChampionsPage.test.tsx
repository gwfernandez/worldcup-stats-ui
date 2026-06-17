import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import ChampionsPage from './ChampionsPage';
import { useChampions } from '../hooks/useChampions';
import { MOCK_CHAMPIONS, MOCK_CHAMPIONS_RESPONSE } from '../mocks/champions.mock';

vi.mock('../hooks/useChampions', () => ({
  useChampions: vi.fn(),
}));

const emptyPagination = {
  page: 1,
  size: 15,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
};

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

  it('shows the loading state while the query is pending', () => {
    vi.mocked(useChampions).mockReturnValue({
      champions: [],
      pagination: emptyPagination,
      isLoading: true,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Cargando...');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows an error message when the query fails', () => {
    vi.mocked(useChampions).mockReturnValue({
      champions: [],
      pagination: emptyPagination,
      isLoading: false,
      isError: true,
      error: new Error('API Error'),
    });

    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent('API Error');
  });

  it('renders the eight champions and the API total', () => {
    vi.mocked(useChampions).mockReturnValue({
      champions: MOCK_CHAMPIONS,
      pagination: MOCK_CHAMPIONS_RESPONSE.pagination,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(9);
    expect(screen.getAllByText('8')).toHaveLength(2);
  });

  it('filters champions locally by team name', async () => {
    const user = userEvent.setup();
    vi.mocked(useChampions).mockReturnValue({
      champions: MOCK_CHAMPIONS,
      pagination: MOCK_CHAMPIONS_RESPONSE.pagination,
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

  it('filters champions locally by confederation', async () => {
    const user = userEvent.setup();
    vi.mocked(useChampions).mockReturnValue({
      champions: MOCK_CHAMPIONS,
      pagination: MOCK_CHAMPIONS_RESPONSE.pagination,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();
    await user.selectOptions(screen.getByRole('combobox'), 'CONMEBOL');

    const table = screen.getByRole('table');
    expect(within(table).getByText('Argentina')).toBeInTheDocument();
    expect(within(table).queryByText('Alemania')).not.toBeInTheDocument();
  });

  it('opens the mocked title details for a champion', async () => {
    const user = userEvent.setup();
    vi.mocked(useChampions).mockReturnValue({
      champions: MOCK_CHAMPIONS,
      pagination: MOCK_CHAMPIONS_RESPONSE.pagination,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();
    await user.click(screen.getByRole('button', { name: 'Ver títulos de Argentina' }));

    const dialog = screen.getByRole('dialog', { name: 'Títulos de Argentina' });
    expect(within(dialog).getAllByText('2022')).toHaveLength(2);
    expect(within(dialog).getByText('Qatar')).toBeInTheDocument();
  });

  it('falls back to the API years when mocked title details are unavailable', async () => {
    const user = userEvent.setup();
    const championWithoutDetails = {
      team: { code: 'NLD', name: 'Países Bajos' },
      wins: 1,
      years: [2030],
      confederationCode: 'UEFA',
    };
    vi.mocked(useChampions).mockReturnValue({
      champions: [championWithoutDetails],
      pagination: { ...MOCK_CHAMPIONS_RESPONSE.pagination, totalElements: 1 },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();
    await user.click(screen.getByRole('button', { name: 'Ver títulos de Países Bajos' }));

    const dialog = screen.getByRole('dialog', { name: 'Títulos de Países Bajos' });
    expect(within(dialog).getAllByText('2030')).toHaveLength(3);
    expect(within(dialog).getAllByText('—')).toHaveLength(2);
  });
});
