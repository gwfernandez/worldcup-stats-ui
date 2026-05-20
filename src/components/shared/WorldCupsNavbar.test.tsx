import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import WorldCupsNavbar from './WorldCupsNavbar';

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

    const championsLink = screen.getByText('Campeones');
    const mundialesLink = screen.getByText('Mundiales');

    expect(championsLink).toHaveClass('text-[#e8c84a]');
    expect(mundialesLink).toHaveClass('text-[#8a8fa8]');
  });

  it('highlights Mundiales when visiting a detail subroute like /worldcup/1970', () => {
    render(
      <MemoryRouter initialEntries={['/worldcup/1970']}>
        <WorldCupsNavbar links={customLinks} />
      </MemoryRouter>,
    );

    const mundialesLink = screen.getByText('Mundiales');
    const championsLink = screen.getByText('Campeones');

    expect(mundialesLink).toHaveClass('text-[#e8c84a]');
    expect(championsLink).toHaveClass('text-[#8a8fa8]');
  });
});
