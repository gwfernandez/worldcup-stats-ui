import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders with placeholder and value', () => {
    render(<SearchInput value="Argentina" onChange={vi.fn()} placeholder="Buscar selección..." />);
    expect(screen.getByPlaceholderText('Buscar selección...')).toHaveValue('Argentina');
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} placeholder="Buscar..." />);
    fireEvent.change(screen.getByPlaceholderText('Buscar...'), { target: { value: 'Bra' } });
    expect(onChange).toHaveBeenCalled();
  });
});
