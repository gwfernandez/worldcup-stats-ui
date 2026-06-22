import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HISTORICAL_SCORER_DETAIL_FIXTURE } from '@/test/fixtures/historicalScorerDetail.fixture';
import { HISTORICAL_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/historicalScorers.fixture';
import { useHistoricalScorerDetail } from '../hooks/useHistoricalScorerDetail';
import { HistoricalScorerModal } from './HistoricalScorerModal';

vi.mock('../hooks/useHistoricalScorerDetail', () => ({
  useHistoricalScorerDetail: vi.fn(),
}));

const selectedScorer = HISTORICAL_SCORERS_RESPONSE_FIXTURE.data[1];
const defaultResult = {
  scorer: HISTORICAL_SCORER_DETAIL_FIXTURE,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
};

interface MatchMediaController {
  setMatches: (matches: boolean) => void;
}

const mockMatchMedia = (initialMatches: boolean): MatchMediaController => {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mediaQuery = {
    get matches() {
      return matches;
    },
    media: '(max-width: 639px)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((event: string, listener: (event: MediaQueryListEvent) => void) => {
      if (event === 'change') listeners.add(listener);
    }),
    removeEventListener: vi.fn((event: string, listener: (event: MediaQueryListEvent) => void) => {
      if (event === 'change') listeners.delete(listener);
    }),
    dispatchEvent: vi.fn(() => true),
  } as unknown as MediaQueryList;

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mediaQuery),
  );

  return {
    setMatches(nextMatches: boolean) {
      matches = nextMatches;
      const event = { matches, media: mediaQuery.media } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
};

describe('HistoricalScorerModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
    vi.mocked(useHistoricalScorerDetail).mockReturnValue(defaultResult);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('requests the selected player and renders the title, team flags and statistics', () => {
    render(<HistoricalScorerModal selectedScorer={selectedScorer} onClose={vi.fn()} />);

    expect(useHistoricalScorerDetail).toHaveBeenCalledWith(1524);
    const dialog = screen.getByRole('dialog', { name: 'Detalle histórico de Lionel Messi' });
    const header = within(dialog).getByRole('button', { name: 'Cerrar' }).parentElement;

    expect(dialog.firstElementChild).toHaveClass(
      'w-[min(360px,calc(100vw-16px))]',
      'sm:w-full',
      'sm:max-w-[490px]',
    );
    expect(dialog.firstElementChild).toHaveClass('max-h-[calc(100dvh-1rem)]', 'sm:max-h-[85vh]');
    expect(header).toHaveTextContent('Lionel Messi');
    expect(
      within(header as HTMLElement).getByRole('img', { name: 'Argentina' }),
    ).toBeInTheDocument();
    expect(within(header as HTMLElement).getByRole('img', { name: 'España' })).toBeInTheDocument();
    expect(dialog).toHaveTextContent('Goles totales');
    expect(dialog).toHaveTextContent('Mundiales');
    expect(dialog).toHaveTextContent('Posición');
    expect(dialog).toHaveTextContent('FW');
    expect(dialog).not.toHaveTextContent('Promedio');
    expect(dialog).not.toHaveTextContent('Títulos');
  });

  it('renders the requested goal columns and values', () => {
    render(<HistoricalScorerModal selectedScorer={selectedScorer} onClose={vi.fn()} />);

    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Mundial',
      'Fecha',
      'Rival',
      'Min.',
      'Fase',
    ]);
    const [worldCupHeader, dateHeader, opponentHeader, minuteHeader] =
      screen.getAllByRole('columnheader');
    expect(worldCupHeader).toHaveClass('w-[84px]', 'pr-1', 'pl-1', 'text-center');
    expect(dateHeader).toHaveClass('w-[52px]', 'pr-1', 'pl-0', 'text-center');
    expect(opponentHeader).toHaveClass('w-[88px]', 'pr-1', 'pl-1', 'text-center');
    expect(minuteHeader).toHaveClass('w-[58px]', 'pr-1', 'pl-0', 'text-center');
    expect(screen.getByRole('table')).toHaveClass('min-w-[440px]', 'table-fixed');

    const goalRow = screen.getByText('2022').closest('tr');
    const [worldCupCell, dateCell, opponentCell, minuteCell] = within(
      goalRow as HTMLElement,
    ).getAllByRole('cell');
    expect(worldCupCell.firstElementChild).toHaveClass('justify-center');
    expect(dateCell).toHaveClass('text-center');
    expect(opponentCell.firstElementChild).toHaveClass('justify-center');
    expect(minuteCell).toHaveClass('text-center');
    expect(goalRow).toHaveTextContent('12-18');
    expect(goalRow).toHaveTextContent('FRA');
    expect(goalRow).toHaveTextContent('23 (P)');
    expect(goalRow).toHaveTextContent('final');
    expect(
      within(goalRow as HTMLElement).getByRole('img', { name: 'Francia' }),
    ).toBeInTheDocument();
  });

  it('renders goal cards on mobile and switches back to the table when the viewport changes', () => {
    const media = mockMatchMedia(true);
    render(<HistoricalScorerModal selectedScorer={selectedScorer} onClose={vi.fn()} />);

    expect(screen.getByTestId('scorer-goal-cards')).toBeInTheDocument();
    expect(screen.getAllByTestId('scorer-goal-card')).toHaveLength(2);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    const firstCard = screen.getAllByTestId('scorer-goal-card')[0];
    const cardDetails = within(firstCard).getByTestId('scorer-goal-card-details');
    expect(cardDetails).toHaveClass('grid-cols-3');
    expect(cardDetails).not.toHaveClass('grid-cols-[max-content_max-content_max-content]');
    expect(firstCard).toHaveTextContent('2022');
    expect(firstCard).toHaveTextContent('final');
    expect(firstCard).toHaveTextContent('12-18');
    expect(firstCard).toHaveTextContent('FRA');
    expect(firstCard).toHaveTextContent('23 (P)');

    act(() => {
      media.setMatches(false);
    });

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByTestId('scorer-goal-cards')).not.toBeInTheDocument();
  });

  it('rotates multiple host flags in mobile cards and cleans the timer on unmount', () => {
    vi.useFakeTimers();
    mockMatchMedia(true);
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    const { unmount } = render(
      <HistoricalScorerModal selectedScorer={selectedScorer} onClose={vi.fn()} />,
    );

    const goalCard = screen.getAllByTestId('scorer-goal-card')[0];
    expect(within(goalCard).getByRole('img', { name: 'Catar' })).toHaveClass('opacity-100');

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(within(goalCard).getByRole('img', { name: 'Catar' })).toHaveClass('opacity-0');

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(within(goalCard).getByRole('img', { name: 'Emiratos Árabes Unidos' })).toHaveClass(
      'opacity-100',
    );

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalledOnce();
  });

  it('shows nullable fields and empty hosts without inventing data', () => {
    mockMatchMedia(true);
    vi.mocked(useHistoricalScorerDetail).mockReturnValue({
      ...defaultResult,
      scorer: {
        ...HISTORICAL_SCORER_DETAIL_FIXTURE,
        position: null,
        goals: [HISTORICAL_SCORER_DETAIL_FIXTURE.goals[1]],
      },
    });

    render(<HistoricalScorerModal selectedScorer={selectedScorer} onClose={vi.fn()} />);

    const goalCard = screen.getByTestId('scorer-goal-card');
    expect(goalCard).toHaveTextContent('—');
    expect(goalCard).toHaveTextContent('88');
    expect(goalCard).not.toHaveTextContent('(P)');
    expect(screen.getAllByText('—')).toHaveLength(4);
  });

  it('shows loading, error with retry, and a player without goals', async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    vi.mocked(useHistoricalScorerDetail).mockReturnValue({
      ...defaultResult,
      scorer: null,
      isLoading: true,
    });

    const { rerender } = render(
      <HistoricalScorerModal selectedScorer={selectedScorer} onClose={vi.fn()} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Cargando detalle del goleador...');

    vi.mocked(useHistoricalScorerDetail).mockReturnValue({
      ...defaultResult,
      scorer: null,
      isError: true,
      error: new Error('API Error'),
      refetch,
    });
    rerender(<HistoricalScorerModal selectedScorer={selectedScorer} onClose={vi.fn()} />);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se pudo cargar el detalle del goleador.',
    );
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(refetch).toHaveBeenCalledOnce();

    vi.mocked(useHistoricalScorerDetail).mockReturnValue({
      ...defaultResult,
      scorer: { ...HISTORICAL_SCORER_DETAIL_FIXTURE, goals: [] },
    });
    rerender(<HistoricalScorerModal selectedScorer={selectedScorer} onClose={vi.fn()} />);
    expect(
      screen.getByText('Este jugador no tiene goles válidos registrados.'),
    ).toBeInTheDocument();
  });

  it('closes with Escape, the close button and the backdrop', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<HistoricalScorerModal selectedScorer={selectedScorer} onClose={onClose} />);

    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    fireEvent.click(screen.getByRole('dialog'));

    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
