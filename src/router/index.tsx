import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/features/worldCups/pages/HomePage';
import WorldCupDetailPage from '@/features/worldCups/pages/WorldCupDetailPage';
import HistoricalStandingsPage from '@/features/historicalStandings/pages/HistoricalStandingsPage';
import HistoricalScorersPage from '@/features/historicalScorers/pages/HistoricalScorersPage';
import ChampionsPage from '@/features/champions/pages/ChampionsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/worldcup/:year',
    element: <WorldCupDetailPage />,
  },
  {
    path: '/standings',
    element: <HistoricalStandingsPage />,
  },
  {
    path: '/scorers',
    element: <HistoricalScorersPage />,
  },
  {
    path: '/champions',
    element: <ChampionsPage />,
  },
]);
