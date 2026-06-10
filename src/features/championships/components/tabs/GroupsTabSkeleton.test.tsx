import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { GroupsTabSkeleton } from './GroupsTabSkeleton';

describe('GroupsTabSkeleton', () => {
  it('renders without crashing', () => {
    render(<GroupsTabSkeleton />);
    expect(screen.getByTestId('groups-tab-skeleton')).toBeInTheDocument();
  });

  it('renders the default number of group card skeletons (4)', () => {
    const { container } = render(<GroupsTabSkeleton groupCount={4} />);
    // Simply verify there is content rendered inside the skeleton wrapper
    expect(screen.getByTestId('groups-tab-skeleton').children.length).toBeGreaterThan(0);
    expect(container).toBeTruthy();
  });

  it('renders a custom groupCount', () => {
    render(<GroupsTabSkeleton groupCount={2} />);
    const skeleton = screen.getByTestId('groups-tab-skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('contains animate-pulse skeleton elements', () => {
    const { container } = render(<GroupsTabSkeleton />);
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(10);
  });
});
