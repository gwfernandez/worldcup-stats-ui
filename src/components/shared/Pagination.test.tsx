import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('no renderiza controles cuando hay una sola página', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={8}
        pageSize={10}
        onPageChange={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('muestra el rango de elementos y deshabilita anterior en la primera página', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        totalItems={25}
        pageSize={10}
        itemsLabel="selecciones"
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByText('1–10 de 25 selecciones')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Página siguiente' })).toBeEnabled();
    expect(screen.getByTestId('pagination-layout')).toHaveClass(
      'flex-col',
      'sm:flex-row',
      'min-w-0',
    );
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('llama onPageChange al navegar con botones y páginas', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={2}
        totalPages={4}
        totalItems={35}
        pageSize={10}
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Página anterior' }));
    await user.click(screen.getByRole('button', { name: 'Página 4' }));
    await user.click(screen.getByRole('button', { name: 'Página siguiente' }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 4);
    expect(onPageChange).toHaveBeenNthCalledWith(3, 3);
  });

  it('muestra elipsis cuando hay muchas páginas', () => {
    render(
      <Pagination
        currentPage={6}
        totalPages={10}
        totalItems={100}
        pageSize={10}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getAllByText('…')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Página 5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página 6' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: 'Página 7' })).toBeInTheDocument();
  });
});
