import { lazy } from 'react';

export const ChampionshipsPage = lazy(
  () => import('@/features/championships/pages/ChampionshipsPage'),
);
export const ChampionshipDetailPage = lazy(
  () => import('@/features/championships/pages/ChampionshipDetailPage'),
);
export const HistoricalStandingsPage = lazy(
  () => import('@/features/historicalStandings/pages/HistoricalStandingsPage'),
);
export const HistoricalScorersPage = lazy(
  () => import('@/features/historicalScorers/pages/HistoricalScorersPage'),
);
export const ChampionsPage = lazy(() => import('@/features/champions/pages/ChampionsPage'));
