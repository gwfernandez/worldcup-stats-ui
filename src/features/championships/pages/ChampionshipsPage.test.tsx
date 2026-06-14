import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import ChampionshipsPage from './ChampionshipsPage';
import { useChampionships } from '../hooks/useChampionships';
import { MOCK_CHAMPIONSHIPS } from '../mocks/championship.mock';

vi.mock('../hooks/useChampionships', () => ({
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

  it('renderiza la primera sede activa cuando un mundial tiene multiples anfitriones', () => {
    vi.mocked(useChampionships).mockReturnValue({
      championships: MOCK_CHAMPIONSHIPS,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByRole('link', { name: /2026/i })).toBeInTheDocument();
    expect(screen.getAllByText('Estados Unidos').length).toBeGreaterThan(0);
    expect(screen.getByRole('img', { name: 'Estados Unidos' })).toHaveClass('fi-us');
    expect(screen.queryByText('Canada')).not.toBeInTheDocument();
  });

  it('filtra las ediciones por confederacion organizadora', async () => {
    const user = userEvent.setup();
    vi.mocked(useChampionships).mockReturnValue({
      championships: MOCK_CHAMPIONSHIPS,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    await user.click(screen.getByRole('button', { name: 'UEFA' }));

    expect(screen.getByRole('heading', { name: /Ediciones\s*\(11\)/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /1966/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /1930/i })).not.toBeInTheDocument();
  });

  it('filtra las ediciones con el select mobile de confederacion', async () => {
    const user = userEvent.setup();
    vi.mocked(useChampionships).mockReturnValue({
      championships: MOCK_CHAMPIONSHIPS,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    const mobileConfederationSelect = screen.getByDisplayValue('Todas');

    expect(mobileConfederationSelect.parentElement).toHaveClass(
      'w-1/2',
      'min-w-[132px]',
      'md:hidden',
    );

    await user.selectOptions(mobileConfederationSelect, 'AFC');

    expect(screen.getByRole('heading', { name: /Ediciones\s*\(2\)/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /2002/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /2022/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /1930/i })).not.toBeInTheDocument();
  });

  it('incluye mundiales multi-sede al filtrar por su confederacion', async () => {
    const user = userEvent.setup();
    vi.mocked(useChampionships).mockReturnValue({
      championships: MOCK_CHAMPIONSHIPS,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    await user.click(screen.getByRole('button', { name: 'CONCACAF' }));

    expect(screen.getByRole('heading', { name: /Ediciones\s*\(4\)/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /2026/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /1930/i })).not.toBeInTheDocument();
  });
});
