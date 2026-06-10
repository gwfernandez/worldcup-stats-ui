import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';

// Componente que lanza error bajo demanda para probar el boundary
const BuggyComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('BuggyComponent crashed!');
  }
  return <div>Todo en orden</div>;
};

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  const originalLocation = window.location;

  beforeAll(() => {
    // Mockear window.location.reload
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: vi.fn() },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  beforeEach(() => {
    // Silenciar console.error para evitar logs de error esperados en la consola de test
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.clearAllMocks();
  });

  it('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Todo en orden')).toBeInTheDocument();
    expect(screen.queryByText('Ha ocurrido un error')).not.toBeInTheDocument();
  });

  it('renders default error fallback UI when a child component throws', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Ha ocurrido un error')).toBeInTheDocument();
    expect(
      screen.getByText(/Se produjo un fallo inesperado al renderizar esta sección/i),
    ).toBeInTheDocument();
    expect(screen.getByText('Error: BuggyComponent crashed!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reintentar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Recargar página/i })).toBeInTheDocument();
  });

  it('renders custom element fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback element</div>}>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom fallback element')).toBeInTheDocument();
    expect(screen.queryByText('Ha ocurrido un error')).not.toBeInTheDocument();
  });

  it('renders custom function fallback when provided', () => {
    const customFallbackFn = vi.fn(({ error, reset }) => (
      <div>
        <span>Custom fallback fn: {error.message}</span>
        <button onClick={reset}>Reset Custom</button>
      </div>
    ));

    render(
      <ErrorBoundary fallback={customFallbackFn}>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom fallback fn: BuggyComponent crashed!')).toBeInTheDocument();
    expect(customFallbackFn).toHaveBeenCalled();

    // Probar reset
    const callsBeforeReset = customFallbackFn.mock.calls.length;
    fireEvent.click(screen.getByRole('button', { name: /Reset Custom/i }));
    // Debería intentar renderizar los hijos de nuevo (lanzando error otra vez en este caso)
    expect(customFallbackFn.mock.calls.length).toBeGreaterThan(callsBeforeReset);
  });

  it('resets error state when clicking Reintentar button', () => {
    let shouldThrow = true;

    // Componente dinámico para poder cambiar el estado de error
    const DynamicBuggyComponent = () => {
      if (shouldThrow) {
        throw new Error('Crash!');
      }
      return <div>Recuperado con éxito</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <DynamicBuggyComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Ha ocurrido un error')).toBeInTheDocument();

    // Cambiar la bandera para que no lance error en el siguiente renderizado
    shouldThrow = false;

    // Rerender con los mismos componentes para reflejar el cambio en la variable local
    rerender(
      <ErrorBoundary>
        <DynamicBuggyComponent />
      </ErrorBoundary>,
    );

    // Hacer click en Reintentar
    fireEvent.click(screen.getByRole('button', { name: /Reintentar/i }));

    // Debería haberse recuperado e interactuar de nuevo con los hijos
    expect(screen.getByText('Recuperado con éxito')).toBeInTheDocument();
    expect(screen.queryByText('Ha ocurrido un error')).not.toBeInTheDocument();
  });

  it('calls window.location.reload when clicking Recargar página button', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    const reloadButton = screen.getByRole('button', { name: /Recargar página/i });
    fireEvent.click(reloadButton);

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});
