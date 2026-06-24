import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipScorers.fixture';
import { PLAYER_GOALS_RESPONSE_FIXTURE } from '@/test/fixtures/playerGoals.fixture';
import { usePlayerGoals } from '../../hooks/usePlayerGoals';
import { ScorerGoalsModal } from './ScorerGoalsModal';

vi.mock('../../hooks/usePlayerGoals', () => ({
  usePlayerGoals: vi.fn(),
}));

const selectedScorer = CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE.data[0];
const defaultResult = {
  goals: PLAYER_GOALS_RESPONSE_FIXTURE.data,
  pagination: PLAYER_GOALS_RESPONSE_FIXTURE.pagination,
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

describe('ScorerGoalsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
    vi.mocked(usePlayerGoals).mockReturnValue(defaultResult);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('requests the selected player and renders title, summary team flag and goal table', () => {
    render(<ScorerGoalsModal selectedScorer={selectedScorer} year={1950} onClose={vi.fn()} />);

    expect(usePlayerGoals).toHaveBeenCalledWith(101, 1950);
    const dialog = screen.getByRole('dialog', { name: 'Detalle de goles de Ademir' });
    expect(dialog.firstElementChild).toHaveClass(
      'max-h-[calc(100dvh-1rem)]',
      'overflow-y-auto',
      'sm:max-h-[85vh]',
    );
    expect(dialog).toHaveTextContent('Ademir');
    const header = within(dialog).getByRole('button', { name: 'Cerrar' }).parentElement;
    expect(within(header as HTMLElement).queryByRole('img', { name: 'Brasil' })).not.toBeInTheDocument();
    const teamSummary = screen.getByTestId('scorer-goals-team-summary');
    expect(within(teamSummary).getByRole('img', { name: 'Brasil' })).toBeInTheDocument();
    expect(within(teamSummary).queryByText('BRA')).not.toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Fecha',
      'Rival',
      'Min.',
      'Fase',
    ]);
    expect(screen.getByText('06-24')).toBeInTheDocument();
    expect(screen.getByText('MEX')).toBeInTheDocument();
    const firstGoalRow = screen.getByText('06-24').closest('tr');
    expect(firstGoalRow).not.toBeNull();
    expect(within(firstGoalRow as HTMLElement).queryByRole('img', { name: 'Brasil' })).not.toBeInTheDocument();
    expect(within(firstGoalRow as HTMLElement).getByRole('img', { name: 'México' })).toBeInTheDocument();
    expect(screen.getByText('80 (P)')).toBeInTheDocument();
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('renders goal cards on mobile and switches back to the table when viewport changes', () => {
    const media = mockMatchMedia(true);
    render(<ScorerGoalsModal selectedScorer={selectedScorer} year={1950} onClose={vi.fn()} />);

    expect(screen.getByTestId('player-goal-cards')).toBeInTheDocument();
    expect(screen.getAllByTestId('player-goal-card')).toHaveLength(3);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    const firstCard = screen.getAllByTestId('player-goal-card')[0];
    expect(within(firstCard).queryByText('1950')).not.toBeInTheDocument();
    expect(within(firstCard).queryByRole('img', { name: 'Brasil' })).not.toBeInTheDocument();
    expect(firstCard).toHaveTextContent('group_stage');
    expect(firstCard).toHaveTextContent('06-24');
    expect(firstCard).toHaveTextContent('MEX');
    expect(within(firstCard).getByRole('img', { name: 'México' })).toBeInTheDocument();
    expect(within(firstCard).getByTestId('player-goal-card-details')).toHaveClass('grid-cols-3');

    act(() => {
      media.setMatches(false);
    });

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByTestId('player-goal-cards')).not.toBeInTheDocument();
  });

  it('shows loading, error with retry, and empty states', async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    vi.mocked(usePlayerGoals).mockReturnValue({
      ...defaultResult,
      goals: [],
      isLoading: true,
    });

    const { rerender } = render(
      <ScorerGoalsModal selectedScorer={selectedScorer} year={1950} onClose={vi.fn()} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Cargando detalle del goleador...');

    vi.mocked(usePlayerGoals).mockReturnValue({
      ...defaultResult,
      goals: [],
      isLoading: false,
      isError: true,
      refetch,
    });
    rerender(<ScorerGoalsModal selectedScorer={selectedScorer} year={1950} onClose={vi.fn()} />);

    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo cargar el detalle del goleador.');
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(refetch).toHaveBeenCalledOnce();

    vi.mocked(usePlayerGoals).mockReturnValue({
      ...defaultResult,
      goals: [],
    });
    rerender(<ScorerGoalsModal selectedScorer={selectedScorer} year={1950} onClose={vi.fn()} />);

    expect(screen.getByText('Este jugador no tiene goles válidos registrados.')).toBeInTheDocument();
  });

  it('closes on overlay, close button and Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(
      <ScorerGoalsModal selectedScorer={selectedScorer} year={1950} onClose={onClose} />,
    );

    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(<ScorerGoalsModal selectedScorer={selectedScorer} year={1950} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);

    await user.click(screen.getByRole('dialog', { name: 'Detalle de goles de Ademir' }));
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('does not render when no scorer is selected', () => {
    render(<ScorerGoalsModal selectedScorer={null} year={1950} onClose={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(usePlayerGoals).toHaveBeenCalledWith(null, 1950);
  });
});
