import { useTranslation } from 'react-i18next';
import { Skeleton } from '../ui/Skeleton';

export function RouteLoadingState() {
  const { t } = useTranslation('common');
  const loadingMessage = t('status.routeLoading');

  return (
    <main
      role="status"
      aria-label={loadingMessage}
      aria-live="polite"
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8"
    >
      <span className="sr-only">{loadingMessage}</span>
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-64 w-full" />
    </main>
  );
}
