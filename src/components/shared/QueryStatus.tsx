import type { ReactNode } from 'react';

export interface QueryStatusProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  loadingMessage?: string;
  /** Optional skeleton to render instead of the generic loading text. */
  skeleton?: ReactNode;
  children: ReactNode;
}

/**
 * Muestra estados básicos de carga y error para queries de TanStack Query.
 * Si se proporciona `skeleton`, lo renderiza cuando `isLoading` es true.
 * Renderiza `children` cuando los datos están disponibles.
 */
export function QueryStatus({
  isLoading,
  isError,
  error,
  loadingMessage = 'Cargando...',
  skeleton,
  children,
}: QueryStatusProps) {
  if (isLoading) {
    if (skeleton) {
      return (
        <div role="status">
          <span className="sr-only">{loadingMessage}</span>
          {skeleton}
        </div>
      );
    }
    return (
      <p role="status" className="text-sm text-wc-text-muted font-mono py-8 text-center">
        {loadingMessage}
      </p>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="text-sm text-red-400 font-mono py-8 text-center">
        {error?.message ?? 'Ocurrió un error al cargar los datos.'}
      </p>
    );
  }

  return <>{children}</>;
}
