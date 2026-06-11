import type { Preview } from '@storybook/react-vite';
import '../src/i18n/config';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-wc-bg-primary p-6 text-wc-text-primary">
        <Story />
      </div>
    ),
  ],
};

export default preview;
