import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HistoricalScorersTable } from './HistoricalScorersTable';
import { HISTORICAL_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/historicalScorers.fixture';
import { HISTORICAL_SCORER_DETAIL_FIXTURE } from '@/test/fixtures/historicalScorerDetail.fixture';
import { TEAMS_RESPONSE_FIXTURE } from '@/test/fixtures/teams.fixture';
import { useHistoricalScorerDetail } from '../hooks/useHistoricalScorerDetail';

vi.mock('../hooks/useHistoricalScorerDetail', () => ({
  useHistoricalScorerDetail: vi.fn(),
}));

describe('HistoricalScorersTable', () => {
  beforeEach(() => {
    vi.mocked(useHistoricalScorerDetail).mockReturnValue({
      scorer: {
        ...HISTORICAL_SCORER_DETAIL_FIXTURE,
        id: 1,
        firstName: 'Miroslav',
        lastName: 'Klose',
        teams: [{ code: 'GER', name: 'Alemania' }],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('renders server data without the average column and includes dissolved teams', () => {
    render(
      <HistoricalScorersTable
        scorers={HISTORICAL_SCORERS_RESPONSE_FIXTURE.data}
        pagination={HISTORICAL_SCORERS_RESPONSE_FIXTURE.pagination}
        teams={TEAMS_RESPONSE_FIXTURE.data}
        currentPage={1}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Miroslav Klose')).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Promedio' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Unión Soviética' })).toBeInTheDocument();
  });

  it('uses a compact responsive layout without introducing a table scroll container', () => {
    render(
      <HistoricalScorersTable
        scorers={HISTORICAL_SCORERS_RESPONSE_FIXTURE.data}
        pagination={HISTORICAL_SCORERS_RESPONSE_FIXTURE.pagination}
        teams={TEAMS_RESPONSE_FIXTURE.data}
        currentPage={1}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('historical-scorers-filters')).toHaveClass(
      'grid',
      'grid-cols-1',
      'min-[320px]:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)]',
      'min-w-0',
    );
    expect(screen.getByRole('table')).toHaveClass('w-full', 'table-fixed');
    expect(screen.getByText('Miroslav Klose')).toHaveClass('truncate');
    expect(screen.getByText('Alemania')).toHaveClass('truncate');
  });

  it('resets pagination when a filter changes', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <HistoricalScorersTable
        scorers={HISTORICAL_SCORERS_RESPONSE_FIXTURE.data}
        pagination={HISTORICAL_SCORERS_RESPONSE_FIXTURE.pagination}
        teams={TEAMS_RESPONSE_FIXTURE.data}
        currentPage={2}
        onPageChange={onPageChange}
      />,
    );

    await user.selectOptions(screen.getAllByRole('combobox')[0], 'ARG');

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('opens the selected scorer modal using the row player ID', async () => {
    const user = userEvent.setup();
    render(
      <HistoricalScorersTable
        scorers={HISTORICAL_SCORERS_RESPONSE_FIXTURE.data}
        pagination={HISTORICAL_SCORERS_RESPONSE_FIXTURE.pagination}
        teams={TEAMS_RESPONSE_FIXTURE.data}
        currentPage={1}
        onPageChange={vi.fn()}
      />,
    );

    await user.click(screen.getByText('Miroslav Klose'));

    expect(useHistoricalScorerDetail).toHaveBeenCalledWith(1);
    const dialog = screen.getByRole('dialog', { name: /Miroslav Klose/i });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('Miroslav Klose')).toBeInTheDocument();
  });
});
