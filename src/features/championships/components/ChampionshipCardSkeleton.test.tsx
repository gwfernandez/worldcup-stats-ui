import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { ChampionshipCardSkeleton } from './ChampionshipCardSkeleton';

describe('ChampionshipCardSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<ChampionshipCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has aria-hidden to exclude it from accessibility tree', () => {
    const { container } = render(<ChampionshipCardSkeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the logo placeholder area', () => {
    const { container } = render(<ChampionshipCardSkeleton />);
    // logo area has a fixed height class h-24
    const logoArea = container.querySelector('.h-24');
    expect(logoArea).toBeInTheDocument();
  });

  it('contains multiple skeleton pulse elements', () => {
    const { container } = render(<ChampionshipCardSkeleton />);
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(3);
  });
});
