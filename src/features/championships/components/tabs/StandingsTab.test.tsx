import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StandingsTab } from './StandingsTab';
import { MOCK_STANDINGS } from '@/features/championships/mocks/standings.mock';

describe('StandingsTab', () => {
  it('ordena selecciones por posición y muestra métricas principales', () => {
    render(<StandingsTab standings={[...MOCK_STANDINGS].reverse()} />);

    const rows = screen.getAllByRole('row');

    expect(rows[1]).toHaveTextContent('Brasil');
    expect(screen.getByText('+12')).toBeInTheDocument();
    expect(screen.getAllByText('0')[0]).toBeInTheDocument();
    expect(screen.getAllByText('-1')).toHaveLength(2);
  });

  it('muestra desempeño, anfitrión y forma reciente', () => {
    render(<StandingsTab standings={MOCK_STANDINGS} />);

    expect(screen.getByText('🏆 Campeón')).toBeInTheDocument();
    expect(screen.getByText('🏠 Anfitrión')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Victoria').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('Empate').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('Derrota').length).toBeGreaterThan(0);
  });
});
