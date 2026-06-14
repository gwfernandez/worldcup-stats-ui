import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
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
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renderiza una bandera estatica para un mundial con sede unica', () => {
    renderCard(2);

    expect(screen.getByText('1938')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Francia' })).toHaveClass('fi-fr');
    expect(screen.getByLabelText('Sede')).toHaveTextContent('Francia');
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.queryByText('Italia')).not.toBeInTheDocument();
  });

  it('inicia el carrusel multi-sede con el primer anfitrion y avanza tras 1.5s', () => {
    vi.useFakeTimers();

    renderCard(22);

    expect(screen.getByRole('img', { name: 'Estados Unidos' })).toHaveClass('fi-us');
    expect(screen.getByLabelText('Sede activa')).toHaveTextContent('Estados Unidos');

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByRole('img', { name: 'Estados Unidos' })).toHaveClass('opacity-0');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByRole('img', { name: 'Mexico' })).toHaveClass('fi-mx');
    expect(screen.getByLabelText('Sede activa')).toHaveTextContent('Mexico');
  });

  it('limpia el intervalo del carrusel al desmontar', () => {
    vi.useFakeTimers();
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    const { unmount } = renderCard(22);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
  });
});
