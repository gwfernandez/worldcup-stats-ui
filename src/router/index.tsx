import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/shared/RootLayout';
import ChampionshipsPage from '@/features/championships/pages/ChampionshipsPage';
import ChampionshipDetailPage from '@/features/championships/pages/ChampionshipDetailPage';
import HistoricalStandingsPage from '@/features/historicalStandings/pages/HistoricalStandingsPage';
import HistoricalScorersPage from '@/features/historicalScorers/pages/HistoricalScorersPage';
import ChampionsPage from '@/features/champions/pages/ChampionsPage';

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
