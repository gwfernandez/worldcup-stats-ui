import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import RootLayout from './RootLayout';

function renderWithRoute(initialPath: string, childContent = 'Child page content') {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          { index: true, element: <div>{childContent}</div> },
          { path: 'champions', element: <div>Champions page</div> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );

  return render(<RouterProvider router={router} />);
}

describe('RootLayout', () => {
  it('renders navbar on all routes', () => {
    renderWithRoute('/');

    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument();
    expect(screen.getByText('Mundiales')).toBeInTheDocument();
    expect(screen.getByText('Campeones')).toBeInTheDocument();
  });

  it('renders child route content via Outlet', () => {
    renderWithRoute('/', 'Home content');

    expect(screen.getByText('Home content')).toBeInTheDocument();
  });

  it('renders Outlet content on nested routes', () => {
    renderWithRoute('/champions');

    expect(screen.getByText('Champions page')).toBeInTheDocument();
  });

  it('does not log console errors on render', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithRoute('/');

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
