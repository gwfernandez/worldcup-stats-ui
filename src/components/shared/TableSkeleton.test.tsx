import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { TableSkeleton } from './TableSkeleton';

describe('TableSkeleton', () => {
  it('renders without crashing with default props', () => {
    render(<TableSkeleton />);
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
  });

  it('renders the filter area by default (showFilters=true)', () => {
    render(<TableSkeleton />);
    const skeleton = screen.getByTestId('table-skeleton');
    // the filter row is the first child div
    const filters = skeleton.querySelector('[data-testid="table-skeleton-filters"]');
    expect(filters).toBeInTheDocument();
  });

  it('hides the filter area when showFilters=false', () => {
    render(<TableSkeleton showFilters={false} />);
    const filters = screen.queryByTestId('table-skeleton-filters');
    expect(filters).not.toBeInTheDocument();
  });

  it('renders the correct number of body rows', () => {
    render(<TableSkeleton rows={8} cols={3} />);
    const skeleton = screen.getByTestId('table-skeleton');
    const tbody = skeleton.querySelector('tbody');
    expect(tbody?.querySelectorAll('tr')).toHaveLength(8);
  });

  it('renders the correct number of columns in each row', () => {
    render(<TableSkeleton rows={2} cols={5} />);
    const skeleton = screen.getByTestId('table-skeleton');
    const firstRow = skeleton.querySelector('tbody tr');
    expect(firstRow?.querySelectorAll('td')).toHaveLength(5);
  });

  it('renders a pagination placeholder', () => {
    render(<TableSkeleton />);
    expect(screen.getByTestId('table-skeleton-pagination')).toBeInTheDocument();
  });
});
