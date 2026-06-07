import type { ReactNode } from 'react';

export interface QueryStatusProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  loadingMessage?: string;
  children: ReactNode;
}

/**
 * Muestra estados básicos de carga y error para queries de TanStack Query.
 * Renderiza `children` cuando los datos están disponibles.
 */
export function QueryStatus({
  isLoading,
  isError,
  error,
  loadingMessage = 'Cargando...',
  children,
}: QueryStatusProps) {
  if (isLoading) {
    return (
      <p role="status" className="text-sm text-[#8a8fa8] font-mono py-8 text-center">
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
