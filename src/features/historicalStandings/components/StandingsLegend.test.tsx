import { act, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n/config';
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
});
