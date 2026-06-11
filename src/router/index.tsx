import { Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/shared/RootLayout';
import { RouteLoadingState } from '@/components/shared';
import {
  ChampionsPage,
  ChampionshipDetailPage,
  ChampionshipsPage,
  HistoricalScorersPage,
  HistoricalStandingsPage,
} from './lazyRouteComponents';

const withRouteSuspense = (element: ReactNode) => (
  <Suspense fallback={<RouteLoadingState />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: withRouteSuspense(<ChampionshipsPage />) },
      { path: 'worldcup/:year', element: withRouteSuspense(<ChampionshipDetailPage />) },
      { path: 'standings', element: withRouteSuspense(<HistoricalStandingsPage />) },
      { path: 'scorers', element: withRouteSuspense(<HistoricalScorersPage />) },
      { path: 'champions', element: withRouteSuspense(<ChampionsPage />) },
    ],
  },
]);
