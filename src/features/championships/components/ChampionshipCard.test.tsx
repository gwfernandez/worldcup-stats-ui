import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { MOCK_CHAMPIONSHIPS } from '../mocks/championship.mock';
import { ChampionshipCard } from './ChampionshipCard';

function renderCard(index = 0) {
  return render(
    <MemoryRouter>
      <ChampionshipCard championship={MOCK_CHAMPIONSHIPS[index]} />
    </MemoryRouter>,
  );
}

describe('ChampionshipCard', () => {
  it('muestra todas las sedes del mundial', () => {
    renderCard(22);

    expect(screen.getAllByText('2026').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Estados Unidos').length).toBeGreaterThan(0);
    expect(screen.getByText('Mexico')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  it('muestra el placeholder del anio si el logo no carga', () => {
    renderCard();

    const logo = screen.getByRole('img', { name: 'Logo del Mundial 1930' });

    fireEvent.error(logo);

    expect(logo).not.toBeVisible();
    expect(screen.getAllByText('1930')[0]).toBeVisible();
  });
});
