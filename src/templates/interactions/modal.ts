export function generateExampleModal(): string {
  return `import type { ModalSubmitInteraction, Client } from 'discord.js';
import type { ModalHandler } from '../../types/index.js';

const handler: ModalHandler = {
  customId: 'example_modal',
  async execute(interaction: ModalSubmitInteraction, _client: Client): Promise<void> {
    const value = interaction.fields.getTextInputValue('input_field');
    await interaction.reply({ content: \`You submitted: **\${value}**\`, ephemeral: true });
  },
};

export default handler;
`;
}
