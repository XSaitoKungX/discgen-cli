import type { WizardOptions } from '../../types/index.js';

export function generateHelpCommand(opts: WizardOptions): string {
  if (opts.commandType === 'prefix') {
    return `import type { Message, Client } from 'discord.js';
import type { PrefixCommand } from '../../types/index.js';

const help: PrefixCommand = {
  name: 'help',
  description: 'List available commands.',
  async execute(message: Message, _args: string[], _client: Client): Promise<void> {
    await message.reply('Commands are listed in the README. Use \`!<command>\` to run one.');
  },
};

export default help;
`;
  }

  return `import {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
} from 'discord.js';
import type { ChatInputCommandInteraction, Client } from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('List all available commands.');

export async function execute(interaction: ChatInputCommandInteraction, _client: Client): Promise<void> {
  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('## 📖 Commands'),
    )
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        ['### Utility', '\`/ping\` — Check bot latency', '\`/help\` — Show this menu'].join('\\n'),
      ),
    );

  await interaction.reply({
    components: [container],
    flags: MessageFlags.IsComponentsV2,
  });
}

export default { data, execute } satisfies Command;
`;
}
