import { useEffect } from 'react';
import { addons } from '@storybook/preview-api';
import type { Preview } from '@storybook/react';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import '../src/index.css';

const channel = addons.getChannel();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    darkMode: {
      current: 'dark',
    },
  },
  decorators: [
    (Story) => {
      // Mirror the app: toggle the `.dark` class on <html> for Tailwind v4.
      useEffect(() => {
        const apply = (isDark: boolean) =>
          document.documentElement.classList.toggle('dark', isDark);
        channel.on(DARK_MODE_EVENT_NAME, apply);
        return () => channel.off(DARK_MODE_EVENT_NAME, apply);
      }, []);

      return (
        <div className="bg-background p-4 text-foreground">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
