export function generateButtonFile(name: string): string {
  const customId = name.replace(/-/g, '_');
  return `import type { ButtonInteraction, Client } from 'discord.js';
import type { ButtonHandler } from '../../types/index.js';

const handler: ButtonHandler = {
  customId: '${customId}',
  async execute(interaction: ButtonInteraction, _client: Client): Promise<void> {
    await interaction.reply({ content: '✅ Handled button: ${customId}', ephemeral: true });
  },
};

export default handler;
`;
}

export function generateSelectFile(name: string): string {
  const customId = name.replace(/-/g, '_');
  return `import type { AnySelectMenuInteraction, Client } from 'discord.js';
import type { SelectHandler } from '../../types/index.js';

const handler: SelectHandler = {
  customId: '${customId}',
  async execute(interaction: AnySelectMenuInteraction, _client: Client): Promise<void> {
    const selected = interaction.values.join(', ');
    await interaction.reply({ content: \`Selected: **\${selected}**\`, ephemeral: true });
  },
};

export default handler;
`;
}

export function generateModalFile(name: string): string {
  const customId = name.replace(/-/g, '_');
  return `import type { ModalSubmitInteraction, Client } from 'discord.js';
import type { ModalHandler } from '../../types/index.js';

const handler: ModalHandler = {
  customId: '${customId}',
  async execute(interaction: ModalSubmitInteraction, _client: Client): Promise<void> {
    // Access fields: interaction.fields.getTextInputValue('field_id')
    await interaction.reply({ content: '✅ Form submitted!', ephemeral: true });
  },
};

export default handler;
`;
}
