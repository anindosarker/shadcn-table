import { useEffect } from 'react';
import { addons } from '@storybook/preview-api';
import type { Preview } from '@storybook/react';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import '../src/index.css';

const channel = addons.getChannel();

const preview: Preview = {
  // Generate an autodocs page (with a working "Show code" Source block) for
  // every story, mirroring material-react-table's storybook.
  tags: ['autodocs'],
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
    docs: {
      // Show the real story source from the file. The default 'dynamic' mode
      // serializes the rendered table tree, which threw on the heavy SRT
      // component (the stale "ColumnsIcon is not defined" eval). 'code' reads
      // the static source instead — accurate snippets, no render-time eval.
      source: { type: 'code' },
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
