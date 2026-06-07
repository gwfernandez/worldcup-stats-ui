import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { QueryStatus } from './QueryStatus';

describe('QueryStatus', () => {
  it('muestra el estado de carga', () => {
    render(
      <QueryStatus isLoading isError={false}>
        <div>Contenido</div>
      </QueryStatus>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Cargando...');
    expect(screen.queryByText('Contenido')).not.toBeInTheDocument();
  });

  it('muestra un mensaje de carga personalizado', () => {
    render(
      <QueryStatus isLoading isError={false} loadingMessage="Obteniendo datos...">
        <div>Contenido</div>
      </QueryStatus>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Obteniendo datos...');
  });

  it('muestra el estado de error con el mensaje del error', () => {
    render(
      <QueryStatus isLoading={false} isError error={new Error('API Error')}>
        <div>Contenido</div>
      </QueryStatus>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('API Error');
    expect(screen.queryByText('Contenido')).not.toBeInTheDocument();
  });

  it('muestra un mensaje genérico cuando no hay detalle del error', () => {
    render(
      <QueryStatus isLoading={false} isError>
        <div>Contenido</div>
      </QueryStatus>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Ocurrió un error al cargar los datos.');
  });

  it('renderiza el contenido cuando la query fue exitosa', () => {
    render(
      <QueryStatus isLoading={false} isError={false}>
        <div>Contenido</div>
      </QueryStatus>,
    );

    expect(screen.getByText('Contenido')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
