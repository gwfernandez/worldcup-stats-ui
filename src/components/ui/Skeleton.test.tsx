import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders successfully with default classes', () => {
    const { container } = render(<Skeleton data-testid="skeleton" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('animate-pulse');
  });

  it('accepts and applies custom className', () => {
    const { container } = render(<Skeleton className="w-10 h-10" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('w-10');
    expect(element).toHaveClass('h-10');
  });
});
