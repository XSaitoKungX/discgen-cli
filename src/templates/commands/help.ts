import type { WizardOptions } from '../../types/index.js';

function buildHelpSections(opts: WizardOptions): string {
  const sections: string[] = [];

  const general = ['`/ping` — Check bot latency', '`/help` — Show this menu'];
  sections.push('### General\n' + general.join('\n'));

  if (opts.features.includes('utility')) {
    const cmds = ['`/userinfo` — Info about a user', '`/serverinfo` — Server statistics', '`/avatar` — Show user avatar'];
    sections.push('### Utility\n' + cmds.join('\n'));
  }

  if (opts.features.includes('moderation')) {
    const cmds = ['`/ban` — Ban a member', '`/kick` — Kick a member', '`/timeout` — Timeout a member', '`/warn` — Warn a member'];
    sections.push('### Moderation\n' + cmds.join('\n'));
  }

  if (opts.features.includes('fun')) {
    const cmds = ['`/coinflip` — Flip a coin', '`/8ball` — Ask the magic 8-ball', '`/meme` — Random meme'];
    sections.push('### Fun\n' + cmds.join('\n'));
  }

  if (opts.features.includes('economy')) {
    const cmds = ['`/balance` — Check your coin balance', '`/daily` — Claim your daily reward', '`/leaderboard` — Top 10 richest users'];
    sections.push('### Economy\n' + cmds.join('\n'));
  }

  if (opts.features.includes('music')) {
    const cmds = ['`/play` — Play a track', '`/stop` — Stop playback'];
    sections.push('### Music\n' + cmds.join('\n'));
  }

  if (opts.features.includes('components')) {
    sections.push('### Demo\n`/demo` — Components v2 interactive demo');
  }

  return '## 📖 Commands\n\n' + sections.join('\n\n');
}

export function generateHelpCommand(opts: WizardOptions): string {
  if (opts.commandType === 'prefix') {
    const prefixSections: string[] = ['**General**', '`!help` — Show this menu', '`!ping` — Check bot latency'];

    if (opts.features.includes('moderation')) {
      prefixSections.push('', '**Moderation**', '`!ban` — Ban a member', '`!kick` — Kick a member', '`!timeout` — Timeout a member', '`!warn` — Warn a member');
    }
    if (opts.features.includes('fun')) {
      prefixSections.push('', '**Fun**', '`!coinflip` — Flip a coin', '`!8ball` — Ask the 8-ball', '`!meme` — Random meme');
    }
    if (opts.features.includes('economy')) {
      prefixSections.push('', '**Economy**', '`!balance` — Check balance', '`!daily` — Daily reward', '`!leaderboard` — Leaderboard');
    }

    const prefixContent = prefixSections.join('\\n');

    return `import type { Message, Client } from 'discord.js';
import type { PrefixCommand } from '../../types/index.js';

const help: PrefixCommand = {
  name: 'help',
  description: 'List available commands.',
  async execute(message: Message, _args: string[], _client: Client): Promise<void> {
    await message.reply(${JSON.stringify(prefixContent)});
  },
};

export default help;
`;
  }

  const content = buildHelpSections(opts);

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
      new TextDisplayBuilder().setContent(${JSON.stringify(content)}),
    )
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('> Use \`/help\` any time to see this list.'),
    );

  await interaction.reply({
    components: [container],
    flags: MessageFlags.IsComponentsV2,
  });
}

export default { data, execute } satisfies Command;
`;
}
