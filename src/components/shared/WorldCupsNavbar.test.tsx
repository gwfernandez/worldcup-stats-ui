import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import WorldCupsNavbar from './WorldCupsNavbar';
import { isNavLinkActive, isWorldCupDetailPage } from './worldCupsNavbar.utils';

const ACTIVE_CLASS = 'text-wc-accent-gold';
const INACTIVE_CLASS = 'text-wc-text-muted';

describe('isNavLinkActive', () => {
  it('activates Mundiales only on home', () => {
    expect(isNavLinkActive('/', '/')).toBe(true);
    expect(isNavLinkActive('/', '/champions')).toBe(false);
    expect(isNavLinkActive('/', '/worldcup/1970')).toBe(false);
  });

  it('activates section links on their routes', () => {
    expect(isNavLinkActive('/champions', '/champions')).toBe(true);
    expect(isNavLinkActive('/standings', '/standings')).toBe(true);
    expect(isNavLinkActive('/scorers', '/scorers')).toBe(true);
  });

  it('deactivates all links on world cup detail pages', () => {
    expect(isNavLinkActive('/', '/worldcup/2022')).toBe(false);
    expect(isNavLinkActive('/champions', '/worldcup/2022')).toBe(false);
  });
});

describe('isWorldCupDetailPage', () => {
  it('matches world cup detail paths only', () => {
    expect(isWorldCupDetailPage('/worldcup/1970')).toBe(true);
    expect(isWorldCupDetailPage('/')).toBe(false);
    expect(isWorldCupDetailPage('/champions')).toBe(false);
  });
});

describe('WorldCupsNavbar', () => {
  const customLinks = [
    { label: 'Mundiales', href: '/' },
    { label: 'Campeones', href: '/champions' },
    { label: 'Posiciones', href: '/standings' },
    { label: 'Goleadores', href: '/scorers' },
  ];

  it('renders all links and logo correctly', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <WorldCupsNavbar logoText="Test Logo" links={customLinks} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Test Logo')).toBeInTheDocument();
    expect(screen.getByText('Mundiales')).toBeInTheDocument();
    expect(screen.getByText('Campeones')).toBeInTheDocument();
    expect(screen.getByText('Posiciones')).toBeInTheDocument();
    expect(screen.getByText('Goleadores')).toBeInTheDocument();
  });

  it('highlights the active link based on the route', () => {
    render(
      <MemoryRouter initialEntries={['/champions']}>
        <WorldCupsNavbar links={customLinks} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Campeones')).toHaveClass(ACTIVE_CLASS);
    expect(screen.getByRole('link', { name: 'Campeones' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Mundiales')).toHaveClass(INACTIVE_CLASS);
  });

  it('highlights Mundiales on home with default links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <WorldCupsNavbar />
      </MemoryRouter>,
    );

    expect(screen.getByText('Mundiales')).toHaveClass(ACTIVE_CLASS);
    expect(screen.getByText('Campeones')).toHaveClass(INACTIVE_CLASS);
  });

  it('highlights Campeones on /champions with default links', () => {
    render(
      <MemoryRouter initialEntries={['/champions']}>
        <WorldCupsNavbar />
      </MemoryRouter>,
    );

    expect(screen.getByText('Campeones')).toHaveClass(ACTIVE_CLASS);
    expect(screen.getByText('Mundiales')).toHaveClass(INACTIVE_CLASS);
  });

  it('does not highlight any link on world cup detail pages', () => {
    render(
      <MemoryRouter initialEntries={['/worldcup/1970']}>
        <WorldCupsNavbar links={customLinks} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Mundiales')).toHaveClass(INACTIVE_CLASS);
    expect(screen.getByText('Campeones')).toHaveClass(INACTIVE_CLASS);
    expect(screen.getByText('Posiciones')).toHaveClass(INACTIVE_CLASS);
    expect(screen.getByText('Goleadores')).toHaveClass(INACTIVE_CLASS);
  });

  it('changes default navigation labels when selecting English', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <WorldCupsNavbar />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Mundiales' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Inglés' }));

    expect(screen.getByRole('link', { name: 'World Cups' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Champions' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
  });
});
