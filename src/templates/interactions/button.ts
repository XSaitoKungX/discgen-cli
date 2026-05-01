export function generateExampleButton(): string {
  return `import type { ButtonInteraction, Client } from 'discord.js';
import type { ButtonHandler } from '../../types/index.js';

const handler: ButtonHandler = {
  customId: 'example_button',
  async execute(interaction: ButtonInteraction, _client: Client): Promise<void> {
    await interaction.reply({ content: '✅ Button clicked!', ephemeral: true });
  },
};

export default handler;
`;
}

export function generateOpenModalButton(): string {
  return `import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from 'discord.js';
import type { ButtonInteraction, Client } from 'discord.js';
import type { ButtonHandler } from '../../types/index.js';

const handler: ButtonHandler = {
  customId: 'open_modal',
  async execute(interaction: ButtonInteraction, _client: Client): Promise<void> {
    const modal = new ModalBuilder()
      .setCustomId('example_modal')
      .setTitle('Example Form');

    const inputField = new TextInputBuilder()
      .setCustomId('input_field')
      .setLabel('Enter something')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Type here...')
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(inputField),
    );

    await interaction.showModal(modal);
  },
};

export default handler;
`;
}
