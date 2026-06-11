import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

type InteractivePaginationProps = React.ComponentProps<typeof Pagination> & {
  initialPage: number;
};

function InteractivePagination({ initialPage, ...args }: InteractivePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
}

const meta = {
  title: 'Shared/Pagination',
  component: Pagination,
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 98,
    pageSize: 10,
    itemsLabel: 'equipos',
    onPageChange: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="w-[560px] rounded-lg border border-wc-border-primary bg-wc-surface-primary p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
  render: (args) => <InteractivePagination {...args} initialPage={1} />,
};

export const MiddlePage: Story = {
  render: (args) => <InteractivePagination {...args} initialPage={5} />,
};

export const LastPage: Story = {
  render: (args) => <InteractivePagination {...args} initialPage={10} />,
};
