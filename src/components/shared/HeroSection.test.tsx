import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { Trophy } from 'lucide-react';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  it('renderiza contenido textual, stats y oculta el bloque visual en mobile', () => {
    render(
      <HeroSection
        badge="Archivo"
        title="Copas del mundo"
        titleAccent="FIFA"
        description="Estadisticas historicas"
        stats={[{ icon: Trophy, value: '22', label: 'Ediciones' }]}
      />,
    );

    expect(screen.getByText('Archivo')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Copas del mundo FIFA/i })).toBeInTheDocument();
    expect(screen.getByText('Estadisticas historicas')).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();

    expect(screen.getByText('hero image').parentElement?.parentElement).toHaveClass(
      'hidden',
      'shrink-0',
      'md:block',
    );
  });
});
