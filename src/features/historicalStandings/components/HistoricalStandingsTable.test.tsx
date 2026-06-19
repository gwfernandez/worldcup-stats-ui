import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { HISTORICAL_STANDINGS_FIXTURE } from '@/test/fixtures/historicalStandings.fixture';
import { useUIStore } from '@/store/ui.store';
import i18n from '@/i18n/config';
import { HistoricalStandingsTable } from './HistoricalStandingsTable';

describe('HistoricalStandingsTable', () => {
  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('renders unified ranking values without pagination controls', () => {
    render(<HistoricalStandingsTable standings={HISTORICAL_STANDINGS_FIXTURE} />);

    const brazilRow = screen.getByText('Brasil').closest('tr');

    expect(brazilRow).not.toBeNull();
    expect(brazilRow?.children[0]).toHaveTextContent('1');
    expect(brazilRow?.children[2]).toHaveTextContent('237');
    expect(brazilRow).not.toHaveTextContent('193');
    expect(screen.queryByLabelText('Página siguiente')).not.toBeInTheDocument();
  });

  it('renders the full localized performance heading', async () => {
    const { rerender } = render(
      <HistoricalStandingsTable standings={HISTORICAL_STANDINGS_FIXTURE} />,
    );

    expect(
      screen.getByRole('row', {
        name: /PTS Puntos PJ Partidos jugados PG Partidos ganados PE Partidos empatados PP Partidos perdidos GF Goles a favor GC Goles en contra DIF Diferencia de goles/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Rendimiento/ })).toHaveClass('text-center');
    expect(screen.getByRole('columnheader', { name: 'Confederación' })).toHaveClass('text-center');

    await act(async () => {
      await i18n.changeLanguage('en');
    });
    rerender(<HistoricalStandingsTable standings={HISTORICAL_STANDINGS_FIXTURE} />);

    expect(
      screen.getByRole('row', {
        name: /PTS Points MP Matches played W Matches won D Matches drawn L Matches lost GF Goals for GA Goals against GD Goal difference/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Performance/ })).toHaveClass('text-center');
    expect(screen.getByRole('columnheader', { name: 'Confederation' })).toHaveClass('text-center');
  });

  it('centers performance values and uses the same yellow bar for every confederation', () => {
    render(<HistoricalStandingsTable standings={HISTORICAL_STANDINGS_FIXTURE} />);

    const performanceBars = screen.getAllByTestId('performance-bar');

    expect(performanceBars).toHaveLength(2);
    performanceBars.forEach((bar) => {
      expect(bar).toHaveClass('bg-wc-accent-gold');
      expect(bar.parentElement?.parentElement).toHaveClass('justify-center');
    });
  });

  it('keeps all confederations available and stores selected filters', async () => {
    const user = userEvent.setup();
    render(<HistoricalStandingsTable standings={HISTORICAL_STANDINGS_FIXTURE} />);

    const searchInput = screen.getByPlaceholderText('Buscar selección...');
    const confederationSelect = screen.getByRole('combobox');

    expect(screen.getByRole('option', { name: 'AFC' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'OFC' })).toBeInTheDocument();

    await user.type(searchInput, 'argen');
    await user.selectOptions(confederationSelect, 'CONMEBOL');

    expect(useUIStore.getState().filters.historicalStandings).toEqual({
      name: 'argen',
      confederation: 'CONMEBOL',
    });
  });

  it('renders the empty state returned by the backend', () => {
    render(<HistoricalStandingsTable standings={[]} />);

    expect(screen.getByText('No se encontraron selecciones con esos filtros')).toBeInTheDocument();
  });
});
