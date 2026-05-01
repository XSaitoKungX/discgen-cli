export function generateExampleSelect(): string {
  return `import type { AnySelectMenuInteraction, Client } from 'discord.js';
import type { SelectHandler } from '../../types/index.js';

const handler: SelectHandler = {
  customId: 'example_select',
  async execute(interaction: AnySelectMenuInteraction, _client: Client): Promise<void> {
    const selected = interaction.values.join(', ');
    await interaction.reply({ content: \`You selected: **\${selected}**\`, ephemeral: true });
  },
};

export default handler;
`;
}
