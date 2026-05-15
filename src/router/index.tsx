import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../features/worldcups/components/HomePage';
import WorldCupDetailPage from '../features/worldcups/components/WorldCupDetailPage';
import HistoricalStandingsPage from '../features/historicalStandings/componentes/pages/HistoricalStandingsPage';

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
]);
