import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('does not render or request data without a selected team', () => {
    const { container } = render(<ChampionshipsModal team={null} onClose={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
    expect(useChampionFinals).toHaveBeenCalledWith(null);
  });

  it('shows only the champion name in the visible header', () => {
    render(<ChampionshipsModal team={champion} onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog', { name: 'Títulos de Argentina' });
    const header = within(dialog).getByRole('button', { name: 'Cerrar' }).parentElement;

    expect(header).toHaveTextContent('Argentina');
    expect(header).not.toHaveTextContent('Títulos');
    expect(
      within(header as HTMLElement).getByRole('img', { name: 'Argentina' }),
    ).toBeInTheDocument();
  });

  it('renders the final columns in the requested order', () => {
    render(<ChampionshipsModal team={champion} onClose={vi.fn()} />);

    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Year',
      'Date',
      'Matches',
    ]);
    expect(screen.getByTestId('champion-finals-scroll')).toHaveClass('overflow-x-auto');
    expect(screen.getByRole('table')).toHaveClass('min-w-[460px]');

    const [yearHeader, dateHeader, matchesHeader] = screen.getAllByRole('columnheader');
    expect(yearHeader).toHaveClass('w-16', 'px-1', 'pb-1', 'text-center');
    expect(dateHeader).toHaveClass('w-12', 'px-1', 'pb-1', 'text-center');
    expect(matchesHeader).toHaveClass(
      'whitespace-nowrap',
      'px-1',
      'pb-1',
      'text-center',
      'text-[10px]',
    );
  });

  it('renders month and day, teams, flags and separated scores', () => {
    render(<ChampionshipsModal team={champion} onClose={vi.fn()} />);

    const finalRow = within(screen.getByRole('table')).getByText('2022').closest('tr');
    expect(finalRow).toHaveTextContent('12-18');
    expect(finalRow).not.toHaveTextContent('2022-12-18');
    expect(finalRow).toHaveTextContent('Francia');
    expect(finalRow).toHaveTextContent('3 (2)');
    expect(finalRow).toHaveTextContent('vs');
    expect(finalRow).toHaveTextContent('3 (4)');
    expect(finalRow).toHaveTextContent('Argentina');
    expect(
      within(finalRow as HTMLElement).getByRole('img', { name: 'Francia' }),
    ).toBeInTheDocument();
    expect(
      within(finalRow as HTMLElement).getByRole('img', { name: 'Argentina' }),
    ).toBeInTheDocument();

    const homeTeamFlag = within(finalRow as HTMLElement).getByRole('img', { name: 'Francia' });
    const homeTeamCell = homeTeamFlag.parentElement;
    expect(homeTeamCell).toHaveClass('justify-end', 'text-right');
    expect(homeTeamCell?.firstElementChild).toHaveTextContent('Francia');
    expect(homeTeamCell?.lastElementChild).toBe(homeTeamFlag);

    const matchLayout = within(finalRow as HTMLElement).getByTestId('match-layout');
    const homeTeam = within(matchLayout).getByTestId('home-team');
    const score = within(matchLayout).getByTestId('match-score');
    const awayTeam = within(matchLayout).getByTestId('away-team');
    expect(matchLayout.children).toHaveLength(3);
    expect(matchLayout.children[0]).toBe(homeTeam);
    expect(matchLayout.children[1]).toBe(score);
    expect(matchLayout.children[2]).toBe(awayTeam);
    expect(homeTeam).toHaveClass('justify-end', 'text-right');
    expect(awayTeam).toHaveClass('justify-start', 'text-left');
    expect(matchLayout).toHaveClass(
      'w-max',
      'grid-cols-[120px_96px_120px]',
      'justify-start',
      'gap-2',
    );
    expect(score).toHaveClass('w-24', 'grid-cols-[1fr_auto_1fr]', 'gap-1', 'tabular-nums');
    expect(score.children[0]).toHaveTextContent('3 (2)');
    expect(score.children[1]).toHaveTextContent('vs');
    expect(score.children[2]).toHaveTextContent('3 (4)');
  });

  it('rotates multiple host flags with the world cup carousel timing', () => {
    vi.useFakeTimers();
    render(<ChampionshipsModal team={champion} onClose={vi.fn()} />);

    const finalRow = within(screen.getByRole('table')).getByText('2022').closest('tr');
    expect(within(finalRow as HTMLElement).getByRole('img', { name: 'Qatar' })).toHaveClass(
      'opacity-100',
    );

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(within(finalRow as HTMLElement).getByRole('img', { name: 'Qatar' })).toHaveClass(
      'opacity-0',
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(
      within(finalRow as HTMLElement).getByRole('img', { name: 'Emiratos Árabes Unidos' }),
    ).toHaveClass('opacity-100');
  });

  it('keeps a single host static and does not start a carousel', () => {
    vi.useFakeTimers();
    const setIntervalSpy = vi.spyOn(window, 'setInterval');
    vi.mocked(useChampionFinals).mockReturnValue({
      ...defaultResult,
      finals: [CHAMPION_FINALS_RESPONSE_FIXTURE.data[0]],
    });

    render(<ChampionshipsModal team={champion} onClose={vi.fn()} />);

    const finalRow = within(screen.getByRole('table')).getByText('1978').closest('tr');
    expect(
      within(finalRow as HTMLElement).getAllByRole('img', { name: 'Argentina' })[0],
    ).toHaveClass('opacity-100');
    expect(setIntervalSpy).not.toHaveBeenCalled();
  });

  it('cleans the host carousel timers when the modal unmounts', () => {
    vi.useFakeTimers();
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    const { unmount } = render(<ChampionshipsModal team={champion} onClose={vi.fn()} />);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
  });

  it('shows missing date, host and scores without inventing data', () => {
    vi.mocked(useChampionFinals).mockReturnValue({
      ...defaultResult,
      finals: [
        {
          ...CHAMPION_FINALS_RESPONSE_FIXTURE.data[0],
          hostCodes: [],
          matchDate: null,
          homeTeamScore: null,
          awayTeamScore: null,
        },
      ],
    });

    render(<ChampionshipsModal team={champion} onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog', { name: 'Títulos de Argentina' });
    expect(within(dialog).getAllByText('—')).toHaveLength(4);
    const finalRow = within(screen.getByRole('table')).getByText('1978').closest('tr');
    expect(finalRow).toHaveTextContent('Argentina');
    expect(finalRow).toHaveTextContent('Países Bajos');
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
