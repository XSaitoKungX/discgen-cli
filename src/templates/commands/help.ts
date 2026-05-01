import type { WizardOptions } from '../../types/index.js';

export function generateHelpCommand(opts: WizardOptions): string {
  const useComponents = opts.commandType === 'slash' || opts.commandType === 'both';

  if (!useComponents) {
    return `
import { Message } from 'discord.js';
import type { Command } from '../../types/index.js';

const help: Command = {
  name: 'help',
  description: 'List available commands.',
  async execute(message: Message) {
    await message.reply('Use \`!help\` — commands are listed in the README.');
  },
};

export default help;
`.trim();
  }

  return `
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
} from 'discord.js';
import type { SlashCommand } from '../../types/index.js';

const help: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all available commands.'),

  async execute(interaction: ChatInputCommandInteraction) {
    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('## 📖 Commands'),
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          [
            '### Utility',
            '\`/ping\` — Check bot latency',
            '\`/help\` — Show this menu',
          ].join('\\n'),
        ),
      );

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
    });
  },
};

export default help;
`.trim();
}
