import type { Meta, StoryObj } from '@storybook/react-vite';
import { Info } from 'lucide-react';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Shared/Tooltip',
  component: Tooltip,
  args: {
    content: 'Campeón vigente',
    children: (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-wc-border-primary bg-wc-surface-primary text-wc-accent-gold">
        <Info size={14} aria-hidden="true" />
      </span>
    ),
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OptionalEmpty: Story = {
  args: {
    content: '',
    hideWhenEmpty: true,
    children: (
      <span className="rounded-md border border-wc-border-primary bg-wc-surface-primary px-3 py-2 text-xs">
        Sin tooltip opcional
      </span>
    ),
  },
};
