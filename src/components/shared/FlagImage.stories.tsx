import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlagImage } from './FlagImage';

const meta = {
  title: 'Shared/FlagImage',
  component: FlagImage,
  args: {
    countryCode: 'ar',
    alt: 'Bandera de Argentina',
  },
} satisfies Meta<typeof FlagImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const CustomDimensions: Story = {
  args: {
    countryCode: 'br',
    alt: 'Bandera de Brasil',
    width: 48,
    height: 36,
  },
};
