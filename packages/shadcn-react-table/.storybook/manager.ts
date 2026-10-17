import { addons } from 'storybook/manager-api';
import { darkTheme, lightTheme, readStoredMode } from './themes';

// First paint of the manager chrome. storybook-dark-mode's preset falls back
// to the OS scheme when nothing is stored; we want dark by default, and the
// user's persisted toggle when there is one (avoids a light->dark flash).
addons.setConfig({
  theme: readStoredMode() === 'dark' ? darkTheme : lightTheme,
});
