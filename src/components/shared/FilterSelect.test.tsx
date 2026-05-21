import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { FilterSelect } from './FilterSelect';

describe('FilterSelect', () => {
  const options = [
    { value: 'UEFA', label: 'UEFA' },
    { value: 'CONMEBOL', label: 'CONMEBOL' },
  ];

  it('renders placeholder and options', () => {
    render(
      <FilterSelect value="" onChange={vi.fn()} placeholderOption="Todas" options={options} />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('UEFA')).toBeInTheDocument();
    expect(screen.getByText('CONMEBOL')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', () => {
    const onChange = vi.fn();
    render(
      <FilterSelect value="" onChange={onChange} placeholderOption="Todas" options={options} />,
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'UEFA' } });
    expect(onChange).toHaveBeenCalled();
  });
});
