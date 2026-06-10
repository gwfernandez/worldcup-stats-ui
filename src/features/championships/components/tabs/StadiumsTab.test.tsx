import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { StadiumsTab } from './StadiumsTab';
import { MOCK_STADIUMS } from '../../mocks/stadiums.mock';
import type { Stadium } from '@/types/stadium.types';

describe('StadiumsTab', () => {
  it('renderiza estadios y filtra por nombre', async () => {
    const user = userEvent.setup();

    render(<StadiumsTab stadiums={MOCK_STADIUMS} />);

    expect(screen.getByText('Estadio Azteca')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Buscar estadio...'), 'Jalisco');

    expect(screen.getByText('Estadio Jalisco')).toBeInTheDocument();
    expect(screen.queryByText('Estadio Azteca')).not.toBeInTheDocument();
  });

  it('muestra estado vacío cuando el filtro no coincide', async () => {
    const user = userEvent.setup();

    render(<StadiumsTab stadiums={MOCK_STADIUMS} />);

    await user.type(screen.getByPlaceholderText('Buscar estadio...'), 'Sin coincidencias');

    expect(screen.getByText('No se encontraron estadios')).toBeInTheDocument();
  });

  it('renderiza guion y evita navegar cuando un estadio no tiene capacidad ni mapa', async () => {
    const user = userEvent.setup();
    const stadiumWithoutMap: Stadium = {
      id: 99,
      name: 'Estadio sin datos',
      city: 'Ciudad prueba',
      capacity: null,
      mapsUrl: null,
      matches: [],
    };

    render(<StadiumsTab stadiums={[stadiumWithoutMap]} />);

    expect(screen.getByText('—')).toBeInTheDocument();

    const mapLink = screen.getByRole('link', { name: 'Ver Estadio sin datos en el mapa' });
    expect(mapLink).toHaveAttribute('href', '#');

    await user.click(mapLink);
  });

  it('abre partidos de un estadio y luego el detalle de partido', async () => {
    const user = userEvent.setup();

    render(<StadiumsTab stadiums={MOCK_STADIUMS} />);

    await user.click(screen.getByRole('button', { name: 'Ver partidos en Estadio Azteca' }));

    const stadiumDialog = screen.getByRole('dialog', { name: 'Partidos en Estadio Azteca' });
    expect(stadiumDialog).toBeInTheDocument();
    expect(within(stadiumDialog).getByText(/Ciudad de México/)).toBeInTheDocument();

    await user.click(within(stadiumDialog).getByRole('button', { name: /Brasil.*Italia/i }));

    const matchDialog = screen.getByRole('dialog', {
      name: 'Detalle del partido Brasil vs Italia',
    });
    expect(matchDialog).toBeInTheDocument();
    expect(within(matchDialog).getByText('Pelé')).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Partidos en Estadio Azteca' })).not.toBeInTheDocument();
  });
});
