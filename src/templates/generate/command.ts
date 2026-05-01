export function generateSlashCommandFile(name: string): string {
  return `import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('${name}')
  .setDescription('Description for ${name}.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  await interaction.reply({ content: 'Hello from /${name}!', ephemeral: true });
}

export default { data, execute } satisfies Command;
`;
}

export function generatePrefixCommandFile(name: string): string {
  const camelName = kebabToCamel(name);
  return `import type { Message, Client } from 'discord.js';
import type { PrefixCommand } from '../../types/index.js';

const ${camelName}: PrefixCommand = {
  name: '${name}',
  description: 'Description for ${name}.',
  async execute(message: Message, _args: string[], _client: Client): Promise<void> {
    await message.reply('Hello from !${name}!');
  },
};

export default ${camelName};
`;
}

export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}
