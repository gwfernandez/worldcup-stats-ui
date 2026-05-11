import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../features/worldcups/components/HomePage';
import WorldCupDetailPage from '../features/worldcups/components/WorldCupDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/worldcup/:year',
    element: <WorldCupDetailPage />,
  },
]);
