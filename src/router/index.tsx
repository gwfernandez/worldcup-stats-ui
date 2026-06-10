import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/shared/RootLayout';
import { ChampionsPage } from '@/features/champions';
import { ChampionshipDetailPage, ChampionshipsPage } from '@/features/championships';
import { HistoricalScorersPage } from '@/features/historicalScorers';
import { HistoricalStandingsPage } from '@/features/historicalStandings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <ChampionshipsPage /> },
      { path: 'worldcup/:year', element: <ChampionshipDetailPage /> },
      { path: 'standings', element: <HistoricalStandingsPage /> },
      { path: 'scorers', element: <HistoricalScorersPage /> },
      { path: 'champions', element: <ChampionsPage /> },
    ],
  },
]);
