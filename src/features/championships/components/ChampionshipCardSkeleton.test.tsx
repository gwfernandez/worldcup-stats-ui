import { render } from '@testing-library/react';
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

  it('renders the centered minimal card placeholders', () => {
    const { container } = render(<ChampionshipCardSkeleton />);
    expect(container.querySelector('.h-\\[72px\\].w-24')).toBeInTheDocument();
    expect(container.querySelector('.h-\\[22px\\].w-14')).toBeInTheDocument();
    expect(container.querySelector('.h-3.w-20')).toBeInTheDocument();
  });

  it('contains multiple skeleton pulse elements', () => {
    const { container } = render(<ChampionshipCardSkeleton />);
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(3);
  });
});
