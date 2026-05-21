import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { FlagImage } from './FlagImage';

describe('FlagImage', () => {
  it('renders flag with FlagCDN url', () => {
    render(<FlagImage countryCode="AR" alt="Argentina" />);
    const img = screen.getByRole('img', { name: 'Argentina' });
    expect(img).toHaveAttribute('src', 'https://flagcdn.com/24x18/ar.png');
  });

  it('uses md size url when specified', () => {
    render(<FlagImage countryCode="BR" alt="Brasil" size="md" />);
    const img = screen.getByRole('img', { name: 'Brasil' });
    expect(img).toHaveAttribute('src', 'https://flagcdn.com/48x36/br.png');
  });

  it('hides image on error', () => {
    render(<FlagImage countryCode="XX" alt="Unknown" />);
    const img = screen.getByRole('img', { name: 'Unknown' });
    fireEvent.error(img);
    expect(img).not.toBeVisible();
  });
});
