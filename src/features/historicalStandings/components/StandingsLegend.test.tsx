import { act, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n/config';
import { StandingsLegend as SharedStandingsLegend } from '@/components/shared';
import { StandingsLegend } from './StandingsLegend';

const SPANISH_ABBREVIATIONS = ['PTS', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DIF'];
const ENGLISH_ABBREVIATIONS = ['PTS', 'MP', 'W', 'D', 'L', 'GF', 'GA', 'GD'];

const getAbbreviationCells = (): string[] => {
  const table = screen.getByRole('table');

  return within(table)
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent ?? '');
};

describe('StandingsLegend', () => {
  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('uses Spanish standing abbreviations by default', () => {
    render(<StandingsLegend />);

    expect(getAbbreviationCells()).toEqual(SPANISH_ABBREVIATIONS);
  });

  it('uses English standing abbreviations after changing language', async () => {
    render(<StandingsLegend />);

    await act(async () => {
      await i18n.changeLanguage('en');
    });

    expect(getAbbreviationCells()).toEqual(ENGLISH_ABBREVIATIONS);
  });

  it('shows both historical win systems by default', () => {
    render(<StandingsLegend />);

    expect(screen.getByText('▲ Desde EE.UU. 1994')).toBeInTheDocument();
    expect(screen.getByText('▼ Hasta Italia 1990')).toBeInTheDocument();
  });

  it('shows only the two-point win system before 1994', () => {
    render(<SharedStandingsLegend mode="year" year={1950} />);

    expect(screen.queryByText('▼ Hasta Italia 1990')).not.toBeInTheDocument();
    expect(screen.queryByText('▲ Desde EE.UU. 1994')).not.toBeInTheDocument();
    expect(screen.queryByText('Siempre')).not.toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });

  it('shows only the three-point win system since 1994', () => {
    render(<SharedStandingsLegend mode="year" year={1994} />);

    expect(screen.queryByText('▲ Desde EE.UU. 1994')).not.toBeInTheDocument();
    expect(screen.queryByText('▼ Hasta Italia 1990')).not.toBeInTheDocument();
    expect(screen.queryByText('Siempre')).not.toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });
});
