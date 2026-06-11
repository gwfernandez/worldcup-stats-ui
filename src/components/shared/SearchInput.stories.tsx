import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SearchInput } from './SearchInput';

type InteractiveSearchInputProps = React.ComponentProps<typeof SearchInput> & {
  initialValue: string;
};

function InteractiveSearchInput({ initialValue, ...args }: InteractiveSearchInputProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <SearchInput {...args} value={value} onChange={(event) => setValue(event.target.value)} />
  );
}

const meta = {
  title: 'Shared/SearchInput',
  component: SearchInput,
  args: {
    value: '',
    onChange: () => undefined,
    placeholder: 'Buscar selección',
    className: 'w-72',
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: (args) => <InteractiveSearchInput {...args} initialValue="" />,
};

export const WithValue: Story = {
  render: (args) => <InteractiveSearchInput {...args} initialValue="Argentina" />,
};
