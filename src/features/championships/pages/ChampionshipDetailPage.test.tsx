import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import ChampionshipDetailPage from './ChampionshipDetailPage';

function renderAtPath(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const router = createMemoryRouter(
    [
      { path: '/', element: <div>Home</div> },
      { path: '/worldcup/:year', element: <ChampionshipDetailPage /> },
    ],
    { initialEntries: [path] },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('ChampionshipDetailPage', () => {
  it('shows 2022 when navigating to /worldcup/2022', async () => {
    renderAtPath('/worldcup/2022');

    expect(await screen.findByText('2022')).toBeInTheDocument();
    expect(screen.getByText(/La Copa Mundial de la FIFA de 2022 se celebró/)).toBeInTheDocument();
  });

  it('shows 1994 when navigating to /worldcup/1994', async () => {
    renderAtPath('/worldcup/1994');

    expect(await screen.findByText('1994')).toBeInTheDocument();
    expect(screen.getByText(/La Copa Mundial de la FIFA de 1994 se celebró/)).toBeInTheDocument();
  });

  it('redirects to home when year param is not a valid number', () => {
    renderAtPath('/worldcup/invalid');

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText(/La Copa Mundial de la FIFA/)).not.toBeInTheDocument();
  });
});
