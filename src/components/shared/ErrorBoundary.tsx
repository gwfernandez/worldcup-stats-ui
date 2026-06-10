import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error; reset: () => void }) => ReactNode);
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside ErrorBoundary:', error, errorInfo);
  }

  public reset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      const { error } = this.state;

      if (fallback) {
        if (typeof fallback === 'function') {
          return (fallback as (props: { error: Error; reset: () => void }) => ReactNode)({
            error: error!,
            reset: this.reset,
          });
        }
        return fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center font-mono animate-fade-in">
          <div className="bg-[#161925] border border-[#2a2d3a] rounded-xl p-8 max-w-md w-full shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-5">
              <AlertTriangle className="h-7 w-7" aria-hidden="true" />
            </div>

            <h2 className="text-lg font-bold text-[#e8eaf0] mb-2 tracking-wide">
              Ha ocurrido un error
            </h2>

            <p className="text-xs text-[#8a8fa8] mb-5 leading-relaxed">
              Se produjo un fallo inesperado al renderizar esta sección. Puedes intentar restaurar la vista o recargar la página.
            </p>

            {error && (
              <div className="text-left bg-[#1e2233] border border-[#2a2d3a] rounded-lg p-3.5 mb-6 max-h-32 overflow-y-auto">
                <p className="text-[10px] text-[#8a8fa8] uppercase font-bold tracking-wider mb-1">
                  Detalles del error:
                </p>
                <code className="text-[11px] text-[#ff9f43] whitespace-pre-wrap break-all leading-normal">
                  {error.name}: {error.message}
                </code>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                variant="default"
                onClick={this.reset}
                className="bg-[#e8c84a] text-[#0f1117] hover:bg-[#d0b038] font-bold h-9 px-4 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Reintentar
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-[#2a2d3a] hover:bg-[#1e2233] hover:text-[#e8eaf0] h-9 px-4 text-xs font-bold text-[#8a8fa8] cursor-pointer"
              >
                Recargar página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
