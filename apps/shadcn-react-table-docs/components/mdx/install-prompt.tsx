import { CopyButton } from './copy-button';
import { buildLibraryInstallPrompt } from '@/lib/install';

/** "Copy prompt": the agent instructions for installing the library. */
export const InstallPrompt = () => (
  <div data-slot="install-prompt" className="not-prose">
    <CopyButton text={buildLibraryInstallPrompt()} label="Copy prompt" />
  </div>
);
