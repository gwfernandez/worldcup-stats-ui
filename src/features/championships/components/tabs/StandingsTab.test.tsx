import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CHAMPIONSHIP_STANDINGS_FIXTURE } from '@/test/fixtures/championshipStandings.fixture';
import type { StandingList } from '@/types/standing.types';
import { useChampionshipStandings } from '../../hooks/useChampionshipStandings';
import { calcPerformance } from './standingsTab.utils';
import { StandingsTab } from './StandingsTab';

vi.mock('../../hooks/useChampionshipStandings', () => ({
  useChampionshipStandings: vi.fn(),
}));

const mockStandings = (standings: StandingList = CHAMPIONSHIP_STANDINGS_FIXTURE) => {
  vi.mocked(useChampionshipStandings).mockReturnValue({
    standings,
    isLoading: false,
    isError: false,
    error: null,
  });
};

describe('StandingsTab', () => {
  it('carga standings usando el año recibido y muestra todas las selecciones', () => {
    mockStandings([...CHAMPIONSHIP_STANDINGS_FIXTURE].reverse());

    render(<StandingsTab year={1950} hostCodes={['URY']} />);

    expect(useChampionshipStandings).toHaveBeenCalledWith(1950);
    const standingsRows = within(screen.getAllByRole('table')[0]).getAllByRole('row');
    expect(standingsRows).toHaveLength(CHAMPIONSHIP_STANDINGS_FIXTURE.length + 1);
    expect(standingsRows[1]).toHaveTextContent('Uruguay');
    expect(screen.getByText('+10')).toBeInTheDocument();
    expect(screen.getByText('-4')).toBeInTheDocument();
  });

  it('ordena selecciones por posición y muestra métricas principales', () => {
    mockStandings([...CHAMPIONSHIP_STANDINGS_FIXTURE].reverse());

    render(<StandingsTab year={1950} hostCodes={['URY']} />);

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Uruguay');
    expect(rows[1]).toHaveTextContent('7');
    expect(rows[1]).toHaveTextContent('88%');
  });

  it('muestra desempeño y anfitrión sin columna de forma ni grupo', () => {
    mockStandings(CHAMPIONSHIP_STANDINGS_FIXTURE);

    render(<StandingsTab year={1950} hostCodes={['URY']} />);

    expect(screen.getByText('🏆 Campeón')).toBeInTheDocument();
    expect(screen.getByText('🏠 Anfitrión')).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Forma' })).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Grupo' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Victoria')).not.toBeInTheDocument();
  });

  it('calcula el porcentaje con dos puntos por victoria antes de 1994 y tres desde 1994', () => {
    expect(calcPerformance(7, 4, 1950)).toBe(88);
    expect(calcPerformance(7, 4, 1994)).toBe(58);
  });

  it('muestra estado de error del endpoint', () => {
    vi.mocked(useChampionshipStandings).mockReturnValue({
      standings: [],
      isLoading: false,
      isError: true,
      error: new Error('API error'),
    });

    render(<StandingsTab year={1950} hostCodes={[]} />);

    expect(screen.getByText('No se pudieron cargar las posiciones.')).toBeInTheDocument();
  });

  it('usa encabezados traducidos y muestra la leyenda del sistema aplicable', () => {
    mockStandings(CHAMPIONSHIP_STANDINGS_FIXTURE);

    render(<StandingsTab year={1950} hostCodes={['URY']} />);

    expect(screen.getByRole('columnheader', { name: 'PTS Puntos' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'PJ Partidos jugados' })).toBeInTheDocument();
    expect(screen.getByText('Leyenda')).toBeInTheDocument();
    expect(screen.queryByText('▼ Hasta EE.UU. 1994')).not.toBeInTheDocument();
    expect(screen.queryByText('▲ Desde EE.UU. 1994')).not.toBeInTheDocument();
  });

  it('muestra solo el sistema de tres puntos para mundiales desde 1994', () => {
    mockStandings(CHAMPIONSHIP_STANDINGS_FIXTURE);

    render(<StandingsTab year={1994} hostCodes={['URY']} />);

    expect(screen.queryByText('▲ Desde EE.UU. 1994')).not.toBeInTheDocument();
    expect(screen.queryByText('▼ Hasta EE.UU. 1994')).not.toBeInTheDocument();
  });
});
