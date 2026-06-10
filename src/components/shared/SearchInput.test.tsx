import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders with placeholder and value', () => {
    render(<SearchInput value="Argentina" onChange={vi.fn()} placeholder="Buscar selección..." />);
    expect(screen.getByPlaceholderText('Buscar selección...')).toHaveValue('Argentina');
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} placeholder="Buscar..." />);

    await user.type(screen.getByPlaceholderText('Buscar...'), 'Bra');

    expect(onChange).toHaveBeenCalledTimes(3);
  });
});
