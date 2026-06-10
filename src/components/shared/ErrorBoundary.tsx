import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import i18n from '@/i18n/config';

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
          <div className="bg-wc-surface-primary border border-wc-border-primary rounded-xl p-8 max-w-md w-full shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-5">
              <AlertTriangle className="h-7 w-7" aria-hidden="true" />
            </div>

            <h2 className="text-lg font-bold text-wc-text-primary mb-2 tracking-wide">
              {i18n.t('errorBoundary.title')}
            </h2>

            <p className="text-xs text-wc-text-muted mb-5 leading-relaxed">
              {i18n.t('errorBoundary.description')}
            </p>

            {error && (
              <div className="text-left bg-wc-surface-secondary border border-wc-border-primary rounded-lg p-3.5 mb-6 max-h-32 overflow-y-auto">
                <p className="text-[10px] text-wc-text-muted uppercase font-bold tracking-wider mb-1">
                  {i18n.t('errorBoundary.details')}
                </p>
                <code className="text-[11px] text-wc-warning whitespace-pre-wrap break-all leading-normal">
                  {error.name}: {error.message}
                </code>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                variant="default"
                onClick={this.reset}
                className="bg-wc-accent-gold text-wc-bg-primary hover:bg-wc-accent-gold-hover font-bold h-9 px-4 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                {i18n.t('actions.retry')}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-wc-border-primary hover:bg-wc-surface-secondary hover:text-wc-text-primary h-9 px-4 text-xs font-bold text-wc-text-muted cursor-pointer"
              >
                {i18n.t('actions.reloadPage')}
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
