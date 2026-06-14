import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { FlagImage } from './FlagImage';

describe('FlagImage', () => {
  it('renders flag-icons classes for supported alpha-2 codes', () => {
    render(<FlagImage countryCode="AR" alt="Argentina" />);
    const flag = screen.getByRole('img', { name: 'Argentina' });
    expect(flag).toHaveClass('fi', 'fi-ar');
  });

  it('renders flag-icons classes for FIFA codes', () => {
    render(<FlagImage countryCode="ENG" alt="England" />);
    const flag = screen.getByRole('img', { name: 'England' });
    expect(flag).toHaveClass('fi', 'fi-gb-eng');
  });

  it('uses configured dimensions', () => {
    render(<FlagImage countryCode="BR" alt="Brasil" size="md" />);
    const flag = screen.getByRole('img', { name: 'Brasil' });
    expect(flag).toHaveStyle({ width: '24px', height: '18px' });
  });

  it('uses explicit dimensions when provided', () => {
    render(<FlagImage countryCode="BR" alt="Brasil" width={16} height={11} />);
    const flag = screen.getByRole('img', { name: 'Brasil' });
    expect(flag).toHaveStyle({ width: '16px', height: '11px' });
  });

  it('renders neutral fallback for unsupported codes', () => {
    render(<FlagImage countryCode="URS" alt="URSS" />);
    const fallback = screen.getByRole('img', { name: 'URSS' });
    expect(fallback).not.toHaveClass('fi');
    expect(fallback).toHaveTextContent('UR');
  });
});
