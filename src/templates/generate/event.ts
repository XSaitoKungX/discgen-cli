export const KNOWN_EVENTS = [
  'ready',
  'messageCreate',
  'messageDelete',
  'messageUpdate',
  'interactionCreate',
  'guildMemberAdd',
  'guildMemberRemove',
  'guildCreate',
  'guildDelete',
  'channelCreate',
  'channelDelete',
  'roleCreate',
  'roleDelete',
  'warn',
  'error',
] as const;

export type KnownEvent = (typeof KNOWN_EVENTS)[number];

export function generateEventFile(eventName: string): string {
  const isOnce = eventName === 'ready';
  return `import type { Event } from '../types/index.js';

const event: Event = {
  name: '${eventName}',
  once: ${String(isOnce)},
  async execute(...args: unknown[]): Promise<void> {
    // TODO: implement ${eventName} handler
    void args;
  },
};

export default event;
`;
}
