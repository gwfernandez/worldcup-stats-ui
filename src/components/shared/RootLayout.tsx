import { Outlet } from 'react-router-dom';
import WorldCupsNavbar from '@/components/shared/WorldCupsNavbar';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

export default function RootLayout() {
  return (
    <div className="min-h-screen w-full min-w-0 bg-wc-bg-primary text-wc-text-primary">
      <WorldCupsNavbar />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
