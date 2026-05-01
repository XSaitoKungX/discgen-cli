import { kebabToCamel } from './command.js';

export function generateGuardFile(name: string): string {
  const fnName = kebabToCamel(name) + 'Guard';
  return `import type { ChatInputCommandInteraction } from 'discord.js';

export async function ${fnName}(
  interaction: ChatInputCommandInteraction,
): Promise<boolean> {
  // TODO: implement ${name} guard logic
  // Return false and reply to block command execution
  void interaction;
  return true;
}
`;
}
