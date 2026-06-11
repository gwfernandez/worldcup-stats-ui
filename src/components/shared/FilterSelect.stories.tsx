import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FilterSelect } from './FilterSelect';

type InteractiveFilterSelectProps = React.ComponentProps<typeof FilterSelect> & {
  initialValue: string;
};

const confederations = [
  { value: 'conmebol', label: 'CONMEBOL' },
  { value: 'uefa', label: 'UEFA' },
  { value: 'concacaf', label: 'CONCACAF' },
  { value: 'caf', label: 'CAF' },
];

function InteractiveFilterSelect({ initialValue, ...args }: InteractiveFilterSelectProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <FilterSelect {...args} value={value} onChange={(event) => setValue(event.target.value)} />
  );
}

const meta = {
  title: 'Shared/FilterSelect',
  component: FilterSelect,
  args: {
    value: '',
    onChange: () => undefined,
    options: confederations,
    placeholderOption: 'Todas las confederaciones',
    className: 'w-64',
  },
} satisfies Meta<typeof FilterSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPlaceholder: Story = {
  render: (args) => <InteractiveFilterSelect {...args} initialValue="" />,
};

export const Selected: Story = {
  render: (args) => <InteractiveFilterSelect {...args} initialValue="conmebol" />,
};
