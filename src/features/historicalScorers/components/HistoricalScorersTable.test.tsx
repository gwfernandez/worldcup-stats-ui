import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HistoricalScorersTable } from './HistoricalScorersTable';
import { HISTORICAL_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/historicalScorers.fixture';
import { TEAMS_RESPONSE_FIXTURE } from '@/test/fixtures/teams.fixture';

describe('HistoricalScorersTable', () => {
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

  it('opens the fixed Messi modal from any scorer row', async () => {
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

    expect(screen.getByRole('dialog', { name: /Lionel Messi/i })).toBeInTheDocument();
    expect(screen.getByText(/Lionel Messi — Argentina/)).toBeInTheDocument();
  });
});
