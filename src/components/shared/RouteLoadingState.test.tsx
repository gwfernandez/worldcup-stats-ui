import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import { RouteLoadingState } from './RouteLoadingState';

describe('RouteLoadingState', () => {
  it('renderiza un estado de carga accesible para rutas lazy', () => {
    render(<RouteLoadingState />);

    expect(screen.getByRole('status')).toHaveAccessibleName('Cargando vista...');
  });
});
