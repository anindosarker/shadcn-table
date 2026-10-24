import { AgentBar } from '@/components/agent-bar';
import { agentPrompt } from '@/lib/install';

/** The agent bar on docs pages, with the site's prompt. */
export const AgentPrompt = () => <AgentBar prompt={agentPrompt} />;
