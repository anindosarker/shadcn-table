import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/index.css';

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
    docs: {
      // Show the real story source from the file. The default 'dynamic' mode
      // serializes the rendered table tree, which threw on the heavy SRT
      // component (the stale "ColumnsIcon is not defined" eval). 'code' reads
      // the static source instead — accurate snippets, no render-time eval.
      source: { type: 'code' },
    },
  },
  decorators: [
    // Mirror the app: toggle the `.dark` class on <html> for Tailwind v4.
    // Adds a light/dark toolbar switch; dark is the default like before.
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'dark',
      parentSelector: 'html',
    }),
    (Story) => (
      <div className="bg-background p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default preview;
