import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders trigger and tooltip content', () => {
    render(
      <Tooltip content="Confederación Sudamericana de Fútbol">
        <span>CONMEBOL</span>
      </Tooltip>,
    );
    expect(screen.getByText('CONMEBOL')).toBeInTheDocument();
    expect(screen.getByText('Confederación Sudamericana de Fútbol')).toBeInTheDocument();
  });

  it('renders only children when hideWhenEmpty and content is empty', () => {
    render(
      <Tooltip content="" hideWhenEmpty>
        <span>Sin tooltip</span>
      </Tooltip>,
    );
    expect(screen.getByText('Sin tooltip')).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('can align tooltip content toward the end of its trigger', () => {
    render(
      <Tooltip content="Confederación" align="end">
        <span>UEFA</span>
      </Tooltip>,
    );

    expect(screen.getByText('Confederación')).toHaveClass('right-0');
  });
});
