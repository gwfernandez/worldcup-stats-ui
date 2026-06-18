import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CHAMPION_FINALS_RESPONSE_FIXTURE } from '@/test/fixtures/championFinals.fixture';
import type { Champion } from '@/types/champion.types';
import { useChampionFinals } from '../hooks/useChampionFinals';
import { ChampionshipsModal } from './ChampionshipsModal';

vi.mock('../hooks/useChampionFinals', () => ({
  useChampionFinals: vi.fn(),
}));

const champion: Champion = {
  team: { code: 'ARG', name: 'Argentina' },
  wins: 3,
  years: [1978, 1986, 2022],
  confederationCode: 'CONMEBOL',
};

const defaultResult = {
  finals: CHAMPION_FINALS_RESPONSE_FIXTURE.data,
  pagination: CHAMPION_FINALS_RESPONSE_FIXTURE.pagination,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
};

describe('ChampionshipsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useChampionFinals).mockReturnValue(defaultResult);
  });

  it('does not render or request data without a selected team', () => {
    const { container } = render(<ChampionshipsModal team={null} onClose={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
    expect(useChampionFinals).toHaveBeenCalledWith(null);
  });

  it('renders hosts and scores from the API for home and away champions', () => {
    render(<ChampionshipsModal team={champion} onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog', { name: 'Títulos de Argentina' });
    expect(within(dialog).getByText('México')).toBeInTheDocument();
    expect(within(dialog).getByText('Emiratos Árabes Unidos')).toBeInTheDocument();
    expect(within(dialog).getByText('3–1')).toBeInTheDocument();
    expect(within(dialog).getByText('3–3 (4–2 pen.)')).toBeInTheDocument();
    expect(within(screen.getByRole('table')).getByText('2022').closest('tr')).toHaveTextContent(
      'Francia',
    );
  });

  it('shows missing hosts and scores without inventing data', () => {
    vi.mocked(useChampionFinals).mockReturnValue({
      ...defaultResult,
      finals: [
        {
          ...CHAMPION_FINALS_RESPONSE_FIXTURE.data[0],
          hostCodes: [],
          homeTeamScore: null,
          awayTeamScore: null,
        },
      ],
    });

    render(<ChampionshipsModal team={champion} onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog', { name: 'Títulos de Argentina' });
    expect(within(dialog).getAllByText('—')).toHaveLength(2);
    expect(within(screen.getByRole('table')).getByText('1978').closest('tr')).toHaveTextContent(
      'Países Bajos',
    );
  });

  it('shows loading, error with retry, and empty states', async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    vi.mocked(useChampionFinals).mockReturnValue({
      ...defaultResult,
      finals: [],
      isLoading: true,
    });

    const { rerender } = render(<ChampionshipsModal team={champion} onClose={vi.fn()} />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando finales ganadas...');

    vi.mocked(useChampionFinals).mockReturnValue({
      ...defaultResult,
      finals: [],
      isError: true,
      error: new Error('API Error'),
      refetch,
    });
    rerender(<ChampionshipsModal team={champion} onClose={vi.fn()} />);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se pudieron cargar las finales ganadas.',
    );
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(refetch).toHaveBeenCalledOnce();

    vi.mocked(useChampionFinals).mockReturnValue({
      ...defaultResult,
      finals: [],
    });
    rerender(<ChampionshipsModal team={champion} onClose={vi.fn()} />);
    expect(
      screen.getByText('No hay finales ganadas disponibles para esta selección.'),
    ).toBeInTheDocument();
  });

  it('closes with Escape and the close button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ChampionshipsModal team={champion} onClose={onClose} />);

    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
